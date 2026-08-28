import { describe, expect, it } from "vitest";
import { tckContributionSchema } from "../contribution";

describe("validation des contributions TCK", () => {
  it("normalise le code membre et accepte une référence externe vide", () => {
    const parsed = tckContributionSchema.parse({ memberCode: "tck-001", amount: "1000", channel: "Wave", externalReference: "" });
    expect(parsed).toMatchObject({ memberCode: "TCK-001", amount: 1000, externalReference: undefined });
  });

  it("refuse les montants hors limites", () => {
    expect(tckContributionSchema.safeParse({ memberCode: "TCK-001", amount: 99, channel: "Wave" }).success).toBe(false);
    expect(tckContributionSchema.safeParse({ memberCode: "TCK-001", amount: 1_000_000_001, channel: "Wave" }).success).toBe(false);
  });

  it("conserve une référence opérateur valide", () => {
    expect(tckContributionSchema.parse({ memberCode: "TCK-001", amount: 5000, channel: "Orange Money", externalReference: " OM-2026-42 " }).externalReference).toBe("OM-2026-42");
  });
});
