"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { planLimits } from "@/lib/sama/limits";
import { parseAmount } from "@/lib/sama/money";

export interface ImportState { error?: string; ok?: boolean; imported?: number; skipped?: number }

const productRow = z.object({
  name: z.string().trim().min(1),
  salePrice: z.union([z.string(), z.number()]),
  costPrice: z.union([z.string(), z.number()]).optional(),
  stock: z.union([z.string(), z.number()]).optional(),
  category: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  unit: z.string().trim().optional(),
});

export async function importProductsAction(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "products.manage"); } catch { return { error: "Permission refusée." }; }

  let rows: unknown;
  try { rows = JSON.parse(String(formData.get("rows") || "[]")); } catch { return { error: "Données invalides." }; }
  const parsed = z.array(productRow).safeParse(rows);
  if (!parsed.success || parsed.data.length === 0) return { error: "Aucune ligne valide à importer." };

  const plan = planLimits(business);
  const current = await prisma.samaProduct.count({ where: { businessId: business.id, archived: false } });
  const remaining = plan.maxProducts == null ? Infinity : Math.max(0, plan.maxProducts - current);

  // Pré-résolution des catégories
  const catNames = Array.from(new Set(parsed.data.map((r) => r.category?.trim()).filter(Boolean))) as string[];
  const catMap = new Map<string, string>();
  for (const name of catNames) {
    const existing = await prisma.samaCategory.findFirst({ where: { businessId: business.id, name } });
    catMap.set(name, existing ? existing.id : (await prisma.samaCategory.create({ data: { businessId: business.id, name } })).id);
  }

  let imported = 0, skipped = 0;
  for (const r of parsed.data) {
    if (imported >= remaining) { skipped++; continue; }
    const salePrice = parseAmount(r.salePrice);
    if (!r.name || salePrice <= 0) { skipped++; continue; }
    const stock = Math.max(0, parseInt(String(r.stock ?? "0"), 10) || 0);
    const p = await prisma.samaProduct.create({
      data: {
        businessId: business.id, name: r.name, salePrice, costPrice: parseAmount(r.costPrice ?? 0),
        stock, sku: r.sku || null, unit: r.unit || "pièce",
        categoryId: r.category ? catMap.get(r.category.trim()) ?? null : null,
      },
    });
    if (stock > 0) await prisma.samaInventoryMovement.create({ data: { businessId: business.id, productId: p.id, type: "ENTREE", quantity: stock, stockAfter: stock, reason: "Import" } });
    imported++;
  }

  await logActivity(business.id, userId, "products.imported", { meta: { imported, skipped } });
  revalidatePath("/sama/produits");
  return { ok: true, imported, skipped };
}

const customerRow = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  city: z.string().trim().optional(),
  source: z.string().trim().optional(),
});

export async function importCustomersAction(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "customers.manage"); } catch { return { error: "Permission refusée." }; }

  let rows: unknown;
  try { rows = JSON.parse(String(formData.get("rows") || "[]")); } catch { return { error: "Données invalides." }; }
  const parsed = z.array(customerRow).safeParse(rows);
  if (!parsed.success || parsed.data.length === 0) return { error: "Aucune ligne valide à importer." };

  const plan = planLimits(business);
  const current = await prisma.samaCustomer.count({ where: { businessId: business.id } });
  const remaining = plan.maxCustomers == null ? Infinity : Math.max(0, plan.maxCustomers - current);

  const valid = parsed.data.filter((r) => r.name).slice(0, remaining === Infinity ? undefined : remaining);
  const skipped = parsed.data.length - valid.length;

  if (valid.length > 0) {
    await prisma.samaCustomer.createMany({
      data: valid.map((r) => ({ businessId: business.id, name: r.name, phone: r.phone || null, email: r.email || null, city: r.city || null, source: r.source || null })),
    });
  }

  await logActivity(business.id, userId, "customers.imported", { meta: { imported: valid.length, skipped } });
  revalidatePath("/sama/clients");
  return { ok: true, imported: valid.length, skipped };
}
