import Link from "next/link";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { getTopProducts } from "@/lib/sama/queries";
import { formatMoney, formatNumber, marginPercent, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, StatCard } from "@/components/sama/ui";
import { CHANNELS } from "@/lib/sama/constants";

export const dynamic = "force-dynamic";

const RANGES = [
  { key: "7j", label: "7 jours", days: 7 },
  { key: "30j", label: "30 jours", days: 30 },
  { key: "90j", label: "Trimestre", days: 90 },
  { key: "365j", label: "Année", days: 365 },
];

export default async function RapportsPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { p } = await searchParams;
  const range = RANGES.find((r) => r.key === p) ?? RANGES[1];
  const gte = new Date(Date.now() - range.days * 86400000);

  const [sales, expenses, top, channels] = await Promise.all([
    prisma.samaSale.aggregate({ where: { businessId: business.id, cancelled: false, createdAt: { gte } }, _sum: { total: true, cost: true, margin: true }, _count: true }),
    prisma.samaExpense.groupBy({ by: ["category"], where: { businessId: business.id, date: { gte } }, _sum: { amount: true } }),
    getTopProducts(business.id, 8),
    prisma.samaSale.groupBy({ by: ["channel"], where: { businessId: business.id, cancelled: false, createdAt: { gte } }, _sum: { total: true }, _count: true }),
  ]);

  const revenue = sales._sum.total ?? 0;
  const cost = sales._sum.cost ?? 0;
  const grossMargin = sales._sum.margin ?? 0;
  const totalExpenses = expenses.reduce((a, e) => a + (e._sum.amount ?? 0), 0);
  const netResult = grossMargin - totalExpenses;
  const maxChannel = Math.max(...channels.map((c) => c._sum.total ?? 0), 1);

  return (
    <div className="space-y-4">
      <PageHeader title="Rapports" subtitle={`Période : ${range.label}`} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {RANGES.map((r) => (
          <Link key={r.key} href={`/sama/rapports?p=${r.key}`} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${r.key === range.key ? "bg-vert-700 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {r.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Chiffre d'affaires" value={formatMoney(revenue, cur)} tone="green" hint={`${formatNumber(sales._count)} ventes`} />
        <StatCard label="Coût des marchandises" value={formatMoney(cost, cur)} />
        <StatCard label="Marge brute" value={formatMoney(grossMargin, cur)} tone="blue" hint={`${marginPercent(revenue, cost)}%`} />
        <StatCard label="Dépenses" value={formatMoney(totalExpenses, cur)} tone="amber" />
      </div>

      <div className={`card p-4 ${netResult >= 0 ? "bg-vert-50" : "bg-red-50"}`}>
        <div className="text-xs font-medium text-gray-500 uppercase">Résultat estimatif</div>
        <div className={`text-3xl font-bold ${netResult >= 0 ? "text-vert-700" : "text-red-600"}`}>{formatMoney(netResult, cur)}</div>
        <div className="text-xs text-gray-500 mt-1">Marge brute − dépenses. Indicateur de gestion, non comptable.</div>
      </div>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Ventes par canal</h2>
        {channels.length === 0 ? <p className="text-sm text-gray-400">Aucune donnée.</p> : (
          <div className="space-y-2">
            {channels.sort((a, b) => (b._sum.total ?? 0) - (a._sum.total ?? 0)).map((c) => {
              const label = CHANNELS.find((x) => x.value === c.channel)?.label ?? c.channel;
              const val = c._sum.total ?? 0;
              return (
                <div key={c.channel}>
                  <div className="flex justify-between text-sm mb-0.5"><span>{label}</span><span className="font-medium">{formatMoney(val, cur)}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-vert-500 rounded-full" style={{ width: `${(val / maxChannel) * 100}%` }} /></div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Top produits</h2>
          {top.length === 0 ? <p className="text-sm text-gray-400">Aucune vente.</p> : (
            <ul className="space-y-1.5 text-sm">
              {top.map((t, i) => (
                <li key={i} className="flex justify-between"><span className="truncate">{i + 1}. {t.name}</span><span className="text-gray-500 shrink-0">{formatMoney(t.revenue, cur)}</span></li>
              ))}
            </ul>
          )}
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Dépenses par catégorie</h2>
          {expenses.length === 0 ? <p className="text-sm text-gray-400">Aucune dépense.</p> : (
            <ul className="space-y-1.5 text-sm">
              {expenses.sort((a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0)).map((e) => (
                <li key={e.category} className="flex justify-between"><span>{e.category}</span><span className="text-gray-500">{formatMoney(e._sum.amount ?? 0, cur)}</span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
