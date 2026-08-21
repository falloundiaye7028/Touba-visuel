"use server";

import { prisma } from "@/lib/db";
import { requireTenant, logActivity } from "@/lib/sama/tenant";
import { formatMoney } from "@/lib/sama/money";
import { answerDailyPriorities } from "@/lib/sama/priorities";
import {
  canUseAI, buildSnapshot, answerFromSnapshot, callAI, generateProductContent,
  type BusinessSnapshot, type ProductContent,
} from "@/lib/sama/ai";

export interface AskState { answer?: string; error?: string; question?: string }
export interface ContentState { content?: ProductContent; error?: string }

/** Construit un contexte factuel compact pour cadrer la réponse du modèle. */
function factSheet(s: BusinessSnapshot): string {
  const m = (n: number) => formatMoney(n, s.currency);
  return [
    `CA aujourd'hui: ${m(s.todayRevenue)} (${s.todaySales} ventes), marge ${m(s.todayMargin)}`,
    `CA du mois: ${m(s.monthRevenue)}, évolution ${s.monthGrowth}%, marge ${m(s.monthMargin)}, dépenses ${m(s.monthExpenses)}`,
    `Panier moyen: ${m(s.avgBasket)}, créances: ${m(s.receivables)}`,
    `Produits stock faible: ${s.lowStock.map((p) => `${p.name}(${p.stock})`).join(", ") || "aucun"}`,
    `Top produits (CA): ${s.topByRevenue.map((p) => p.name).join(", ") || "aucun"}`,
    `Produit le plus rentable: ${s.topByMargin[0]?.name ?? "n/a"}`,
    `Clients inactifs (>60j): ${s.inactiveCustomers}`,
    `Meilleur vendeur: ${s.topSeller ? `${s.topSeller.name} (${m(s.topSeller.total)})` : "n/a"}`,
  ].join("\n");
}

export async function askSamaAiAction(_prev: AskState, formData: FormData): Promise<AskState> {
  const { business, userId } = await requireTenant();
  const question = String(formData.get("question") || "").trim();
  if (!question) return { error: "Posez une question." };
  if (!canUseAI(business)) return { error: "SAMA AI est réservé au plan Pro IA (ou pendant votre essai)." };

  const snapshot = await buildSnapshot(business);

  // 1) Priorités quotidiennes déterministes : aucune donnée inventée.
  const priorities = answerDailyPriorities(question, snapshot);
  if (priorities) {
    await logActivity(business.id, userId, "ai.used", { meta: { mode: "daily-priorities" } });
    return { answer: priorities, question };
  }

  // 2) Réponse déterministe (chiffres exacts) pour les intentions courantes.
  const direct = answerFromSnapshot(question, snapshot);
  if (direct) {
    await logActivity(business.id, userId, "ai.used", { meta: { mode: "direct" } });
    return { answer: direct, question };
  }

  // 3) Sinon, le modèle formule à partir des SEULS faits fournis.
  const system = "Tu es SAMA AI, l'assistant de gestion d'un commerçant sénégalais. Tu réponds en français, brièvement et concrètement. Tu ne dois utiliser QUE les chiffres présents dans le contexte fourni. Si l'information n'y est pas, dis-le simplement sans inventer de chiffres.";
  const user = `Contexte (données réelles de l'entreprise « ${business.name} ») :\n${factSheet(snapshot)}\n\nQuestion du commerçant : ${question}`;
  const ai = await callAI(system, user, 0.4);
  await logActivity(business.id, userId, "ai.used", { meta: { mode: "llm" } });

  if (!ai) {
    return {
      answer: `Voici un résumé de votre activité :\n• CA du mois : ${formatMoney(snapshot.monthRevenue, snapshot.currency)} (${snapshot.monthGrowth}%)\n• Marge : ${formatMoney(snapshot.monthMargin, snapshot.currency)}\n• Créances : ${formatMoney(snapshot.receivables, snapshot.currency)}\n• Produits en stock faible : ${snapshot.lowStockCount}`,
      question,
    };
  }
  return { answer: ai, question };
}

export async function generateProductContentAction(_prev: ContentState, formData: FormData): Promise<ContentState> {
  const { business, userId } = await requireTenant();
  if (!canUseAI(business)) return { error: "La génération de contenu est réservée au plan Pro IA (ou pendant votre essai)." };

  const productId = String(formData.get("productId") || "");
  const tone = String(formData.get("tone") || "vendeur");
  const product = await prisma.samaProduct.findFirst({ where: { id: productId, businessId: business.id } });
  if (!product) return { error: "Produit introuvable." };

  const content = await generateProductContent(
    product.name, formatMoney(product.salePrice, business.currency as "XOF"),
    business.name, business.activityType ?? "", tone
  );
  if (!content) return { error: "La génération a échoué. Réessayez dans un instant." };

  await logActivity(business.id, userId, "ai.content", { entity: "product", entityId: productId, meta: { tone } });
  return { content };
}
