import { formatMoney } from "@/lib/sama/money";
import type { BusinessSnapshot } from "@/lib/sama/ai";

export type DailyPriorityKind =
  | "stock"
  | "receivables"
  | "inactive_customers"
  | "sales_decline"
  | "pending_orders";

export interface DailyPriority {
  kind: DailyPriorityKind;
  title: string;
  detail: string;
  href: string;
  cta: string;
}

export function getDailyPriorities(s: BusinessSnapshot): DailyPriority[] {
  const priorities: DailyPriority[] = [];

  if (s.lowStockCount > 0) {
    priorities.push({
      kind: "stock",
      title: "Réapprovisionner le stock",
      detail: `${s.lowStockCount} produit(s) sont proches de la rupture.`,
      href: "/sama/stock",
      cta: "Voir le stock",
    });
  }

  if (s.receivables > 0) {
    priorities.push({
      kind: "receivables",
      title: "Récupérer vos créances",
      detail: `${formatMoney(s.receivables, s.currency)} restent à encaisser.`,
      href: "/sama/clients",
      cta: "Voir les clients",
    });
  }

  if (s.inactiveCustomers > 0) {
    priorities.push({
      kind: "inactive_customers",
      title: "Relancer les clients inactifs",
      detail: `${s.inactiveCustomers} client(s) n'ont rien acheté depuis plus de 60 jours.`,
      href: "/sama/marketing",
      cta: "Créer une relance",
    });
  }

  if (s.monthGrowth < 0) {
    priorities.push({
      kind: "sales_decline",
      title: "Relancer les ventes",
      detail: `Le chiffre d'affaires recule de ${Math.abs(s.monthGrowth)}% par rapport au mois dernier.`,
      href: "/sama/marketing",
      cta: "Créer une campagne",
    });
  }

  if (s.pendingOrders > 0) {
    priorities.push({
      kind: "pending_orders",
      title: "Traiter les commandes en attente",
      detail: `${s.pendingOrders} commande(s) attendent encore d'être traitées.`,
      href: "/sama/commandes",
      cta: "Voir les commandes",
    });
  }

  return priorities;
}

export function isDailyPrioritiesQuestion(question: string): boolean {
  const q = question.toLowerCase();
  return /(que.*faire|quoi.*faire|priorit|conseil|action.*aujourd|aujourd.*faire)/.test(q);
}

export function answerDailyPriorities(question: string, s: BusinessSnapshot): string | null {
  if (!isDailyPrioritiesQuestion(question)) return null;

  const priorities = getDailyPriorities(s);
  if (!priorities.length) {
    return "Aucune alerte prioritaire aujourd'hui. Continuez à enregistrer vos ventes et surveillez votre stock, vos créances et votre marge.";
  }

  return `Vos priorités aujourd'hui :\n${priorities
    .slice(0, 4)
    .map((priority, index) => `${index + 1}. ${priority.title} — ${priority.detail}`)
    .join("\n")}`;
}
