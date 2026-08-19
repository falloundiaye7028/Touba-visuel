/**
 * SAMA AI — moteur d'analyse et de génération.
 *
 * Principe de sûreté : tous les CHIFFRES proviennent de calculs déterministes
 * sur la base de données réelle de l'entreprise. Le modèle de langage ne sert
 * qu'à formuler/enrichir, jamais à inventer des montants.
 */
import type { SamaBusiness } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getDashboardData, getTopProducts } from "@/lib/sama/queries";
import { formatMoney, growthPercent, type CurrencyCode } from "@/lib/sama/money";
import { effectivePlanCode, isActive } from "@/lib/sama/limits";

const AI_ENDPOINT = "https://text.pollinations.ai/openai";

/** SAMA AI est réservé au plan Pro IA (ou pendant l'essai actif). */
export function canUseAI(business: SamaBusiness): boolean {
  return effectivePlanCode(business) === "PRO_IA" || (business.subscriptionStatus === "TRIAL" && isActive(business));
}

/** Appel générique au modèle (renvoie null en cas d'échec, jamais d'exception). */
export async function callAI(system: string, user: string, temperature = 0.7): Promise<string | null> {
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature,
        max_tokens: 1500,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.choices?.[0]?.message?.content as string)?.trim() ?? null;
  } catch {
    return null;
  }
}

export interface BusinessSnapshot {
  currency: CurrencyCode;
  todayRevenue: number; todaySales: number; todayMargin: number;
  monthRevenue: number; monthMargin: number; monthExpenses: number; monthGrowth: number;
  avgBasket: number; receivables: number; lowStockCount: number; pendingOrders: number;
  topByRevenue: { name: string; quantity: number; revenue: number }[];
  topByMargin: { name: string; margin: number }[];
  lowStock: { name: string; stock: number; unit: string }[];
  inactiveCustomers: number;
  topSeller: { name: string; total: number } | null;
  bestDay: { label: string; revenue: number } | null;
}

/** Construit un instantané factuel de l'entreprise (données réelles). */
export async function buildSnapshot(business: SamaBusiness): Promise<BusinessSnapshot> {
  const cur = business.currency as CurrencyCode;
  const [dash, topRev, marginItems, lowStockRows, sellerRows] = await Promise.all([
    getDashboardData(business.id),
    getTopProducts(business.id, 5),
    prisma.samaSaleItem.findMany({
      where: { sale: { businessId: business.id, cancelled: false } },
      select: { name: true, total: true, costPrice: true, quantity: true },
      take: 5000,
    }),
    prisma.samaProduct.findMany({ where: { businessId: business.id, archived: false, stock: { lte: 5 } }, select: { name: true, stock: true, unit: true }, orderBy: { stock: "asc" }, take: 20 }),
    prisma.samaSale.groupBy({ by: ["sellerId"], where: { businessId: business.id, cancelled: false, sellerId: { not: null } }, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 1 }),
  ]);

  // Marge cumulée par produit = Σ(total de ligne) − Σ(coût unitaire × quantité)
  const marginByName = new Map<string, number>();
  for (const it of marginItems) {
    const marginLine = it.total - it.costPrice * it.quantity;
    marginByName.set(it.name, (marginByName.get(it.name) ?? 0) + marginLine);
  }
  const topByMargin = Array.from(marginByName.entries())
    .map(([name, margin]) => ({ name, margin }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  const cutoff = new Date(Date.now() - 60 * 86400000);
  const inactiveCustomers = await prisma.samaCustomer.count({
    where: { businessId: business.id, sales: { none: { createdAt: { gte: cutoff } } } },
  });

  let topSeller: { name: string; total: number } | null = null;
  if (sellerRows[0]?.sellerId) {
    const m = await prisma.samaMember.findUnique({ where: { id: sellerRows[0].sellerId }, include: { user: { select: { name: true } } } });
    if (m) topSeller = { name: m.user.name || "Vendeur", total: sellerRows[0]._sum.total ?? 0 };
  }

  const bestDay = dash.chart7.reduce<{ label: string; revenue: number } | null>((best, d) => (!best || d.revenue > best.revenue ? d : best), null);

  return {
    currency: cur,
    todayRevenue: dash.today.revenue, todaySales: dash.today.salesCount, todayMargin: dash.today.margin,
    monthRevenue: dash.month.revenue, monthMargin: dash.month.margin, monthExpenses: dash.month.expenses,
    monthGrowth: growthPercent(dash.month.revenue, dash.prevMonth.revenue),
    avgBasket: dash.avgBasket, receivables: dash.receivables, lowStockCount: dash.lowStock, pendingOrders: dash.pendingOrders,
    topByRevenue: topRev, topByMargin, lowStock: lowStockRows,
    inactiveCustomers, topSeller, bestDay,
  };
}

/** Moteur d'intentions déterministe : réponses factuelles à partir des données. */
export function answerFromSnapshot(question: string, s: BusinessSnapshot): string | null {
  const q = question.toLowerCase();
  const m = (n: number) => formatMoney(n, s.currency);

  if (/(vendu|vente|chiffre).*(aujourd|jour)|aujourd.*(vendu|vente)/.test(q))
    return `Aujourd'hui, vous avez réalisé ${s.todaySales} vente${s.todaySales > 1 ? "s" : ""} pour un chiffre d'affaires de ${m(s.todayRevenue)}, avec un bénéfice estimé de ${m(s.todayMargin)}.`;

  if (/(rentable|marge|b[ée]n[ée]fice).*(produit|article)|produit.*(rentable|rapporte)/.test(q)) {
    if (!s.topByMargin.length) return "Aucune vente enregistrée pour le moment.";
    const t = s.topByMargin[0];
    return `Votre produit le plus rentable est « ${t.name} » avec ${m(t.margin)} de marge cumulée. Suivent : ${s.topByMargin.slice(1, 3).map((p) => `${p.name} (${m(p.margin)})`).join(", ") || "—"}.`;
  }

  if (/(rupture|stock faible|bient[oô]t|manque|r[ée]approvision)/.test(q)) {
    if (!s.lowStock.length) return "Aucun produit en stock faible actuellement. 👍";
    return `${s.lowStock.length} produit(s) à surveiller : ${s.lowStock.slice(0, 6).map((p) => `${p.name} (${p.stock} ${p.unit})`).join(", ")}.`;
  }

  if (/(inactif|n'ont|pas achet|revenir|relanc).*(client)|client.*(inactif|60|90|pas)/.test(q))
    return `${s.inactiveCustomers} client(s) n'ont rien acheté depuis plus de 60 jours. Une relance (WhatsApp, promo) pourrait les réactiver.`;

  if (/(vendeur|employ[ée]|[ée]quipe).*(meilleur|plus|top)|qui.*vend/.test(q)) {
    if (!s.topSeller) return "Aucune vente attribuée à un vendeur pour l'instant.";
    return `Votre meilleur vendeur est ${s.topSeller.name} avec ${m(s.topSeller.total)} de ventes.`;
  }

  if (/([ée]volu|progress|tendance|croissance|mois)/.test(q))
    return `Ce mois-ci : ${m(s.monthRevenue)} de CA (${s.monthGrowth >= 0 ? "+" : ""}${s.monthGrowth}% vs mois dernier), ${m(s.monthMargin)} de marge, ${m(s.monthExpenses)} de dépenses. Panier moyen : ${m(s.avgBasket)}.`;

  if (/(d[ée]pense|charge|surveiller)/.test(q))
    return `Vos dépenses du mois s'élèvent à ${m(s.monthExpenses)} pour une marge brute de ${m(s.monthMargin)}. Résultat estimé : ${m(s.monthMargin - s.monthExpenses)}.`;

  if (/(cr[ée]ance|dette|doit|reste.*encaiss|impay)/.test(q))
    return `Le montant restant à encaisser auprès de vos clients est de ${m(s.receivables)}.`;

  if (/(meilleur jour|quel jour)/.test(q) && s.bestDay)
    return `Sur les 7 derniers jours, votre meilleur jour est ${s.bestDay.label} avec ${m(s.bestDay.revenue)}.`;

  return null;
}

/** Rapport hebdomadaire synthétique (chiffres réels + recommandations). */
export function weeklyReport(s: BusinessSnapshot): { lines: string[]; recommendations: string[] } {
  const m = (n: number) => formatMoney(n, s.currency);
  const lines = [
    `Chiffre d'affaires du mois : ${m(s.monthRevenue)} (${s.monthGrowth >= 0 ? "+" : ""}${s.monthGrowth}% vs mois dernier)`,
    `Bénéfice estimé : ${m(s.monthMargin - s.monthExpenses)} · panier moyen ${m(s.avgBasket)}`,
    s.topByRevenue[0] ? `Produit le plus vendu : ${s.topByRevenue[0].name}` : "Aucune vente ce mois",
    s.bestDay ? `Meilleur jour récent : ${s.bestDay.label}` : "",
  ].filter(Boolean);

  const recommendations: string[] = [];
  if (s.lowStockCount > 0) recommendations.push(`${s.lowStockCount} produit(s) proche(s) de la rupture — pensez à réapprovisionner.`);
  if (s.inactiveCustomers > 0) recommendations.push(`${s.inactiveCustomers} ancien(s) client(s) inactif(s) depuis 60 jours — lancez une relance.`);
  if (s.receivables > 0) recommendations.push(`${m(s.receivables)} restent à encaisser — relancez les clients débiteurs.`);
  if (s.monthGrowth < 0) recommendations.push("Votre CA est en baisse ce mois — envisagez une promotion ou une campagne.");
  if (recommendations.length === 0) recommendations.push("Tout est au vert ! Continuez à enregistrer vos ventes quotidiennement.");
  return { lines, recommendations };
}

export const TONES = [
  { value: "professionnel", label: "Professionnel" },
  { value: "vendeur", label: "Vendeur" },
  { value: "premium", label: "Premium" },
  { value: "simple", label: "Simple" },
  { value: "dynamique", label: "Dynamique" },
] as const;

export interface ProductContent {
  title: string; description: string; facebook: string; instagram: string;
  tiktok: string; whatsapp: string; slogan: string; hashtags: string; promo: string;
}

/** Génère du contenu marketing pour un produit (via le modèle). */
export async function generateProductContent(
  productName: string, price: string, businessName: string, activity: string, tone: string
): Promise<ProductContent | null> {
  const system = "Tu es un expert en marketing digital pour les commerces et PME du Sénégal et d'Afrique francophone. Tu écris des textes de vente accrocheurs, avec des emojis pertinents et quelques mots en wolof quand c'est naturel. Tu réponds UNIQUEMENT en JSON valide, sans texte autour.";
  const user = `Génère du contenu marketing pour ce produit.
Entreprise : ${businessName} (${activity || "commerce"})
Produit : ${productName}
Prix : ${price}
Ton souhaité : ${tone}

Réponds STRICTEMENT avec ce JSON :
{
  "title": "titre produit accrocheur",
  "description": "description commerciale (2-3 phrases)",
  "facebook": "publication Facebook complète avec emojis et appel à l'action",
  "instagram": "légende Instagram avec emojis",
  "tiktok": "texte court et punchy pour TikTok",
  "whatsapp": "message WhatsApp court et direct pour diffusion",
  "slogan": "slogan court et mémorable",
  "hashtags": "#Senegal #Dakar ... (8 hashtags pertinents)",
  "promo": "idée d'offre promotionnelle"
}`;

  const raw = await callAI(system, user, 0.9);
  if (!raw) return null;
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as ProductContent;
  } catch {
    return null;
  }
}
