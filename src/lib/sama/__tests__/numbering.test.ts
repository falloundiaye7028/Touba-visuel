import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/sama/numbering";

describe("slugify", () => {
  it("met en minuscules et remplace les espaces", () => expect(slugify("Sama Fashion")).toBe("sama-fashion"));
  it("supprime les accents", () => expect(slugify("Épicerie Modou")).toBe("epicerie-modou"));
  it("retire la ponctuation", () => expect(slugify("Chez Awa & Fils !")).toBe("chez-awa-fils"));
  it("gère les tirets multiples et de bord", () => expect(slugify("  --Boutique--  ")).toBe("boutique"));
  it("repli sur 'boutique' si vide", () => expect(slugify("!!!")).toBe("boutique"));
  it("borne la longueur à 48 caractères", () => expect(slugify("a".repeat(100)).length).toBeLessThanOrEqual(48));
});
