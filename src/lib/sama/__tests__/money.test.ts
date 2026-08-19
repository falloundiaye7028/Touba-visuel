import { describe, it, expect } from "vitest";
import { parseAmount, sumAmounts, lineMargin, marginPercent, growthPercent, formatMoney } from "@/lib/sama/money";

describe("parseAmount", () => {
  it("parse une chaîne avec espaces", () => expect(parseAmount("15 000")).toBe(15000));
  it("parse une chaîne avec suffixe", () => expect(parseAmount("15000 FCFA")).toBe(15000));
  it("arrondit les nombres", () => expect(parseAmount(15000.7)).toBe(15001));
  it("retourne 0 sur entrée invalide", () => expect(parseAmount("abc")).toBe(0));
});

describe("sumAmounts", () => {
  it("additionne sans erreur de virgule flottante", () => {
    expect(sumAmounts([1000, 2000, 3000])).toBe(6000);
  });
  it("ignore les valeurs nulles", () => expect(sumAmounts([1000, NaN, 500])).toBe(1500));
});

describe("lineMargin", () => {
  it("marge = (prix - coût) * quantité", () => expect(lineMargin(25000, 12000, 3)).toBe(39000));
  it("quantité négative traitée comme 0", () => expect(lineMargin(25000, 12000, -2)).toBe(0));
});

describe("marginPercent", () => {
  it("pourcentage de marge", () => expect(marginPercent(100000, 60000)).toBe(40));
  it("total nul", () => expect(marginPercent(0, 0)).toBe(0));
});

describe("growthPercent", () => {
  it("croissance positive", () => expect(growthPercent(120, 100)).toBe(20));
  it("baisse", () => expect(growthPercent(80, 100)).toBe(-20));
  it("base nulle avec valeur positive => 100%", () => expect(growthPercent(50, 0)).toBe(100));
  it("base nulle sans valeur => 0", () => expect(growthPercent(0, 0)).toBe(0));
});

describe("formatMoney", () => {
  it("formate en FCFA sans décimales", () => {
    // espaces insécables selon l'environnement Intl : on normalise
    expect(formatMoney(15000).replace(/\s/g, " ")).toMatch(/15\s?000\s?FCFA/);
  });
});
