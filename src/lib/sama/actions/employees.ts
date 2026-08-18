"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { hashPassword } from "@/lib/sama/auth";
import { checkMemberLimit } from "@/lib/sama/limits";
import type { SamaRole } from "@prisma/client";

export interface InviteState { error?: string; ok?: boolean; tempPassword?: string; identifiant?: string; existing?: boolean }

const inviteSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  phone: z.string().trim().min(6, "Téléphone requis"),
  role: z.enum(["MANAGER", "SELLER", "CASHIER", "STOCK", "COMMERCIAL"]),
});

function randomPassword(): string {
  return Math.random().toString(36).slice(2, 6) + Math.floor(1000 + Math.random() * 9000);
}

/** Invite un employé : crée (ou rattache) un compte + une appartenance. */
export async function inviteEmployeeAction(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const { business, role, userId } = await requireTenant();
  try { assertPermission(role, "employees.manage"); } catch { return { error: "Seul le propriétaire peut inviter des employés." }; }

  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  const limitError = await checkMemberLimit(business);
  if (limitError) return { error: limitError };

  const existingUser = await prisma.user.findFirst({ where: { phone: d.phone } });

  if (existingUser) {
    const already = await prisma.samaMember.findUnique({ where: { businessId_userId: { businessId: business.id, userId: existingUser.id } } });
    if (already) return { error: "Cette personne fait déjà partie de l'équipe." };
    await prisma.samaMember.create({ data: { businessId: business.id, userId: existingUser.id, role: d.role as SamaRole } });
    await logActivity(business.id, userId, "employee.added", { entityId: existingUser.id, meta: { role: d.role } });
    revalidatePath("/sama/employes");
    return { ok: true, existing: true, identifiant: existingUser.phone ?? existingUser.email };
  }

  const temp = randomPassword();
  const email = `${d.phone.replace(/\D/g, "")}@sama.local`;
  const emailExists = await prisma.user.findUnique({ where: { email } });
  const finalEmail = emailExists ? `${d.phone.replace(/\D/g, "")}.${Date.now().toString(36)}@sama.local` : email;

  const user = await prisma.user.create({ data: { name: d.name, phone: d.phone, email: finalEmail, password: await hashPassword(temp), role: "GESTIONNAIRE" } });
  await prisma.samaMember.create({ data: { businessId: business.id, userId: user.id, role: d.role as SamaRole } });
  await logActivity(business.id, userId, "employee.invited", { entityId: user.id, meta: { role: d.role } });
  revalidatePath("/sama/employes");
  return { ok: true, tempPassword: temp, identifiant: d.phone };
}

export async function updateMemberRoleAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "employees.manage");
  const memberId = String(formData.get("memberId") || "");
  const newRole = String(formData.get("role") || "SELLER") as SamaRole;
  const member = await prisma.samaMember.findFirst({ where: { id: memberId, businessId: business.id } });
  if (!member || member.role === "OWNER") return; // on ne modifie pas le propriétaire
  await prisma.samaMember.update({ where: { id: memberId }, data: { role: newRole } });
  await logActivity(business.id, userId, "employee.role", { entityId: memberId, meta: { role: newRole } });
  revalidatePath("/sama/employes");
}

export async function toggleMemberAction(formData: FormData): Promise<void> {
  const { business, role, userId } = await requireTenant();
  assertPermission(role, "employees.manage");
  const memberId = String(formData.get("memberId") || "");
  const member = await prisma.samaMember.findFirst({ where: { id: memberId, businessId: business.id } });
  if (!member || member.role === "OWNER") return;
  await prisma.samaMember.update({ where: { id: memberId }, data: { active: !member.active } });
  await logActivity(business.id, userId, "employee.toggle", { entityId: memberId, meta: { active: !member.active } });
  revalidatePath("/sama/employes");
}
