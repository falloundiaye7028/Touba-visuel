"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { planByCode } from "@/lib/sama/constants";

/**
 * V1 : le passage au plan Gratuit est immédiat (self-service). Les plans
 * payants génèrent une demande d'activation traitée par le super administrateur
 * (aucune transaction bancaire simulée — architecture prête pour Wave/OM).
 */
export async function requestPlanAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "subscription.manage");
  const code = String(formData.get("plan") || "GRATUIT");
  const plan = planByCode(code);

  if (plan.code === "GRATUIT") {
    await prisma.samaBusiness.update({
      where: { id: business.id },
      data: { planCode: "GRATUIT", subscriptionStatus: "ACTIVE", trialEndsAt: null },
    });
    await logActivity(business.id, userId, "subscription.downgraded", { meta: { plan: "GRATUIT" } });
  } else {
    await prisma.samaNotification.create({
      data: {
        businessId: business.id,
        type: "SUBSCRIPTION",
        title: "Demande d'abonnement enregistrée",
        body: `Vous avez demandé le plan ${plan.name} (${plan.priceMonthly} FCFA/mois). Notre équipe vous contactera pour l'activation.`,
      },
    });
    await logActivity(business.id, userId, "subscription.requested", { meta: { plan: plan.code } });
  }
  revalidatePath("/sama/abonnement");
  revalidatePath("/sama/dashboard");
}

/**
 * Enregistre un paiement d'abonnement (Wave/OM/virement) avec sa référence.
 * Crée une demande EN_ATTENTE que le super administrateur confirme.
 */
export async function initiateSubscriptionPaymentAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "subscription.manage");

  const code = String(formData.get("plan") || "");
  const plan = planByCode(code);
  if (plan.priceMonthly <= 0) redirect("/sama/abonnement");

  const months = Math.max(1, parseInt(String(formData.get("months") || "1"), 10) || 1);
  const method = String(formData.get("method") || "WAVE");
  const reference = String(formData.get("reference") || "").trim();
  const amount = plan.priceMonthly * months;

  const payment = await prisma.samaSubscriptionPayment.create({
    data: { businessId: business.id, planCode: plan.code, amount, months, method, reference: reference || null, status: "EN_ATTENTE" },
  });
  await prisma.samaNotification.create({
    data: {
      businessId: business.id, type: "SUBSCRIPTION",
      title: "Paiement d'abonnement enregistré",
      body: `Plan ${plan.name} · ${amount} FCFA (${months} mois). En attente de confirmation.`,
    },
  });
  await logActivity(business.id, userId, "subscription.payment.initiated", { entityId: payment.id, meta: { plan: plan.code, amount, method } });
  revalidatePath("/sama/abonnement");
  redirect("/sama/abonnement?paiement=enregistre");
}

export async function markNotificationsReadAction(): Promise<void> {
  const { business } = await requireTenant();
  await prisma.samaNotification.updateMany({ where: { businessId: business.id, read: false }, data: { read: true } });
  revalidatePath("/sama/notifications");
}
