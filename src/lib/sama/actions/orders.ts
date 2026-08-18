"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { nextNumber } from "@/lib/sama/numbering";
import { parseAmount } from "@/lib/sama/money";
import type { SamaOrderStatus } from "@prisma/client";

export interface OrderState { error?: string; ok?: boolean; orderId?: string }

const itemSchema = z.object({
  productId: z.string().optional().nullable(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
});

/** Création manuelle d'une commande (depuis l'app). */
export async function createOrderAction(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "orders.manage"); } catch { return { error: "Permission refusée." }; }

  let raw: unknown;
  try { raw = JSON.parse(String(formData.get("items") || "[]")); } catch { return { error: "Panier invalide." }; }
  const parsed = z.array(itemSchema).min(1).safeParse(raw);
  if (!parsed.success) return { error: "Ajoutez au moins un produit." };
  const items = parsed.data;

  const customerId = (formData.get("customerId") as string) || null;
  const channel = String(formData.get("channel") || "WHATSAPP") as never;
  const deliveryFee = parseAmount(String(formData.get("deliveryFee") || "0"));
  const discount = parseAmount(String(formData.get("discount") || "0"));
  const comment = (formData.get("comment") as string) || null;

  const subtotal = items.reduce((a, i) => a + i.unitPrice * i.quantity, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  let orderId = "";
  try {
    orderId = await prisma.$transaction(async (tx) => {
      const number = await nextNumber(tx, business.id, "CMD");
      const order = await tx.samaOrder.create({
        data: {
          businessId: business.id, number, customerId, channel, subtotal, discount, deliveryFee, total, comment,
          items: { create: items.map((i) => ({ productId: i.productId ?? null, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, total: i.unitPrice * i.quantity })) },
        },
      });
      return order.id;
    });
  } catch { return { error: "Impossible de créer la commande." }; }

  await logActivity(business.id, userId, "order.created", { entity: "order", entityId: orderId });
  revalidatePath("/sama/commandes");
  revalidatePath("/sama/dashboard");
  return { ok: true, orderId };
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "orders.manage");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "NOUVELLE") as SamaOrderStatus;
  await prisma.samaOrder.updateMany({ where: { id, businessId: business.id }, data: { status } });
  await logActivity(business.id, userId, "order.status", { entity: "order", entityId: id, meta: { status } });
  revalidatePath("/sama/commandes");
  revalidatePath(`/sama/commandes/${id}`);
  revalidatePath("/sama/dashboard");
}

/**
 * Commande passée depuis la boutique publique (non authentifiée).
 * Reliée à l'entreprise par son slug. N'expose aucune donnée privée.
 */
const storeOrderSchema = z.object({
  slug: z.string().min(1),
  name: z.string().trim().min(1, "Nom requis"),
  phone: z.string().trim().min(6, "Téléphone requis"),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  comment: z.string().trim().optional(),
  items: z.string(),
});

export async function createStoreOrderAction(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const parsed = storeOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  const business = await prisma.samaBusiness.findUnique({ where: { slug: d.slug } });
  if (!business || !business.storePublished) return { error: "Boutique introuvable." };

  let raw: unknown;
  try { raw = JSON.parse(d.items); } catch { return { error: "Panier invalide." }; }
  const itemsParsed = z.array(itemSchema).min(1).safeParse(raw);
  if (!itemsParsed.success) return { error: "Votre panier est vide." };

  // Revalider les prix côté serveur à partir du catalogue (sécurité).
  const ids = itemsParsed.data.map((i) => i.productId).filter(Boolean) as string[];
  const products = await prisma.samaProduct.findMany({ where: { id: { in: ids }, businessId: business.id } });
  const pmap = new Map(products.map((p) => [p.id, p]));
  const lines = itemsParsed.data.map((i) => {
    const p = i.productId ? pmap.get(i.productId) : undefined;
    const unitPrice = p ? p.salePrice : i.unitPrice;
    return { productId: p?.id ?? null, name: p?.name ?? i.name, quantity: i.quantity, unitPrice, total: unitPrice * i.quantity };
  });
  const subtotal = lines.reduce((a, l) => a + l.total, 0);

  let orderId = "";
  await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, business.id, "CMD");
    const order = await tx.samaOrder.create({
      data: {
        businessId: business.id, number, channel: "SITE_WEB", status: "NOUVELLE",
        subtotal, total: subtotal,
        guestName: d.name, guestPhone: d.phone, guestAddress: d.address || null, guestCity: d.city || null,
        comment: d.comment || null,
        items: { create: lines },
      },
    });
    orderId = order.id;
    await tx.samaNotification.create({
      data: { businessId: business.id, type: "ORDER", title: "Nouvelle commande boutique", body: `${d.name} · ${number}` },
    });
  });

  return { ok: true, orderId };
}
