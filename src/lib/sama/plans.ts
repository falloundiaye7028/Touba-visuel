import { prisma } from "@/lib/db";
import { PLANS } from "./constants";

/**
 * Garantit la présence des plans d'abonnement en base (idempotent).
 * Appelé avant toute création d'entreprise pour préserver l'intégrité de la
 * clé étrangère planCode.
 */
export async function ensurePlans(): Promise<void> {
  for (const p of PLANS) {
    await prisma.samaPlan.upsert({
      where: { code: p.code },
      create: {
        code: p.code,
        name: p.name,
        priceMonthly: p.priceMonthly,
        maxProducts: p.maxProducts,
        maxCustomers: p.maxCustomers,
        maxSalesMonth: p.maxSalesMonth,
        maxUsers: p.maxUsers,
        features: JSON.stringify(p.features),
        ordre: PLANS.indexOf(p),
      },
      update: {}, // les tarifs sont modifiables via l'administration
    });
  }
}
