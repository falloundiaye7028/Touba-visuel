"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { checkLimit } from "@/lib/sama/limits";
import { nextNumber } from "@/lib/sama/numbering";
import { parseAmount } from "@/lib/sama/money";

export interface SaleState {
  error?: string;
  ok?: boolean;
  saleId?: string;
}

const itemSchema = z.object({
  productId: z.string().optional().nullable(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
});

/**
 * Enregistre une vente : décrémente le stock, calcule la marge, crée le
 * paiement et un reçu, met à jour le profil client. Tout est transactionnel
 * pour éviter les doubles mouvements.
 */
export async function createSaleAction(_prev: SaleState, formData: FormData): Promise<SaleState> {
  const { business, member, userId } = await requireTenant();
  try {
    assertMemberCan(member, "sales.create");
  } catch {
    return { error: "Permission refusée." };
  }

  const limitError = await checkLimit(business, "salesMonth");
  if (limitError) return { error: limitError };

  let rawItems: unknown;
  try {
    rawItems = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    return { error: "Panier invalide." };
  }
  const itemsParsed = z.array(itemSchema).min(1, "Ajoutez au moins un produit").safeParse(rawItems);
  if (!itemsParsed.success) return { error: "Ajoutez au moins un produit à la vente." };
  const items = itemsParsed.data;

  const customerId = (formData.get("customerId") as string) || null;
  const channel = (String(formData.get("channel") || "BOUTIQUE")) as
    | "BOUTIQUE" | "WHATSAPP" | "FACEBOOK" | "INSTAGRAM" | "TIKTOK" | "SITE_WEB" | "TELEPHONE" | "AUTRE";
  let discount = parseAmount(String(formData.get("discount") || "0"));
  const deliveryFee = parseAmount(String(formData.get("deliveryFee") || "0"));
  const promoCode = String(formData.get("promoCode") || "").trim().toUpperCase();
  const method = (String(formData.get("method") || "ESPECES")) as
    | "ESPECES" | "WAVE" | "ORANGE_MONEY" | "FREE_MONEY" | "VIREMENT" | "CHEQUE" | "CREDIT" | "AUTRE";
  const comment = (formData.get("comment") as string) || null;

  // Charger les produits concernés pour les coûts et le contrôle de stock.
  const productIds = items.map((i) => i.productId).filter(Boolean) as string[];
  const products = await prisma.samaProduct.findMany({
    where: { id: { in: productIds }, businessId: business.id },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Contrôle de stock (logique stock : pas de vente en dessous de zéro).
  for (const it of items) {
    if (it.productId) {
      const p = productMap.get(it.productId);
      if (p && p.stock < it.quantity) {
        return { error: `Stock insuffisant pour « ${p.name} » (disponible : ${p.stock}).` };
      }
    }
  }

  let subtotal = 0;
  let cost = 0;
  const lineData = items.map((it) => {
    const p = it.productId ? productMap.get(it.productId) : undefined;
    const unitPrice = it.unitPrice;
    const costPrice = p?.costPrice ?? 0;
    const total = unitPrice * it.quantity;
    subtotal += total;
    cost += costPrice * it.quantity;
    return {
      productId: p?.id ?? null,
      name: it.name,
      quantity: it.quantity,
      unitPrice,
      costPrice,
      total,
    };
  });

  // Application d'un code promo (remise ajoutée à la remise manuelle).
  let promoId: string | null = null;
  if (promoCode) {
    const promo = await prisma.samaPromoCode.findUnique({ where: { businessId_code: { businessId: business.id, code: promoCode } } });
    const valid = promo && promo.active && (!promo.expiresAt || promo.expiresAt >= new Date()) && (promo.maxUsage == null || promo.usageCount < promo.maxUsage);
    if (valid) {
      const promoDiscount = promo.type === "POURCENTAGE" ? Math.round((subtotal * promo.value) / 100) : Math.min(promo.value, subtotal);
      discount = Math.min(subtotal, discount + promoDiscount);
      promoId = promo.id;
    }
  }

  const total = Math.max(0, subtotal - discount + deliveryFee);
  const margin = subtotal - discount - cost;

  let amountPaid = parseAmount(String(formData.get("amountPaid") || ""));
  // Par défaut, un paiement non-crédit est intégral.
  if (!formData.get("amountPaid") && method !== "CREDIT") amountPaid = total;
  amountPaid = Math.min(Math.max(0, amountPaid), total);
  const payStatus = amountPaid >= total ? "PAYE" : amountPaid > 0 ? "PARTIEL" : "CREDIT";

  let saleId = "";
  try {
    saleId = await prisma.$transaction(async (tx) => {
      const number = await nextNumber(tx, business.id, "VTE");
      const seller = await tx.samaMember.findUnique({
        where: { businessId_userId: { businessId: business.id, userId } },
      });

      if (promoId) {
        await tx.samaPromoCode.update({ where: { id: promoId }, data: { usageCount: { increment: 1 } } });
      }

      const sale = await tx.samaSale.create({
        data: {
          businessId: business.id,
          number,
          customerId,
          sellerId: seller?.id ?? null,
          channel,
          subtotal,
          discount,
          deliveryFee,
          total,
          cost,
          margin,
          amountPaid,
          payStatus,
          comment,
          items: { create: lineData },
        },
      });

      // Décrément de stock + mouvements
      for (const ln of lineData) {
        if (ln.productId) {
          const p = productMap.get(ln.productId)!;
          const newStock = p.stock - ln.quantity;
          await tx.samaProduct.update({ where: { id: p.id }, data: { stock: newStock } });
          await tx.samaInventoryMovement.create({
            data: {
              businessId: business.id,
              productId: p.id,
              type: "VENTE",
              quantity: -ln.quantity,
              stockAfter: newStock,
              reason: `Vente ${number}`,
              createdBy: userId,
            },
          });
        }
      }

      if (amountPaid > 0) {
        await tx.samaPayment.create({
          data: { businessId: business.id, saleId: sale.id, amount: amountPaid, method },
        });
      }

      // Reçu automatique
      const recuNumber = await nextNumber(tx, business.id, "REC");
      await tx.samaInvoice.create({
        data: {
          businessId: business.id,
          number: recuNumber,
          type: "RECU",
          saleId: sale.id,
          customerId,
          total,
          amountPaid,
          status: payStatus === "PAYE" ? "PAYEE" : "PARTIELLE",
          data: JSON.stringify({ items: lineData, discount, deliveryFee, channel }),
        },
      });

      return sale.id;
    });
  } catch {
    return { error: "Impossible d'enregistrer la vente. Réessayez." };
  }

  // Alertes de stock faible (hors transaction)
  for (const ln of lineData) {
    if (ln.productId) {
      const p = productMap.get(ln.productId)!;
      const newStock = p.stock - ln.quantity;
      if (newStock <= p.alertThreshold) {
        await prisma.samaNotification.create({
          data: {
            businessId: business.id,
            type: "STOCK",
            title: "Stock faible",
            body: `Il ne reste que ${newStock} ${p.unit} de « ${p.name} ».`,
          },
        });
      }
    }
  }

  await logActivity(business.id, userId, "sale.created", { entity: "sale", entityId: saleId, meta: { total, margin } });
  revalidatePath("/sama/ventes");
  revalidatePath("/sama/dashboard");
  revalidatePath("/sama/produits");
  return { ok: true, saleId };
}

/** Annulation d'une vente : restaure le stock (règles métier respectées). */
export async function cancelSaleAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "sales.cancel");
  const id = String(formData.get("id") || "");

  const sale = await prisma.samaSale.findFirst({
    where: { id, businessId: business.id },
    include: { items: true },
  });
  if (!sale || sale.cancelled) return;

  await prisma.$transaction(async (tx) => {
    for (const it of sale.items) {
      if (it.productId) {
        const p = await tx.samaProduct.findUnique({ where: { id: it.productId } });
        if (p) {
          const newStock = p.stock + it.quantity;
          await tx.samaProduct.update({ where: { id: p.id }, data: { stock: newStock } });
          await tx.samaInventoryMovement.create({
            data: {
              businessId: business.id,
              productId: p.id,
              type: "ANNULATION_VENTE",
              quantity: it.quantity,
              stockAfter: newStock,
              reason: `Annulation ${sale.number}`,
              createdBy: userId,
            },
          });
        }
      }
    }
    await tx.samaSale.update({ where: { id }, data: { cancelled: true, payStatus: "CREDIT" } });
    await tx.samaInvoice.updateMany({ where: { saleId: id }, data: { status: "ANNULEE" } });
  });

  await logActivity(business.id, userId, "sale.cancelled", { entity: "sale", entityId: id });
  revalidatePath("/sama/ventes");
  revalidatePath("/sama/dashboard");
}

/** Ajoute un paiement à une vente en crédit / partielle. */
export async function addPaymentAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "payments.manage");
  const saleId = String(formData.get("saleId") || "");
  const amount = parseAmount(String(formData.get("amount") || "0"));
  const method = (String(formData.get("method") || "ESPECES")) as
    | "ESPECES" | "WAVE" | "ORANGE_MONEY" | "FREE_MONEY" | "VIREMENT" | "CHEQUE" | "CREDIT" | "AUTRE";
  if (amount <= 0) return;

  const sale = await prisma.samaSale.findFirst({ where: { id: saleId, businessId: business.id } });
  if (!sale) return;

  const newPaid = Math.min(sale.total, sale.amountPaid + amount);
  const payStatus = newPaid >= sale.total ? "PAYE" : newPaid > 0 ? "PARTIEL" : "CREDIT";

  await prisma.$transaction([
    prisma.samaPayment.create({ data: { businessId: business.id, saleId, amount, method } }),
    prisma.samaSale.update({ where: { id: saleId }, data: { amountPaid: newPaid, payStatus } }),
    prisma.samaInvoice.updateMany({
      where: { saleId },
      data: { amountPaid: newPaid, status: payStatus === "PAYE" ? "PAYEE" : "PARTIELLE" },
    }),
  ]);

  await logActivity(business.id, userId, "payment.added", { entity: "sale", entityId: saleId, meta: { amount } });
  revalidatePath(`/sama/ventes/${saleId}`);
  revalidatePath("/sama/ventes");
  revalidatePath("/sama/dashboard");
}
