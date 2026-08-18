"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { nextNumber } from "@/lib/sama/numbering";
import { parseAmount } from "@/lib/sama/money";

export interface QuoteState { error?: string; ok?: boolean; quoteId?: string }

const itemSchema = z.object({
  productId: z.string().optional().nullable(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
});

interface QuoteData {
  items: { productId: string | null; name: string; quantity: number; unitPrice: number; total: number }[];
  discount: number;
  deliveryFee: number;
  note?: string;
  convertedSaleId?: string;
}

export async function createQuoteAction(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const { business, role, userId } = await requireTenant();
  try { assertPermission(role, "invoices.manage"); } catch { return { error: "Permission refusée." }; }

  let raw: unknown;
  try { raw = JSON.parse(String(formData.get("items") || "[]")); } catch { return { error: "Panier invalide." }; }
  const parsed = z.array(itemSchema).min(1).safeParse(raw);
  if (!parsed.success) return { error: "Ajoutez au moins une ligne au devis." };

  const customerId = (formData.get("customerId") as string) || null;
  const discount = parseAmount(String(formData.get("discount") || "0"));
  const deliveryFee = parseAmount(String(formData.get("deliveryFee") || "0"));
  const note = (formData.get("note") as string) || undefined;
  const dueRaw = String(formData.get("dueDate") || "");
  const dueDate = dueRaw ? new Date(dueRaw) : null;

  const lines = parsed.data.map((i) => ({ productId: i.productId ?? null, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, total: i.unitPrice * i.quantity }));
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const data: QuoteData = { items: lines, discount, deliveryFee, note };

  let quoteId = "";
  try {
    quoteId = await prisma.$transaction(async (tx) => {
      const number = await nextNumber(tx, business.id, "DEV");
      const inv = await tx.samaInvoice.create({
        data: { businessId: business.id, number, type: "DEVIS", customerId, total, amountPaid: 0, status: "EMISE", dueDate, data: JSON.stringify(data) },
      });
      return inv.id;
    });
  } catch { return { error: "Impossible de créer le devis." }; }

  await logActivity(business.id, userId, "quote.created", { entity: "invoice", entityId: quoteId });
  revalidatePath("/sama/devis");
  return { ok: true, quoteId };
}

/** Convertit un devis en vente réelle (décrémente le stock, crée le reçu). */
export async function convertQuoteToSaleAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "sales.create");
  const quoteId = String(formData.get("id") || "");

  const quote = await prisma.samaInvoice.findFirst({ where: { id: quoteId, businessId: business.id, type: "DEVIS" } });
  if (!quote || quote.status === "CONVERTIE") return;
  const data = JSON.parse(quote.data) as QuoteData;

  const ids = data.items.map((i) => i.productId).filter(Boolean) as string[];
  const products = await prisma.samaProduct.findMany({ where: { id: { in: ids }, businessId: business.id } });
  const pmap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0, cost = 0;
  const lineData = data.items.map((it) => {
    const p = it.productId ? pmap.get(it.productId) : undefined;
    const costPrice = p?.costPrice ?? 0;
    subtotal += it.unitPrice * it.quantity;
    cost += costPrice * it.quantity;
    return { productId: p?.id ?? null, name: it.name, quantity: it.quantity, unitPrice: it.unitPrice, costPrice, total: it.unitPrice * it.quantity };
  });
  const total = Math.max(0, subtotal - data.discount + data.deliveryFee);
  const margin = subtotal - data.discount - cost;

  let saleId = "";
  await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, business.id, "VTE");
    const seller = await tx.samaMember.findUnique({ where: { businessId_userId: { businessId: business.id, userId } } });
    const sale = await tx.samaSale.create({
      data: {
        businessId: business.id, number, customerId: quote.customerId, sellerId: seller?.id ?? null,
        channel: "BOUTIQUE", subtotal, discount: data.discount, deliveryFee: data.deliveryFee, total, cost, margin,
        amountPaid: 0, payStatus: "CREDIT", comment: `Depuis devis ${quote.number}`,
        items: { create: lineData },
      },
    });
    saleId = sale.id;
    for (const ln of lineData) {
      if (ln.productId) {
        const p = pmap.get(ln.productId)!;
        const newStock = p.stock - ln.quantity;
        await tx.samaProduct.update({ where: { id: p.id }, data: { stock: newStock } });
        await tx.samaInventoryMovement.create({ data: { businessId: business.id, productId: p.id, type: "VENTE", quantity: -ln.quantity, stockAfter: newStock, reason: number, createdBy: userId } });
      }
    }
    const rec = await nextNumber(tx, business.id, "REC");
    await tx.samaInvoice.create({ data: { businessId: business.id, number: rec, type: "RECU", saleId: sale.id, customerId: quote.customerId, total, amountPaid: 0, status: "PARTIELLE", data: JSON.stringify({ items: lineData }) } });
    await tx.samaInvoice.update({ where: { id: quote.id }, data: { status: "CONVERTIE", data: JSON.stringify({ ...data, convertedSaleId: sale.id }) } });
  });

  await logActivity(business.id, userId, "quote.converted", { entity: "sale", entityId: saleId, meta: { quote: quote.number } });
  revalidatePath("/sama/devis");
  revalidatePath("/sama/ventes");
  redirect(`/sama/ventes/${saleId}`);
}

export async function deleteQuoteAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "invoices.manage");
  const id = String(formData.get("id") || "");
  await prisma.samaInvoice.deleteMany({ where: { id, businessId: business.id, type: "DEVIS", status: { not: "CONVERTIE" } } });
  await logActivity(business.id, userId, "quote.deleted", { entityId: id });
  revalidatePath("/sama/devis");
}
