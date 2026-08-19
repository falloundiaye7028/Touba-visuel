import Link from "next/link";
import { Plus, ShoppingCart, UserPlus, Package, TrendingUp, TrendingDown } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { getDashboardData, getTopProducts } from "@/lib/sama/queries";
import { isActive } from "@/lib/sama/limits";
import { formatMoney, formatNumber, growthPercent, type CurrencyCode } from "@/lib/sama/money";
import { StatCard, Money } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

function firstName(name?: string | null) {
  return (name || "").trim().split(" ")[0] || "à vous";
}

export default async function DashboardPage() {
  const { business, userId } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const [data, top, owner] = await Promise.all([
    getDashboardData(business.id),
    getTopProducts(business.id),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);

  const maxRev = Math.max(...data.chart7.map((d) => d.revenue), 1);
  const monthGrowth = growthPercent(data.month.revenue, data.prevMonth.revenue);
  const trialDays = business.trialEndsAt
    ? Math.ceil((business.trialEndsAt.getTime() - Date.now()) / 86400000)
    : 0;

  const quick = [
    { href: "/sama/ventes/nouvelle", label: "Nouvelle vente", icon: ShoppingCart, cls: "btn-primary" },
    { href: "/sama/commandes/nouvelle", label: "Commande", icon: Plus, cls: "btn-outline" },
    { href: "/sama/clients/nouveau", label: "Client", icon: UserPlus, cls: "btn-outline" },
    { href: "/sama/produits/nouveau", label: "Produit", icon: Package, cls: "btn-outline" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bonjour {firstName(owner?.name)} 👋</h1>
        <p className="text-sm text-gray-500">Voici l&apos;activité de {business.name} aujourd&apos;hui.</p>
      </div>

      {business.subscriptionStatus === "TRIAL" && isActive(business) && (
        <Link href="/sama/abonnement" className="block bg-or-50 border border-or-200 rounded-2xl px-4 py-3 text-sm">
          <span className="font-semibold text-or-800">Essai Business</span>{" "}
          <span className="text-gray-600">
            — il vous reste {trialDays} jour{trialDays > 1 ? "s" : ""}. Choisir un abonnement →
          </span>
        </Link>
      )}
      {!isActive(business) && (
        <Link href="/sama/abonnement" className="block bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm">
          <span className="font-semibold text-red-700">Votre essai a expiré.</span>{" "}
          <span className="text-gray-600">Passez sur le plan Gratuit ou choisissez un abonnement →</span>
        </Link>
      )}

      {/* Aujourd'hui */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Aujourd&apos;hui</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Chiffre d'affaires" value={formatMoney(data.today.revenue, cur)} tone="green" />
          <StatCard label="Ventes" value={formatNumber(data.today.salesCount)} />
          <StatCard label="Bénéfice estimé" value={formatMoney(data.today.margin, cur)} tone="blue" />
          <StatCard label="Dépenses" value={formatMoney(data.today.expenses, cur)} tone="amber" />
          <StatCard label="Encaissé" value={formatMoney(data.paidToday, cur)} />
          <StatCard label="Reste à encaisser" value={formatMoney(data.receivables, cur)} tone={data.receivables > 0 ? "red" : "default"} />
        </div>
      </section>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className={`${q.cls} !py-3 text-sm justify-center`}>
            <q.icon className="w-4 h-4" /> {q.label}
          </Link>
        ))}
      </div>

      {/* Graphe 7 jours */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Ventes des 7 derniers jours</h2>
          <span className="text-xs text-gray-400">CA total : {formatMoney(data.chart7.reduce((a, d) => a + d.revenue, 0), cur)}</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {data.chart7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-vert-500/80 rounded-t-md min-h-[4px] transition-all"
                style={{ height: `${(d.revenue / maxRev) * 100}%` }}
                title={formatMoney(d.revenue, cur)}
              />
              <span className="text-[10px] text-gray-400 capitalize">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ce mois */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Ce mois-ci</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <span className="text-xs font-medium text-gray-500 uppercase">CA du mois</span>
            <div className="mt-1 text-2xl font-bold"><Money amount={data.month.revenue} currency={cur} /></div>
            <div className={`text-xs mt-0.5 inline-flex items-center gap-1 ${monthGrowth >= 0 ? "text-vert-600" : "text-red-600"}`}>
              {monthGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {monthGrowth >= 0 ? "+" : ""}{monthGrowth}% vs mois dernier
            </div>
          </div>
          <StatCard label="Bénéfice estimé" value={formatMoney(data.month.margin, cur)} tone="blue" />
          <StatCard label="Panier moyen" value={formatMoney(data.avgBasket, cur)} />
          <StatCard label="Nouveaux clients" value={formatNumber(data.newCustomersMonth)} />
        </div>
      </section>

      {/* Top produits + alertes */}
      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Produits les plus vendus</h2>
          {top.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune vente enregistrée pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-2">
              {top.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-vert-100 text-vert-700 grid place-items-center text-xs font-bold">{i + 1}</span>
                    <span className="truncate">{p.name}</span>
                  </span>
                  <span className="text-gray-500 shrink-0">{formatNumber(p.quantity)} vendus · {formatMoney(p.revenue, cur)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Alertes</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Produits en stock faible</span>
              <Link href="/sama/stock" className={`font-semibold ${data.lowStock > 0 ? "text-red-600" : "text-gray-400"}`}>
                {data.lowStock}
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Commandes en attente</span>
              <Link href="/sama/commandes" className={`font-semibold ${data.pendingOrders > 0 ? "text-amber-600" : "text-gray-400"}`}>
                {data.pendingOrders}
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Créances clients</span>
              <Link href="/sama/ventes" className={`font-semibold ${data.receivables > 0 ? "text-red-600" : "text-gray-400"}`}>
                {formatMoney(data.receivables, cur)}
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <p className="text-[11px] text-gray-400 text-center pt-2">
        Les résultats affichés sont des indicateurs de gestion et ne remplacent pas une comptabilité certifiée.
      </p>
    </div>
  );
}
