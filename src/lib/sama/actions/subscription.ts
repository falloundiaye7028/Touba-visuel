"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { planByCode } from "@/lib/sama/constants";

/**
 * V1 : le passage au plan Gratuit est immédiat (self-service). Les plans
 * payants génèrent une demande d'activation traitée par le super administrateur
 * (aucune transaction bancaire simulée — architecture prête pour Wave/OM).
 */
export async function requestPlanAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "subscription.manage");
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

export async function markNotificationsReadAction(): Promise<void> {
  const { business } = await requireTenant();
  await prisma.samaNotification.updateMany({ where: { businessId: business.id, read: false }, data: { read: true } });
  revalidatePath("/sama/notifications");
}
