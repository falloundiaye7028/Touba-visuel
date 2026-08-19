/**
 * Logique de calcul PURE (sans base de données) pour les ventes et le stock.
 * Isolée ici pour être testable et réutilisable (ventes, devis, commandes).
 * Tous les montants sont des entiers FCFA.
 */

export interface CalcLine {
  quantity: number;
  unitPrice: number;
  costPrice: number;
}

export interface SaleTotals {
  subtotal: number;
  cost: number;
  discount: number;
  total: number;
  margin: number;
}

export type PromoType = "POURCENTAGE" | "MONTANT";

/** Remise apportée par un code promo sur un sous-total. */
export function promoDiscount(subtotal: number, promo: { type: PromoType; value: number } | null): number {
  if (!promo || subtotal <= 0) return 0;
  const d = promo.type === "POURCENTAGE" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return Math.min(Math.max(0, d), subtotal);
}

/**
 * Calcule les totaux d'une vente. `manualDiscount` et `promo` s'additionnent,
 * le tout borné au sous-total. `total` ne peut pas être négatif.
 */
export function saleTotals(
  lines: CalcLine[],
  opts: { manualDiscount?: number; deliveryFee?: number; promo?: { type: PromoType; value: number } | null } = {}
): SaleTotals {
  const manualDiscount = Math.max(0, Math.round(opts.manualDiscount ?? 0));
  const deliveryFee = Math.max(0, Math.round(opts.deliveryFee ?? 0));

  let subtotal = 0;
  let cost = 0;
  for (const l of lines) {
    const qty = Math.max(0, Math.round(l.quantity));
    subtotal += Math.round(l.unitPrice) * qty;
    cost += Math.round(l.costPrice) * qty;
  }

  const promo = promoDiscount(subtotal, opts.promo ?? null);
  const discount = Math.min(subtotal, manualDiscount + promo);
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const margin = subtotal - discount - cost;
  return { subtotal, cost, discount, total, margin };
}

export type PayStatus = "PAYE" | "PARTIEL" | "CREDIT";

/** Statut de paiement d'après le montant versé et le total. */
export function payStatusFor(amountPaid: number, total: number): PayStatus {
  const paid = Math.min(Math.max(0, Math.round(amountPaid)), Math.max(0, total));
  if (paid >= total && total > 0) return "PAYE";
  return paid > 0 ? "PARTIEL" : "CREDIT";
}

/** Vérifie qu'une quantité vendue ne dépasse pas le stock disponible. */
export function hasEnoughStock(stock: number, quantity: number): boolean {
  return stock >= quantity;
}

/** Nouveau stock après une vente (jamais en dessous de zéro). */
export function stockAfterSale(stock: number, quantity: number): number {
  return Math.max(0, stock - Math.max(0, Math.round(quantity)));
}

/** Nouveau stock après annulation d'une vente (restauration). */
export function stockAfterCancel(stock: number, quantity: number): number {
  return stock + Math.max(0, Math.round(quantity));
}
