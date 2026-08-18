"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { checkLimit } from "@/lib/sama/limits";
import { parseAmount } from "@/lib/sama/money";

export interface FormState {
  error?: string;
  ok?: boolean;
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  sku: z.string().trim().optional(),
  categoryName: z.string().trim().optional(),
  description: z.string().trim().optional(),
  costPrice: z.string().optional(),
  salePrice: z.string().optional(),
  wholesalePrice: z.string().optional(),
  stock: z.string().optional(),
  alertThreshold: z.string().optional(),
  unit: z.string().trim().optional(),
});

async function resolveCategory(businessId: string, name?: string): Promise<string | null> {
  if (!name) return null;
  const existing = await prisma.samaCategory.findFirst({ where: { businessId, name } });
  if (existing) return existing.id;
  const created = await prisma.samaCategory.create({ data: { businessId, name } });
  return created.id;
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role, userId } = await requireTenant();
  try {
    assertPermission(role, "products.manage");
  } catch {
    return { error: "Vous n'avez pas la permission de gérer les produits." };
  }

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  const limitError = await checkLimit(business, "products");
  if (limitError) return { error: limitError };

  const stock = Math.max(0, parseInt(d.stock || "0", 10) || 0);
  const categoryId = await resolveCategory(business.id, d.categoryName);

  const product = await prisma.samaProduct.create({
    data: {
      businessId: business.id,
      name: d.name,
      sku: d.sku || null,
      categoryId,
      description: d.description || null,
      costPrice: parseAmount(d.costPrice || "0"),
      salePrice: parseAmount(d.salePrice || "0"),
      wholesalePrice: d.wholesalePrice ? parseAmount(d.wholesalePrice) : null,
      stock,
      alertThreshold: parseInt(d.alertThreshold || "5", 10) || 5,
      unit: d.unit || "pièce",
    },
  });

  if (stock > 0) {
    await prisma.samaInventoryMovement.create({
      data: {
        businessId: business.id,
        productId: product.id,
        type: "ENTREE",
        quantity: stock,
        stockAfter: stock,
        reason: "Stock initial",
        createdBy: userId,
      },
    });
  }

  await logActivity(business.id, userId, "product.created", { entity: "product", entityId: product.id, meta: { name: product.name } });
  revalidatePath("/sama/produits");
  revalidatePath("/sama/stock");
  return { ok: true };
}

export async function updateProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role, userId } = await requireTenant();
  try {
    assertPermission(role, "products.manage");
  } catch {
    return { error: "Permission refusée." };
  }
  const id = String(formData.get("id") || "");
  const product = await prisma.samaProduct.findFirst({ where: { id, businessId: business.id } });
  if (!product) return { error: "Produit introuvable." };

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;
  const categoryId = await resolveCategory(business.id, d.categoryName);

  await prisma.samaProduct.update({
    where: { id },
    data: {
      name: d.name,
      sku: d.sku || null,
      categoryId,
      description: d.description || null,
      costPrice: parseAmount(d.costPrice || "0"),
      salePrice: parseAmount(d.salePrice || "0"),
      wholesalePrice: d.wholesalePrice ? parseAmount(d.wholesalePrice) : null,
      alertThreshold: parseInt(d.alertThreshold || "5", 10) || 5,
      unit: d.unit || "pièce",
    },
  });
  await logActivity(business.id, userId, "product.updated", { entity: "product", entityId: id });
  revalidatePath("/sama/produits");
  return { ok: true };
}

/** Archivage (soft delete) — on ne supprime jamais définitivement. */
export async function archiveProductAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "products.manage");
  const id = String(formData.get("id") || "");
  await prisma.samaProduct.updateMany({
    where: { id, businessId: business.id },
    data: { archived: true, active: false },
  });
  await logActivity(business.id, userId, "product.archived", { entity: "product", entityId: id });
  revalidatePath("/sama/produits");
}

/** Mouvement de stock manuel (entrée, sortie, ajustement, retour…). */
export async function adjustStockAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "stock.manage");
  const productId = String(formData.get("productId") || "");
  const type = String(formData.get("type") || "AJUSTEMENT") as
    | "ENTREE" | "SORTIE" | "AJUSTEMENT" | "RETOUR_CLIENT" | "RETOUR_FOURNISSEUR" | "ENDOMMAGE";
  const qty = Math.abs(parseInt(String(formData.get("quantity") || "0"), 10) || 0);
  const reason = String(formData.get("reason") || "");
  if (qty === 0) return;

  const product = await prisma.samaProduct.findFirst({ where: { id: productId, businessId: business.id } });
  if (!product) return;

  const positive = ["ENTREE", "RETOUR_CLIENT"].includes(type);
  const delta = positive ? qty : -qty;
  const newStock = Math.max(0, product.stock + delta);

  await prisma.$transaction([
    prisma.samaProduct.update({ where: { id: productId }, data: { stock: newStock } }),
    prisma.samaInventoryMovement.create({
      data: {
        businessId: business.id,
        productId,
        type,
        quantity: delta,
        stockAfter: newStock,
        reason: reason || null,
        createdBy: userId,
      },
    }),
  ]);

  if (newStock <= product.alertThreshold) {
    await prisma.samaNotification.create({
      data: {
        businessId: business.id,
        type: "STOCK",
        title: "Stock faible",
        body: `Il ne reste que ${newStock} ${product.unit} de « ${product.name} ».`,
      },
    });
  }

  await logActivity(business.id, userId, "stock.movement", { entity: "product", entityId: productId, meta: { type, delta, newStock } });
  revalidatePath("/sama/stock");
  revalidatePath("/sama/produits");
}
