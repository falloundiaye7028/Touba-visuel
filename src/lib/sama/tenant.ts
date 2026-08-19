/**
 * Helpers de multi-tenancy SAMA BUSINESS.
 * Point de contrôle central : toute donnée métier est reliée à un businessId,
 * et l'accès est vérifié côté serveur via l'appartenance (SamaMember).
 * Une entreprise ne peut JAMAIS voir les données d'une autre.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { SamaBusiness, SamaMember, SamaRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { authOptions } from "./auth";
import { hasPermission, resolveMemberPermission, type Permission } from "./constants";

/**
 * Permission effective d'un membre : ses permissions personnalisées si
 * définies, sinon celles de son rôle. Le propriétaire a tout.
 */
export function memberCan(member: SamaMember, perm: Permission): boolean {
  return resolveMemberPermission(member.role, member.customPermissions, perm);
}

export function assertMemberCan(member: SamaMember, perm: Permission): void {
  if (!memberCan(member, perm)) throw new Error("PERMISSION_DENIED");
}

const ACTIVE_BUSINESS_COOKIE = "sama_bid";

export interface TenantContext {
  userId: string;
  business: SamaBusiness;
  member: SamaMember;
  role: SamaRole;
}

/** Retourne l'id de l'utilisateur connecté, ou null. */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

/** Résout le contexte tenant courant (utilisateur + entreprise active). */
export async function getTenant(): Promise<TenantContext | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const memberships = await prisma.samaMember.findMany({
    where: { userId, active: true },
    include: { business: true },
    orderBy: { createdAt: "asc" },
  });
  if (memberships.length === 0) return null;

  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_BUSINESS_COOKIE)?.value;
  const chosen =
    memberships.find((m) => m.businessId === preferredId) ?? memberships[0];

  return {
    userId,
    business: chosen.business,
    member: chosen,
    role: chosen.role,
  };
}

/** Exige un utilisateur connecté avec une entreprise ; redirige sinon. */
export async function requireTenant(): Promise<TenantContext> {
  const userId = await getUserId();
  if (!userId) redirect("/sama/connexion");
  const tenant = await getTenant();
  if (!tenant) redirect("/sama/nouvelle-entreprise");
  return tenant;
}

/** Comme requireTenant mais force le passage par l'onboarding si non terminé. */
export async function requireOnboardedTenant(): Promise<TenantContext> {
  const tenant = await requireTenant();
  if (!tenant.business.onboardingDone) redirect("/sama/onboarding");
  return tenant;
}

/** Vérifie une permission ; lève une erreur si refusée (à capturer côté action). */
export function assertPermission(role: SamaRole, perm: Permission): void {
  if (!hasPermission(role, perm)) {
    throw new Error("PERMISSION_DENIED");
  }
}

/** Enregistre une action dans le journal d'activité. */
export async function logActivity(
  businessId: string,
  userId: string | null,
  action: string,
  opts?: { entity?: string; entityId?: string; meta?: Record<string, unknown> }
): Promise<void> {
  try {
    await prisma.samaActivityLog.create({
      data: {
        businessId,
        userId,
        action,
        entity: opts?.entity,
        entityId: opts?.entityId,
        meta: opts?.meta ? JSON.stringify(opts.meta) : undefined,
      },
    });
  } catch {
    // Le journal ne doit jamais bloquer une opération métier.
  }
}

/** Change l'entreprise active (multi-boutiques). */
export async function setActiveBusiness(businessId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_BUSINESS_COOKIE, businessId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
