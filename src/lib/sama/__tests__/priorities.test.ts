import { describe, expect, it } from "vitest";
import type { BusinessSnapshot } from "@/lib/sama/ai";
import {
  answerDailyPriorities,
  getDailyPriorities,
  isDailyPrioritiesQuestion,
} from "@/lib/sama/priorities";

function snapshot(overrides: Partial<BusinessSnapshot> = {}): BusinessSnapshot {
  return {
    currency: "XOF",
    todayRevenue: 0,
    todaySales: 0,
    todayMargin: 0,
    monthRevenue: 0,
    monthMargin: 0,
    monthExpenses: 0,
    monthGrowth: 0,
    avgBasket: 0,
    receivables: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    topByRevenue: [],
    topByMargin: [],
    lowStock: [],
    inactiveCustomers: 0,
    topSeller: null,
    bestDay: null,
    ...overrides,
  };
}

describe("SAMA AI daily priorities", () => {
  it("returns no priority when all indicators are healthy", () => {
    expect(getDailyPriorities(snapshot())).toEqual([]);
  });

  it("orders the most actionable business alerts consistently", () => {
    const priorities = getDailyPriorities(snapshot({
      lowStockCount: 3,
      receivables: 125000,
      inactiveCustomers: 8,
      monthGrowth: -12,
      pendingOrders: 4,
    }));

    expect(priorities.map((p) => p.kind)).toEqual([
      "stock",
      "receivables",
      "inactive_customers",
      "sales_decline",
      "pending_orders",
    ]);
  });

  it("recognizes natural questions asking what to do", () => {
    expect(isDailyPrioritiesQuestion("Que dois-je faire aujourd'hui ?")).toBe(true);
    expect(isDailyPrioritiesQuestion("Quelles sont mes priorités ?")).toBe(true);
    expect(isDailyPrioritiesQuestion("Combien ai-je vendu aujourd'hui ?")).toBe(false);
  });

  it("answers with deterministic priorities from the snapshot", () => {
    const answer = answerDailyPriorities(
      "Que dois-je faire aujourd'hui ?",
      snapshot({ lowStockCount: 2, receivables: 50000 }),
    );

    expect(answer).toContain("Vos priorités aujourd'hui");
    expect(answer).toContain("Réapprovisionner le stock");
    expect(answer).toContain("Récupérer vos créances");
  });

  it("gives a healthy-state answer when there is no alert", () => {
    const answer = answerDailyPriorities("Que dois-je faire aujourd'hui ?", snapshot());
    expect(answer).toContain("Aucune alerte prioritaire");
  });
});
