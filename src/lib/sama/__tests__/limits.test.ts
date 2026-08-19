import { describe, it, expect } from "vitest";
import { isActive, effectivePlanCode, planLimits } from "@/lib/sama/limits";
import type { SamaBusiness } from "@prisma/client";

function biz(partial: Partial<SamaBusiness>): SamaBusiness {
  return {
    id: "b", ownerId: "o", name: "Test", slug: "test", planCode: "BUSINESS",
    subscriptionStatus: "TRIAL", trialEndsAt: null, subEndsAt: null,
    currency: "XOF", country: "SN",
    ...partial,
  } as unknown as SamaBusiness;
}

const inFuture = new Date(Date.now() + 5 * 86400000);
const inPast = new Date(Date.now() - 5 * 86400000);

describe("isActive", () => {
  it("abonnement ACTIVE => actif", () => expect(isActive(biz({ subscriptionStatus: "ACTIVE" }))).toBe(true));
  it("essai en cours => actif", () => expect(isActive(biz({ subscriptionStatus: "TRIAL", trialEndsAt: inFuture }))).toBe(true));
  it("essai expiré => inactif", () => expect(isActive(biz({ subscriptionStatus: "TRIAL", trialEndsAt: inPast }))).toBe(false));
  it("suspendu => inactif", () => expect(isActive(biz({ subscriptionStatus: "SUSPENDED" }))).toBe(false));
});

describe("effectivePlanCode", () => {
  it("essai actif conserve le plan choisi", () => {
    expect(effectivePlanCode(biz({ planCode: "BUSINESS", subscriptionStatus: "TRIAL", trialEndsAt: inFuture }))).toBe("BUSINESS");
  });
  it("essai expiré retombe sur GRATUIT", () => {
    expect(effectivePlanCode(biz({ planCode: "BUSINESS", subscriptionStatus: "TRIAL", trialEndsAt: inPast }))).toBe("GRATUIT");
  });
  it("abonnement PRO_IA actif reste PRO_IA", () => {
    expect(effectivePlanCode(biz({ planCode: "PRO_IA", subscriptionStatus: "ACTIVE" }))).toBe("PRO_IA");
  });
});

describe("planLimits", () => {
  it("plan Gratuit : limites strictes", () => {
    const p = planLimits(biz({ planCode: "GRATUIT", subscriptionStatus: "ACTIVE" }));
    expect(p.maxProducts).toBe(30);
    expect(p.maxSalesMonth).toBe(50);
  });
  it("plan Business : produits illimités", () => {
    const p = planLimits(biz({ planCode: "BUSINESS", subscriptionStatus: "ACTIVE" }));
    expect(p.maxProducts).toBeNull();
  });
});
