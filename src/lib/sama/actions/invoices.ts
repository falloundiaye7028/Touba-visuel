"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { nextNumber } from "@/lib/sama/numbering";

/**
 * Génère une facture professionnelle à partir d'une vente : le reçu existant
 * est promu en facture avec un numéro FAC dédié (un document par vente).
 */
export async function generateInvoiceAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "invoices.manage");
  const saleId = String(formData.get("saleId") || "");

  const sale = await prisma.samaSale.findFirst({
    where: { id: saleId, businessId: business.id },
    include: { invoice: true },
  });
  if (!sale || !sale.invoice) return;
  if (sale.invoice.type === "FACTURE") return;

  await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, business.id, "FAC");
    await tx.samaInvoice.update({
      where: { id: sale.invoice!.id },
      data: { type: "FACTURE", number },
    });
  });

  await logActivity(business.id, userId, "invoice.generated", { entity: "sale", entityId: saleId });
  revalidatePath("/sama/factures");
  revalidatePath(`/sama/ventes/${saleId}`);
}
