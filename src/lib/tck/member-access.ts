import { z } from "zod";
import { tckPasswordSchema } from "@/lib/tck/password";

export const tckMemberRoleSchema = z.enum(["ADMIN", "COLLECTOR", "COMMISSION_MANAGER", "CONTROLLER", "MEMBER"]);
export const tckMemberStatusSchema = z.enum(["ACTIVE", "TO_FOLLOW_UP", "SUSPENDED"]);

export const tckMemberAccessSchema = z.object({
  role: tckMemberRoleSchema,
  status: tckMemberStatusSchema,
  email: z.union([z.string().trim().toLowerCase().email("Adresse e-mail invalide").max(190), z.literal("")]).optional(),
  temporaryPassword: z.union([tckPasswordSchema, z.literal("")]).optional(),
});

export function memberAccessTransitionError(input: {
  actorId: string;
  targetId: string;
  currentRole: z.infer<typeof tckMemberRoleSchema>;
  currentStatus: z.infer<typeof tckMemberStatusSchema>;
  nextRole: z.infer<typeof tckMemberRoleSchema>;
  nextStatus: z.infer<typeof tckMemberStatusSchema>;
  activeAdminCount: number;
}) {
  const removesActiveAdmin = input.currentRole === "ADMIN"
    && input.currentStatus === "ACTIVE"
    && (input.nextRole !== "ADMIN" || input.nextStatus !== "ACTIVE");

  if (input.actorId === input.targetId && removesActiveAdmin) {
    return "Vous ne pouvez pas retirer votre propre accès administrateur";
  }
  if (removesActiveAdmin && input.activeAdminCount <= 1) {
    return "Le dernier administrateur actif doit être conservé";
  }
  return null;
}
