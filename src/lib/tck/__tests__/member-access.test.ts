import { describe, expect, it } from "vitest";
import { memberAccessTransitionError, tckMemberAccessSchema } from "../member-access";

describe("administration des accès TCK", () => {
  it("valide un rôle, un statut et un mot de passe fort", () => {
    expect(tckMemberAccessSchema.safeParse({
      role: "COLLECTOR",
      status: "ACTIVE",
      email: "collecteur@tck.sn",
      temporaryPassword: "Touba#2026Collecteur",
    }).success).toBe(true);
  });

  it("refuse un rôle inconnu et un mot de passe faible", () => {
    expect(tckMemberAccessSchema.safeParse({
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      temporaryPassword: "faible",
    }).success).toBe(false);
  });

  it("protège l’administrateur courant contre l’auto-suspension", () => {
    expect(memberAccessTransitionError({
      actorId: "member-1",
      targetId: "member-1",
      currentRole: "ADMIN",
      currentStatus: "ACTIVE",
      nextRole: "ADMIN",
      nextStatus: "SUSPENDED",
      activeAdminCount: 2,
    })).toContain("propre accès");
  });

  it("conserve toujours un dernier administrateur actif", () => {
    expect(memberAccessTransitionError({
      actorId: "member-2",
      targetId: "member-1",
      currentRole: "ADMIN",
      currentStatus: "ACTIVE",
      nextRole: "CONTROLLER",
      nextStatus: "ACTIVE",
      activeAdminCount: 1,
    })).toContain("dernier administrateur");
  });
});
