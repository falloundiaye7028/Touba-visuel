"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/sama/tenant";

/** Liste blanche d'emails super-admin (en plus du rôle ADMIN en base). */
function adminEmails(): string[] {
  return (process.env.SAMA_SUPERADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireSuperAdmin(): Promise<{ userId: string; email: string }> {
  const userId = await getUserId();
  if (!userId) redirect("/sama/connexion");
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true } });
  if (!user) redirect("/sama/connexion");
  const isAdmin = user.role === "ADMIN" || adminEmails().includes(user.email.toLowerCase());
  if (!isAdmin) redirect("/sama/dashboard");
  return { userId, email: user.email };
}

export async function isSuperAdmin(): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true } });
  if (!user) return false;
  return user.role === "ADMIN" || adminEmails().includes(user.email.toLowerCase());
}

/** Active / prolonge / suspend / change le plan d'une entreprise. */
export async function setBusinessSubscriptionAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const businessId = String(formData.get("businessId") || "");
  const action = String(formData.get("action") || "");
  const business = await prisma.samaBusiness.findUnique({ where: { id: businessId } });
  if (!business) return;

  if (action === "activate") {
    const plan = String(formData.get("plan") || business.planCode);
    const months = parseInt(String(formData.get("months") || "1"), 10) || 1;
    await prisma.samaBusiness.update({
      where: { id: businessId },
      data: { planCode: plan, subscriptionStatus: "ACTIVE", subEndsAt: new Date(Date.now() + months * 30 * 86400000), trialEndsAt: null },
    });
    await prisma.samaNotification.create({
      data: { businessId, type: "SUBSCRIPTION", title: "Abonnement activé ✓", body: `Votre plan ${plan} est actif pour ${months} mois.` },
    });
  } else if (action === "suspend") {
    await prisma.samaBusiness.update({ where: { id: businessId }, data: { subscriptionStatus: "SUSPENDED" } });
  } else if (action === "extend") {
    const base = business.subEndsAt && business.subEndsAt > new Date() ? business.subEndsAt : new Date();
    await prisma.samaBusiness.update({ where: { id: businessId }, data: { subEndsAt: new Date(base.getTime() + 30 * 86400000), subscriptionStatus: "ACTIVE" } });
  }
  revalidatePath("/sama/super-admin");
}

/** Modifie les tarifs d'un plan (tarifs configurables depuis l'administration). */
export async function updatePlanPriceAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const code = String(formData.get("code") || "");
  const price = parseInt(String(formData.get("price") || "0"), 10) || 0;
  await prisma.samaPlan.update({ where: { code }, data: { priceMonthly: price } });
  revalidatePath("/sama/super-admin");
}
