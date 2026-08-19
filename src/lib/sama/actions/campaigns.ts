"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { canUseAI, callAI } from "@/lib/sama/ai";

export interface CampaignState { error?: string; ok?: boolean; campaignId?: string }
export interface GenTextState { error?: string; text?: string }
export interface PromoState { error?: string; ok?: boolean }

export interface SegmentCustomer { id: string; name: string; phone: string | null }

/** Retourne les clients d'un segment (données réelles). */
export async function getSegmentCustomers(businessId: string, segment: string): Promise<SegmentCustomer[]> {
  const base = { businessId };
  if (segment === "new") {
    const since = new Date(Date.now() - 30 * 86400000);
    return prisma.samaCustomer.findMany({ where: { ...base, createdAt: { gte: since } }, select: { id: true, name: true, phone: true }, take: 500 });
  }
  if (segment === "inactive") {
    const cutoff = new Date(Date.now() - 60 * 86400000);
    return prisma.samaCustomer.findMany({ where: { ...base, sales: { none: { createdAt: { gte: cutoff } } } }, select: { id: true, name: true, phone: true }, take: 500 });
  }
  if (segment === "regular") {
    const rows = await prisma.samaCustomer.findMany({
      where: base, select: { id: true, name: true, phone: true, _count: { select: { sales: { where: { cancelled: false } } } } }, take: 1000,
    });
    return rows.filter((r) => r._count.sales >= 2).map((r) => ({ id: r.id, name: r.name, phone: r.phone }));
  }
  if (segment === "best") {
    const rows = await prisma.samaCustomer.findMany({
      where: base, select: { id: true, name: true, phone: true, sales: { where: { cancelled: false }, select: { total: true } } }, take: 1000,
    });
    return rows
      .map((r) => ({ id: r.id, name: r.name, phone: r.phone, total: r.sales.reduce((a, s) => a + s.total, 0) }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 30)
      .map(({ id, name, phone }) => ({ id, name, phone }));
  }
  if (segment === "debtors") {
    const rows = await prisma.samaCustomer.findMany({
      where: base, select: { id: true, name: true, phone: true, sales: { where: { cancelled: false }, select: { total: true, amountPaid: true } } }, take: 1000,
    });
    return rows
      .filter((r) => r.sales.reduce((a, s) => a + (s.total - s.amountPaid), 0) > 0)
      .map(({ id, name, phone }) => ({ id, name, phone }));
  }
  return prisma.samaCustomer.findMany({ where: base, select: { id: true, name: true, phone: true }, take: 1000 });
}

const campaignSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  channel: z.string().trim().default("WHATSAPP"),
  segment: z.string().trim().default("all"),
  message: z.string().trim().min(1, "Message requis"),
});

export async function createCampaignAction(_prev: CampaignState, formData: FormData): Promise<CampaignState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "marketing.manage"); } catch { return { error: "Permission refusée (marketing)." }; }

  const parsed = campaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  const recipients = await getSegmentCustomers(business.id, d.segment);
  const campaign = await prisma.samaCampaign.create({
    data: { businessId: business.id, name: d.name, channel: d.channel, segment: d.segment, message: d.message, recipientCount: recipients.length, createdBy: userId },
  });
  await logActivity(business.id, userId, "campaign.created", { entity: "campaign", entityId: campaign.id, meta: { recipients: recipients.length } });
  revalidatePath("/sama/marketing");
  return { ok: true, campaignId: campaign.id };
}

export async function generateCampaignTextAction(_prev: GenTextState, formData: FormData): Promise<GenTextState> {
  const { business, member } = await requireTenant();
  try { assertMemberCan(member, "marketing.manage"); } catch { return { error: "Permission refusée." }; }
  if (!canUseAI(business)) return { error: "La génération de texte est réservée au plan Pro IA (ou pendant l'essai)." };

  const objectif = String(formData.get("objectif") || "attirer des clients");
  const ton = String(formData.get("ton") || "vendeur");
  const system = "Tu es un expert marketing pour les commerces du Sénégal. Tu écris des messages courts, chaleureux et efficaces (WhatsApp), avec quelques emojis et éventuellement un mot en wolof. Réponds uniquement avec le message, sans guillemets ni explication.";
  const user = `Rédige un message de campagne pour l'entreprise « ${business.name} » (${business.activityType ?? "commerce"}). Objectif : ${objectif}. Ton : ${ton}. Maximum 3 phrases.`;
  const text = await callAI(system, user, 0.9);
  if (!text) return { error: "Génération indisponible. Réessayez." };
  return { text };
}

export async function markCampaignSentAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "marketing.manage");
  const id = String(formData.get("id") || "");
  await prisma.samaCampaign.updateMany({ where: { id, businessId: business.id }, data: { status: "ENVOYEE" } });
  await logActivity(business.id, userId, "campaign.sent", { entityId: id });
  revalidatePath("/sama/marketing");
  revalidatePath(`/sama/marketing/${id}`);
}

// ── Codes promo ────────────────────────────────────────────────────────────
const promoSchema = z.object({
  code: z.string().trim().min(2, "Code requis").transform((s) => s.toUpperCase()),
  type: z.enum(["POURCENTAGE", "MONTANT"]),
  value: z.string(),
  maxUsage: z.string().optional(),
});

export async function createPromoAction(_prev: PromoState, formData: FormData): Promise<PromoState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "marketing.manage"); } catch { return { error: "Permission refusée." }; }
  const parsed = promoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;
  const value = parseInt(d.value.replace(/\D/g, ""), 10) || 0;
  if (value <= 0) return { error: "Valeur invalide." };

  const exists = await prisma.samaPromoCode.findUnique({ where: { businessId_code: { businessId: business.id, code: d.code } } });
  if (exists) return { error: "Ce code existe déjà." };

  await prisma.samaPromoCode.create({
    data: { businessId: business.id, code: d.code, type: d.type, value, maxUsage: d.maxUsage ? parseInt(d.maxUsage, 10) || null : null },
  });
  await logActivity(business.id, userId, "promo.created", { meta: { code: d.code } });
  revalidatePath("/sama/marketing");
  return { ok: true };
}

export interface PromoCheck { ok?: boolean; error?: string; discount?: number; label?: string; code?: string }

/** Valide un code promo et calcule la remise sur un sous-total (aperçu vente). */
export async function validatePromoCodeAction(_prev: PromoCheck, formData: FormData): Promise<PromoCheck> {
  const { business } = await requireTenant();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const subtotal = parseInt(String(formData.get("subtotal") || "0"), 10) || 0;
  if (!code) return { error: "Entrez un code." };

  const promo = await prisma.samaPromoCode.findUnique({ where: { businessId_code: { businessId: business.id, code } } });
  if (!promo || !promo.active) return { error: "Code invalide ou inactif." };
  if (promo.expiresAt && promo.expiresAt < new Date()) return { error: "Code expiré." };
  if (promo.maxUsage != null && promo.usageCount >= promo.maxUsage) return { error: "Code épuisé." };

  const discount = promo.type === "POURCENTAGE" ? Math.round((subtotal * promo.value) / 100) : Math.min(promo.value, subtotal);
  const label = promo.type === "POURCENTAGE" ? `${promo.value}%` : `${promo.value} FCFA`;
  return { ok: true, discount, label, code };
}

export async function togglePromoAction(formData: FormData): Promise<void> {
  const { business, member } = await requireTenant();
  assertMemberCan(member, "marketing.manage");
  const id = String(formData.get("id") || "");
  const promo = await prisma.samaPromoCode.findFirst({ where: { id, businessId: business.id } });
  if (!promo) return;
  await prisma.samaPromoCode.update({ where: { id }, data: { active: !promo.active } });
  revalidatePath("/sama/marketing");
}
