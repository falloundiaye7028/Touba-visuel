"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/sama/auth";
import { ensurePlans } from "@/lib/sama/plans";
import { uniqueSlug } from "@/lib/sama/numbering";
import { getUserId, requireTenant, logActivity, setActiveBusiness } from "@/lib/sama/tenant";
import { redirect } from "next/navigation";

export interface ActionState {
  error?: string;
  ok?: boolean;
  identifiant?: string;
}

const registerSchema = z.object({
  prenom: z.string().trim().min(1, "Prénom requis"),
  nom: z.string().trim().min(1, "Nom requis"),
  entreprise: z.string().trim().min(2, "Nom de l'entreprise requis"),
  phone: z.string().trim().min(6, "Téléphone invalide"),
  email: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  activityType: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().default("SN"),
  currency: z.string().trim().default("XOF"),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum"),
});

/**
 * Inscription : crée l'utilisateur, sa première entreprise et l'appartenance
 * propriétaire, avec 14 jours d'essai Business. Ne connecte pas (le client
 * enchaîne avec signIn).
 */
export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const d = parsed.data;
  const email = (d.email && d.email.length > 0 ? d.email : `${d.phone.replace(/\D/g, "")}@sama.local`).toLowerCase();

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone: d.phone }] },
  });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email ou ce téléphone." };
  }

  await ensurePlans();
  const passwordHash = await hashPassword(d.password);
  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: `${d.prenom} ${d.nom}`.trim(),
          email,
          phone: d.phone,
          password: passwordHash,
        },
      });
      const slug = await uniqueSlug(tx, d.entreprise);
      const business = await tx.samaBusiness.create({
        data: {
          ownerId: user.id,
          name: d.entreprise,
          slug,
          activityType: d.activityType || null,
          city: d.city || null,
          country: d.country || "SN",
          currency: d.currency || "XOF",
          phone: d.phone,
          email: d.email || null,
          planCode: "BUSINESS",
          subscriptionStatus: "TRIAL",
          trialEndsAt,
        },
      });
      await tx.samaMember.create({
        data: { businessId: business.id, userId: user.id, role: "OWNER" },
      });
      await tx.samaNotification.create({
        data: {
          businessId: business.id,
          type: "SUBSCRIPTION",
          title: "Bienvenue sur SAMA BUSINESS 🎉",
          body: "Vous bénéficiez de 14 jours d'essai gratuit du plan Business.",
        },
      });
    });
  } catch {
    return { error: "Impossible de créer le compte. Réessayez." };
  }

  return { ok: true, identifiant: email };
}

const businessSchema = z.object({
  entreprise: z.string().trim().min(2, "Nom requis"),
  activityType: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().default("SN"),
  currency: z.string().trim().default("XOF"),
});

/** Création d'une entreprise supplémentaire pour un utilisateur connecté. */
export async function createBusinessAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await getUserId();
  if (!userId) redirect("/sama/connexion");

  const parsed = businessSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  await ensurePlans();
  let businessId = "";
  try {
    await prisma.$transaction(async (tx) => {
      const slug = await uniqueSlug(tx, d.entreprise);
      const business = await tx.samaBusiness.create({
        data: {
          ownerId: userId,
          name: d.entreprise,
          slug,
          activityType: d.activityType || null,
          city: d.city || null,
          country: d.country || "SN",
          currency: d.currency || "XOF",
          phone: d.phone || null,
          planCode: "BUSINESS",
          subscriptionStatus: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
      await tx.samaMember.create({ data: { businessId: business.id, userId, role: "OWNER" } });
      businessId = business.id;
    });
  } catch {
    return { error: "Impossible de créer l'entreprise. Réessayez." };
  }
  await setActiveBusiness(businessId);
  redirect("/sama/onboarding");
}

/** Marque une étape / la fin de l'onboarding. */
export async function completeOnboardingAction(): Promise<void> {
  const { business, userId } = await requireTenant();
  await prisma.samaBusiness.update({
    where: { id: business.id },
    data: { onboardingDone: true },
  });
  await logActivity(business.id, userId, "onboarding.completed");
  redirect("/sama/dashboard");
}
