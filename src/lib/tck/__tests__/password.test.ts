import { describe, expect, it } from "vitest";
import { tckPasswordSchema } from "../password";

describe("politique de mot de passe TCK", () => {
  it("accepte un mot de passe fort", () => {
    expect(tckPasswordSchema.safeParse("Touba#2026Secure").success).toBe(true);
  });

  it.each([
    "Court#2A",
    "TOUBA#2026SECURE",
    "touba#2026secure",
    "ToubaSecure####",
    "Touba2026Secure",
  ])("refuse un mot de passe faible : %s", (password) => {
    expect(tckPasswordSchema.safeParse(password).success).toBe(false);
  });
});
