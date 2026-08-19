"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUserId, setActiveBusiness } from "@/lib/sama/tenant";

/** Change l'entreprise active (multi-boutiques) après vérification d'accès. */
export async function switchBusinessAction(formData: FormData): Promise<void> {
  const userId = await getUserId();
  if (!userId) redirect("/sama/connexion");
  const businessId = String(formData.get("businessId") || "");

  const membership = await prisma.samaMember.findUnique({
    where: { businessId_userId: { businessId, userId } },
  });
  if (!membership || !membership.active) redirect("/sama/dashboard");

  await setActiveBusiness(businessId);
  redirect("/sama/dashboard");
}
