import { describe, expect, it } from "vitest";
import { can, isWithinScope, TCK_ROLES } from "../permissions";
import { approveExpense, auditExpense, Expense, payExpense, submitExpense } from "../expense-workflow";
import { memberIdentifier, receiptIdentifier } from "../identifiers";

const draft = (): Expense => ({ id: "exp-1", amountXof: 125000, stage: "DRAFT", requesterId: "requester", approverIds: [] });

describe("socle d'autorisation TCK", () => {
  it("déclare les 14 rôles et limite le public aux rapports publics", () => {
    expect(TCK_ROLES).toHaveLength(14);
    expect(can("PUBLIC", "report:public-read")).toBe(true);
    expect(can("PUBLIC", "member:read")).toBe(false);
  });
  it("applique le périmètre zone, commission et projet sans accès implicite", () => {
    expect(isWithinScope({ zoneId: "z1" }, { zoneId: "z1" })).toBe(true);
    expect(isWithinScope({}, { zoneId: "z1" })).toBe(false);
    expect(isWithinScope({ zoneId: "z2" }, { zoneId: "z1" })).toBe(false);
  });
});

describe("séparation des responsabilités", () => {
  it("interdit au demandeur d'approuver", () => {
    const submitted = submitExpense(draft(), "requester");
    expect(() => approveExpense(submitted, "requester")).toThrow("demandeur");
  });
  it("exige le quorum avant paiement et empêche un approbateur de payer", () => {
    let expense = submitExpense(draft(), "requester");
    expense = approveExpense(expense, "approver-1", 2);
    expect(() => payExpense(expense, "payer")).toThrow("Quorum");
    expense = approveExpense(expense, "approver-2", 2);
    expect(() => payExpense(expense, "approver-1")).toThrow("indépendant");
    expect(payExpense(expense, "payer").stage).toBe("PAID");
  });
  it("rend le contrôle indépendant de toute la chaîne", () => {
    let expense = submitExpense(draft(), "requester");
    expense = approveExpense(expense, "approver", 1);
    expense = payExpense(expense, "payer");
    expect(() => auditExpense(expense, "payer")).toThrow("indépendant");
    expect(auditExpense(expense, "auditor").stage).toBe("AUDITED");
  });
});

describe("identifiants traçables", () => {
  it("génère les identifiants membre et reçu", () => {
    expect(memberIdentifier(42, 2026)).toBe("TCK-2026-000042");
    expect(receiptIdentifier(7, new Date("2026-08-27T00:00:00Z"))).toBe("TCK-R-20260827-000007");
  });
});
