import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auditData, requireTckRole, TckHttpError, tckApiError, TCK_STAFF_ROLES } from "@/lib/tck/server";
import { tckPasswordSchema } from "@/lib/tck/password";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: tckPasswordSchema,
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Le nouveau mot de passe doit être différent de l’ancien",
  path: ["newPassword"],
});

export async function POST(request: Request) {
  try {
    const actor = await requireTckRole(TCK_STAFF_ROLES);
    if (!actor.userId) throw new TckHttpError(403, "Compte utilisateur non rattaché");

    const parsed = changePasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Mot de passe invalide";
      return Response.json({ error: firstIssue }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: actor.userId }, select: { password: true } });
    if (!user?.password || !await bcrypt.compare(parsed.data.currentPassword, user.password)) {
      return Response.json({ error: "Le mot de passe actuel est incorrect" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: actor.userId }, data: { password: passwordHash } }),
      prisma.tckAuditEvent.create({
        data: {
          action: "PASSWORD_CHANGED",
          entity: "ACCOUNT",
          entityId: actor.userId,
          actorId: actor.id,
          metadata: auditData({ method: "SELF_SERVICE" }),
        },
      }),
    ]);

    return Response.json({ changed: true });
  } catch (error) {
    return tckApiError(error);
  }
}
