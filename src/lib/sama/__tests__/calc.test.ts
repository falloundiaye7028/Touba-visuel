import { describe, it, expect } from "vitest";
import {
  saleTotals, promoDiscount, payStatusFor, hasEnoughStock, stockAfterSale, stockAfterCancel,
} from "@/lib/sama/calc";

describe("saleTotals", () => {
  const lines = [
    { quantity: 2, unitPrice: 25000, costPrice: 12000 }, // 50 000, coût 24 000
    { quantity: 1, unitPrice: 15000, costPrice: 7000 },  // 15 000, coût 7 000
  ];

  it("calcule sous-total, coût, total et marge", () => {
    const t = saleTotals(lines);
    expect(t.subtotal).toBe(65000);
    expect(t.cost).toBe(31000);
    expect(t.total).toBe(65000);
    expect(t.margin).toBe(34000); // 65 000 - 31 000
  });

  it("applique remise manuelle et frais de livraison", () => {
    const t = saleTotals(lines, { manualDiscount: 5000, deliveryFee: 2000 });
    expect(t.discount).toBe(5000);
    expect(t.total).toBe(62000); // 65 000 - 5 000 + 2 000
    expect(t.margin).toBe(29000); // 65 000 - 5 000 - 31 000 (livraison hors marge)
  });

  it("cumule remise manuelle et code promo, borné au sous-total", () => {
    const t = saleTotals(lines, { manualDiscount: 3000, promo: { type: "POURCENTAGE", value: 10 } });
    // promo 10% de 65 000 = 6 500 ; total remise = 9 500
    expect(t.discount).toBe(9500);
    expect(t.total).toBe(55500);
  });

  it("ne rend jamais un total négatif ni une remise supérieure au sous-total", () => {
    const t = saleTotals([{ quantity: 1, unitPrice: 10000, costPrice: 5000 }], { manualDiscount: 999999 });
    expect(t.discount).toBe(10000);
    expect(t.total).toBe(0);
  });

  it("gère un panier vide", () => {
    const t = saleTotals([]);
    expect(t).toEqual({ subtotal: 0, cost: 0, discount: 0, total: 0, margin: 0 });
  });
});

describe("promoDiscount", () => {
  it("pourcentage", () => expect(promoDiscount(20000, { type: "POURCENTAGE", value: 15 })).toBe(3000));
  it("montant fixe", () => expect(promoDiscount(20000, { type: "MONTANT", value: 5000 })).toBe(5000));
  it("montant plafonné au sous-total", () => expect(promoDiscount(3000, { type: "MONTANT", value: 5000 })).toBe(3000));
  it("aucun promo", () => expect(promoDiscount(20000, null)).toBe(0));
});

describe("payStatusFor", () => {
  it("payé intégralement", () => expect(payStatusFor(10000, 10000)).toBe("PAYE"));
  it("partiel", () => expect(payStatusFor(4000, 10000)).toBe("PARTIEL"));
  it("crédit (rien versé)", () => expect(payStatusFor(0, 10000)).toBe("CREDIT"));
  it("versé supérieur au total reste payé", () => expect(payStatusFor(15000, 10000)).toBe("PAYE"));
  it("total nul", () => expect(payStatusFor(0, 0)).toBe("CREDIT"));
});

describe("stock", () => {
  it("stock suffisant", () => expect(hasEnoughStock(20, 3)).toBe(true));
  it("stock insuffisant", () => expect(hasEnoughStock(2, 3)).toBe(false));
  it("décrément (20 - 3 = 17)", () => expect(stockAfterSale(20, 3)).toBe(17));
  it("décrément jamais négatif", () => expect(stockAfterSale(2, 5)).toBe(0));
  it("restauration après annulation (17 + 3 = 20)", () => expect(stockAfterCancel(17, 3)).toBe(20));
});
