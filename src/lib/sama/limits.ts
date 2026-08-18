import type { SamaBusiness } from "@prisma/client";
import { prisma } from "@/lib/db";
import { planByCode } from "./constants";

/**
 * Statut effectif : pendant l'essai on applique le plan choisi ; une fois
 * l'essai expiré sans abonnement actif, on retombe sur les limites du plan
 * Gratuit.
 */
export function isActive(business: SamaBusiness): boolean {
  if (business.subscriptionStatus === "ACTIVE") return true;
  if (business.subscriptionStatus === "TRIAL") {
    return !business.trialEndsAt || business.trialEndsAt.getTime() > Date.now();
  }
  return false;
}

export function effectivePlanCode(business: SamaBusiness): string {
  return isActive(business) ? business.planCode : "GRATUIT";
}

export function planLimits(business: SamaBusiness) {
  return planByCode(effectivePlanCode(business));
}

/** Vérifie la limite d'utilisateurs (employés) du plan. */
export async function checkMemberLimit(business: SamaBusiness): Promise<string | null> {
  const plan = planLimits(business);
  if (plan.maxUsers == null) return null;
  const count = await prisma.samaMember.count({ where: { businessId: business.id } });
  if (count >= plan.maxUsers)
    return `Limite du plan ${plan.name} atteinte (${plan.maxUsers} utilisateur${plan.maxUsers > 1 ? "s" : ""}). Passez à un plan supérieur.`;
  return null;
}

type Countable = "products" | "customers" | "salesMonth";

/**
 * Vérifie qu'une nouvelle création respecte les limites du plan.
 * Retourne un message d'erreur ou null si autorisé.
 */
export async function checkLimit(business: SamaBusiness, kind: Countable): Promise<string | null> {
  const plan = planLimits(business);
  if (kind === "products") {
    if (plan.maxProducts == null) return null;
    const count = await prisma.samaProduct.count({ where: { businessId: business.id, archived: false } });
    if (count >= plan.maxProducts)
      return `Limite du plan ${plan.name} atteinte (${plan.maxProducts} produits). Passez à un plan supérieur.`;
  }
  if (kind === "customers") {
    if (plan.maxCustomers == null) return null;
    const count = await prisma.samaCustomer.count({ where: { businessId: business.id } });
    if (count >= plan.maxCustomers)
      return `Limite du plan ${plan.name} atteinte (${plan.maxCustomers} clients). Passez à un plan supérieur.`;
  }
  if (kind === "salesMonth") {
    if (plan.maxSalesMonth == null) return null;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const count = await prisma.samaSale.count({ where: { businessId: business.id, createdAt: { gte: start } } });
    if (count >= plan.maxSalesMonth)
      return `Limite du plan ${plan.name} atteinte (${plan.maxSalesMonth} ventes/mois). Passez à un plan supérieur.`;
  }
  return null;
}
