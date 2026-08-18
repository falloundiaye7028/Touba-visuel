"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { parseAmount } from "@/lib/sama/money";
import type { FormState } from "./products";

const supplierSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  contact: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

// Les fournisseurs relèvent de la gestion des produits/achats.
export async function createSupplierAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role, userId } = await requireTenant();
  try { assertPermission(role, "products.manage"); } catch { return { error: "Permission refusée." }; }
  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;
  const s = await prisma.samaSupplier.create({
    data: { businessId: business.id, name: d.name, contact: d.contact || null, phone: d.phone || null, email: d.email || null, address: d.address || null, notes: d.notes || null },
  });
  await logActivity(business.id, userId, "supplier.created", { entity: "supplier", entityId: s.id });
  revalidatePath("/sama/fournisseurs");
  return { ok: true };
}

export async function updateSupplierAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role } = await requireTenant();
  try { assertPermission(role, "products.manage"); } catch { return { error: "Permission refusée." }; }
  const id = String(formData.get("id") || "");
  const existing = await prisma.samaSupplier.findFirst({ where: { id, businessId: business.id } });
  if (!existing) return { error: "Fournisseur introuvable." };
  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;
  await prisma.samaSupplier.update({ where: { id }, data: { name: d.name, contact: d.contact || null, phone: d.phone || null, email: d.email || null, address: d.address || null, notes: d.notes || null } });
  revalidatePath(`/sama/fournisseurs/${id}`);
  revalidatePath("/sama/fournisseurs");
  return { ok: true };
}

/** Ajoute une écriture au grand livre fournisseur (achat / paiement / retour). */
export async function addSupplierEntryAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "products.manage");
  const supplierId = String(formData.get("supplierId") || "");
  const type = String(formData.get("type") || "ACHAT") as "ACHAT" | "PAIEMENT" | "RETOUR";
  const amount = parseAmount(String(formData.get("amount") || "0"));
  const description = String(formData.get("description") || "");
  if (amount <= 0) return;

  const supplier = await prisma.samaSupplier.findFirst({ where: { id: supplierId, businessId: business.id } });
  if (!supplier) return;

  const delta = type === "ACHAT" ? amount : -amount; // achat = +dette ; paiement/retour = -dette
  const balanceAfter = Math.max(0, supplier.balanceDue + delta);

  await prisma.$transaction([
    prisma.samaSupplier.update({ where: { id: supplierId }, data: { balanceDue: balanceAfter } }),
    prisma.samaSupplierEntry.create({ data: { businessId: business.id, supplierId, type, amount, description: description || null, balanceAfter, createdBy: userId } }),
  ]);
  await logActivity(business.id, userId, "supplier.entry", { entity: "supplier", entityId: supplierId, meta: { type, amount } });
  revalidatePath(`/sama/fournisseurs/${supplierId}`);
  revalidatePath("/sama/fournisseurs");
}
