import { describe, it, expect } from "vitest";
import { hasPermission, expandRolePermissions, ROLE_PERMISSIONS, resolveMemberPermission } from "@/lib/sama/constants";
import type { SamaRole } from "@prisma/client";

// Réplique de memberCan sans dépendance serveur (délègue à la fonction pure).
function memberCan(m: { role: SamaRole; customPermissions?: unknown }, perm: Parameters<typeof resolveMemberPermission>[2]) {
  return resolveMemberPermission(m.role, m.customPermissions ?? null, perm);
}
function member(partial: { role?: SamaRole; customPermissions?: unknown }) {
  return { role: "SELLER" as SamaRole, customPermissions: null, ...partial };
}

describe("hasPermission (rôles)", () => {
  it("le propriétaire a toutes les permissions", () => {
    expect(hasPermission("OWNER", "settings.manage")).toBe(true);
    expect(hasPermission("OWNER", "subscription.manage")).toBe(true);
  });
  it("le vendeur peut créer une vente mais pas gérer les paramètres", () => {
    expect(hasPermission("SELLER", "sales.create")).toBe(true);
    expect(hasPermission("SELLER", "settings.manage")).toBe(false);
  });
  it("le caissier gère les paiements, pas le stock", () => {
    expect(hasPermission("CASHIER", "payments.manage")).toBe(true);
    expect(hasPermission("CASHIER", "stock.manage")).toBe(false);
  });
  it("le gestionnaire de stock gère le stock, pas les paiements", () => {
    expect(hasPermission("STOCK", "stock.manage")).toBe(true);
    expect(hasPermission("STOCK", "payments.manage")).toBe(false);
  });
});

describe("expandRolePermissions", () => {
  it("développe OWNER en liste complète", () => {
    expect(expandRolePermissions("OWNER").length).toBeGreaterThan(10);
  });
  it("reflète les permissions du rôle vendeur", () => {
    const perms = expandRolePermissions("SELLER");
    expect(perms).toContain("sales.create");
    expect(perms).not.toContain("settings.manage");
  });
});

describe("memberCan (permissions personnalisées)", () => {
  it("le propriétaire passe toujours", () => {
    expect(memberCan(member({ role: "OWNER", customPermissions: [] }), "settings.manage")).toBe(true);
  });
  it("sans overrides, applique le rôle", () => {
    expect(memberCan(member({ role: "SELLER" }), "sales.create")).toBe(true);
    expect(memberCan(member({ role: "SELLER" }), "reports.finance")).toBe(false);
  });
  it("les permissions personnalisées remplacent le rôle", () => {
    const m = member({ role: "SELLER", customPermissions: ["reports.view", "reports.finance"] });
    expect(memberCan(m, "reports.finance")).toBe(true);
    expect(memberCan(m, "sales.create")).toBe(false); // retiré car hors de la liste custom
  });
  it("une liste custom vide retire tout (sauf OWNER)", () => {
    expect(memberCan(member({ role: "MANAGER", customPermissions: [] }), "sales.create")).toBe(false);
  });
});

describe("ROLE_PERMISSIONS cohérence", () => {
  it("chaque rôle est défini", () => {
    for (const role of ["OWNER", "MANAGER", "SELLER", "CASHIER", "STOCK", "COMMERCIAL"] as const) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
    }
  });
});
