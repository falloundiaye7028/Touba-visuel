/**
 * Utilitaires monétaires SAMA BUSINESS.
 * Tous les montants sont manipulés en ENTIERS (FCFA sans décimales) afin
 * d'éviter les erreurs de virgule flottante. Les devises à décimales
 * (futures versions) seront gérées via un facteur d'échelle (minorUnits).
 */

export type CurrencyCode = "XOF" | "XAF" | "MRU" | "EUR" | "USD";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  XOF: { code: "XOF", label: "Franc CFA (UEMOA)", symbol: "FCFA", decimals: 0 },
  XAF: { code: "XAF", label: "Franc CFA (CEMAC)", symbol: "FCFA", decimals: 0 },
  MRU: { code: "MRU", label: "Ouguiya", symbol: "UM", decimals: 2 },
  EUR: { code: "EUR", label: "Euro", symbol: "€", decimals: 2 },
  USD: { code: "USD", label: "Dollar US", symbol: "$", decimals: 2 },
};

/** Formate un montant entier (unité principale) en chaîne lisible. */
export function formatMoney(amount: number, currency: CurrencyCode = "XOF"): string {
  const info = CURRENCIES[currency] ?? CURRENCIES.XOF;
  const value = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(amount);
  return `${value} ${info.symbol}`;
}

/** Formate un nombre sans devise (ex: quantités). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

/** Additionne une liste de montants entiers de façon sûre. */
export function sumAmounts(amounts: number[]): number {
  return amounts.reduce((acc, a) => acc + Math.round(a || 0), 0);
}

/** Parse une saisie utilisateur ("15 000", "15000") en entier FCFA. */
export function parseAmount(input: string | number): number {
  if (typeof input === "number") return Math.round(input);
  const cleaned = String(input).replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/** Calcule la marge brute d'une ligne. */
export function lineMargin(unitPrice: number, costPrice: number, quantity: number): number {
  return (Math.round(unitPrice) - Math.round(costPrice)) * Math.max(0, Math.round(quantity));
}

/** Pourcentage de marge (arrondi 1 décimale). */
export function marginPercent(total: number, cost: number): number {
  if (total <= 0) return 0;
  return Math.round(((total - cost) / total) * 1000) / 10;
}

/** Évolution en % entre deux périodes. */
export function growthPercent(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
