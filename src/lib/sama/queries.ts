import { prisma } from "@/lib/db";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // lundi = 0
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d = new Date()) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export interface PeriodStats {
  revenue: number;
  cost: number;
  margin: number;
  salesCount: number;
  expenses: number;
}

async function periodStats(businessId: string, gte: Date, lt?: Date): Promise<PeriodStats> {
  const dateFilter = lt ? { gte, lt } : { gte };
  const [sales, expenses] = await Promise.all([
    prisma.samaSale.aggregate({
      where: { businessId, cancelled: false, createdAt: dateFilter },
      _sum: { total: true, cost: true, margin: true },
      _count: true,
    }),
    prisma.samaExpense.aggregate({
      where: { businessId, date: dateFilter },
      _sum: { amount: true },
    }),
  ]);
  return {
    revenue: sales._sum.total ?? 0,
    cost: sales._sum.cost ?? 0,
    margin: sales._sum.margin ?? 0,
    salesCount: sales._count,
    expenses: expenses._sum.amount ?? 0,
  };
}

export async function getDashboardData(businessId: string) {
  const today = startOfDay();
  const week = startOfWeek();
  const month = startOfMonth();
  const lastMonthStart = startOfMonth(addDays(month, -1));

  const [todayStats, weekStats, monthStats, prevMonthStats] = await Promise.all([
    periodStats(businessId, today),
    periodStats(businessId, week),
    periodStats(businessId, month),
    periodStats(businessId, lastMonthStart, month),
  ]);

  const [paidToday, pendingOrders, receivables, newCustomersMonth, lowStock] = await Promise.all([
    prisma.samaPayment.aggregate({ where: { businessId, createdAt: { gte: today } }, _sum: { amount: true } }),
    prisma.samaOrder.count({ where: { businessId, status: { in: ["NOUVELLE", "CONFIRMEE", "EN_PREPARATION", "PRETE"] } } }),
    prisma.samaSale.findMany({
      where: { businessId, cancelled: false, payStatus: { in: ["PARTIEL", "CREDIT"] } },
      select: { total: true, amountPaid: true },
    }),
    prisma.samaCustomer.count({ where: { businessId, createdAt: { gte: month } } }),
    prisma.samaProduct.count({ where: { businessId, archived: false, stock: { lte: 5 } } }),
  ]);

  const remaining = receivables.reduce((acc, s) => acc + (s.total - s.amountPaid), 0);

  // Ventes des 7 derniers jours (graphe)
  const days: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const start = addDays(today, -i);
    const end = addDays(start, 1);
    const agg = await prisma.samaSale.aggregate({
      where: { businessId, cancelled: false, createdAt: { gte: start, lt: end } },
      _sum: { total: true },
    });
    days.push({
      label: start.toLocaleDateString("fr-FR", { weekday: "short" }),
      revenue: agg._sum.total ?? 0,
    });
  }

  return {
    today: todayStats,
    week: weekStats,
    month: monthStats,
    prevMonth: prevMonthStats,
    paidToday: paidToday._sum.amount ?? 0,
    pendingOrders,
    receivables: remaining,
    newCustomersMonth,
    lowStock,
    chart7: days,
    avgBasket: monthStats.salesCount > 0 ? Math.round(monthStats.revenue / monthStats.salesCount) : 0,
  };
}

export async function getTopProducts(businessId: string, limit = 5) {
  const grouped = await prisma.samaSaleItem.groupBy({
    by: ["productId", "name"],
    where: { sale: { businessId, cancelled: false } },
    _sum: { quantity: true, total: true },
    orderBy: { _sum: { total: "desc" } },
    take: limit,
  });
  return grouped.map((g) => ({
    name: g.name,
    quantity: g._sum.quantity ?? 0,
    revenue: g._sum.total ?? 0,
  }));
}
