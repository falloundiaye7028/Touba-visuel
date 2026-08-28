import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { memberAccessTransitionError, tckMemberAccessSchema } from "@/lib/tck/member-access";
import { auditData, requireTckRole, TckHttpError, tckApiError } from "@/lib/tck/server";

type RouteContext = { params: Promise<{ memberCode: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const actor = await requireTckRole(["ADMIN"]);
    const { memberCode } = await params;
    const parsed = tckMemberAccessSchema.safeParse(await request.json());
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Paramètres d’accès invalides";
      return Response.json({ error: firstIssue, issues: parsed.error.flatten() }, { status: 400 });
    }

    const target = await prisma.tckMember.findUnique({
      where: { memberCode },
      include: { user: { select: { id: true, email: true } } },
    });
    if (!target) throw new TckHttpError(404, "Membre introuvable");

    const activeAdminCount = await prisma.tckMember.count({ where: { role: "ADMIN", status: "ACTIVE" } });
    const transitionError = memberAccessTransitionError({
      actorId: actor.id,
      targetId: target.id,
      currentRole: target.role,
      currentStatus: target.status,
      nextRole: parsed.data.role,
      nextStatus: parsed.data.status,
      activeAdminCount,
    });
    if (transitionError) throw new TckHttpError(400, transitionError);

    const email = parsed.data.email?.trim().toLowerCase() || "";
    const temporaryPassword = parsed.data.temporaryPassword || "";
    const requestsAccount = Boolean(email || temporaryPassword || target.userId);
    if (!target.userId && requestsAccount && parsed.data.role === "MEMBER") {
      throw new TckHttpError(400, "Un compte de connexion doit recevoir un rôle opérationnel");
    }
    if (!target.userId && requestsAccount && (!email || !temporaryPassword)) {
      throw new TckHttpError(400, "Une adresse e-mail et un mot de passe temporaire sont requis pour créer l’accès");
    }
    if (email) {
      const emailOwner = await prisma.user.findUnique({ where: { email }, include: { tckMember: { select: { id: true } } } });
      if (target.userId && emailOwner && emailOwner.id !== target.userId) {
        throw new TckHttpError(409, "Cette adresse e-mail appartient déjà à un autre compte");
      }
      if (!target.userId && emailOwner?.tckMember && emailOwner.tckMember.id !== target.id) {
        throw new TckHttpError(409, "Cette adresse e-mail est déjà liée à un autre membre TCK");
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      let userId = target.userId;
      let accountEmail = target.user?.email || null;

      if (requestsAccount) {
        const passwordHash = temporaryPassword ? await bcrypt.hash(temporaryPassword, 12) : undefined;
        if (target.userId) {
          const user = await tx.user.update({
            where: { id: target.userId },
            data: {
              name: target.name,
              phone: target.phone,
              ...(email ? { email } : {}),
              ...(passwordHash ? { password: passwordHash } : {}),
            },
            select: { id: true, email: true },
          });
          userId = user.id;
          accountEmail = user.email;
        } else {
          const existing = await tx.user.findUnique({ where: { email }, include: { tckMember: { select: { id: true } } } });
          if (existing?.tckMember && existing.tckMember.id !== target.id) {
            throw new TckHttpError(409, "Cette adresse e-mail est déjà liée à un autre membre TCK");
          }
          const user = existing
            ? await tx.user.update({ where: { id: existing.id }, data: { name: target.name, phone: target.phone, password: passwordHash }, select: { id: true, email: true } })
            : await tx.user.create({ data: { email, name: target.name, phone: target.phone, password: passwordHash, role: "CLIENT" }, select: { id: true, email: true } });
          userId = user.id;
          accountEmail = user.email;
        }
      }

      const member = await tx.tckMember.update({
        where: { id: target.id },
        data: { role: parsed.data.role, status: parsed.data.status, ...(userId ? { userId } : {}) },
        select: { id: true, memberCode: true, name: true, role: true, status: true },
      });
      await tx.tckAuditEvent.create({
        data: {
          action: "MEMBER_ACCESS_UPDATED",
          entity: "MEMBER",
          entityId: member.id,
          actorId: actor.id,
          metadata: auditData({
            memberCode: member.memberCode,
            name: member.name,
            previousRole: target.role,
            role: member.role,
            previousStatus: target.status,
            status: member.status,
            accountEnabled: Boolean(userId),
            email: accountEmail,
            passwordReset: Boolean(temporaryPassword),
          }),
        },
      });
      return { ...member, accountEnabled: Boolean(userId), email: accountEmail };
    });

    return Response.json({ record: updated });
  } catch (error) {
    return tckApiError(error);
  }
}
