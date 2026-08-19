import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, setBusinessSubscriptionAction, updatePlanPriceAction, confirmSubscriptionPaymentAction, rejectSubscriptionPaymentAction } from "@/lib/sama/actions/admin";
import { ensurePlans } from "@/lib/sama/plans";
import { PLANS } from "@/lib/sama/constants";
import { formatMoney, formatNumber } from "@/lib/sama/money";
import { StatCard, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  await requireSuperAdmin();
  await ensurePlans();

  const [businesses, userCount, plans] = await Promise.all([
    prisma.samaBusiness.findMany({
      include: { _count: { select: { sales: true, products: true } }, owner: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.count(),
    prisma.samaPlan.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  const pendingPayments = await prisma.samaSubscriptionPayment.findMany({
    where: { status: "EN_ATTENTE" },
    include: { business: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  const active = businesses.filter((b) => b.subscriptionStatus === "ACTIVE");
  const trial = businesses.filter((b) => b.subscriptionStatus === "TRIAL");
  const priceMap = new Map(plans.map((p) => [p.code, p.priceMonthly]));
  const mrr = active.reduce((a, b) => a + (priceMap.get(b.planCode) ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">SAMA BUSINESS — Administration</h1>
          <p className="text-sm text-gray-500">Tableau de bord général de la plateforme</p>
        </div>
        <Link href="/sama/dashboard" className="btn-outline !py-2 text-sm">Mon espace</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Entreprises" value={formatNumber(businesses.length)} />
        <StatCard label="Utilisateurs" value={formatNumber(userCount)} />
        <StatCard label="Abonnés actifs" value={formatNumber(active.length)} tone="green" />
        <StatCard label="En essai" value={formatNumber(trial.length)} tone="amber" />
        <StatCard label="MRR (revenu mensuel)" value={formatMoney(mrr)} tone="green" />
        <StatCard label="ARPU" value={formatMoney(active.length ? Math.round(mrr / active.length) : 0)} />
        <StatCard label="Conversion" value={`${businesses.length ? Math.round((active.length / businesses.length) * 100) : 0}%`} />
        <StatCard label="Suspendus" value={formatNumber(businesses.filter((b) => b.subscriptionStatus === "SUSPENDED").length)} tone="red" />
      </div>

      {/* Paiements d'abonnement en attente */}
      <section className="card p-4">
        <h2 className="font-semibold mb-3">Paiements d&apos;abonnement à confirmer ({pendingPayments.length})</h2>
        {pendingPayments.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun paiement en attente.</p>
        ) : (
          <div className="space-y-2">
            {pendingPayments.map((p) => (
              <div key={p.id} className="border border-gray-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <div className="font-medium">{p.business.name} — {p.planCode}</div>
                  <div className="text-xs text-gray-500">{formatMoney(p.amount)} · {p.months} mois · {p.method}{p.reference ? ` · réf. ${p.reference}` : ""} · {p.createdAt.toLocaleDateString("fr-FR")}</div>
                </div>
                <div className="flex gap-2">
                  <form action={confirmSubscriptionPaymentAction}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <button className="btn-primary !py-1 !px-3 text-xs">Confirmer & activer</button>
                  </form>
                  <form action={rejectSubscriptionPaymentAction}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <button className="btn-outline !py-1 !px-3 text-xs !border-red-300 !text-red-600">Rejeter</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tarifs des plans */}
      <section className="card p-4">
        <h2 className="font-semibold mb-3">Tarifs des plans (configurables)</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((p) => (
            <form key={p.code} action={updatePlanPriceAction} className="border border-gray-100 rounded-xl p-3">
              <div className="font-medium">{p.name}</div>
              <input type="hidden" name="code" value={p.code} />
              <div className="flex gap-1 mt-2">
                <input name="price" type="number" defaultValue={p.priceMonthly} className="input-field !py-1.5 text-sm" />
                <button className="btn-primary !py-1.5 !px-3 text-sm">OK</button>
              </div>
              <div className="text-xs text-gray-400 mt-1">FCFA / mois</div>
            </form>
          ))}
        </div>
      </section>

      {/* Entreprises */}
      <section className="card p-4">
        <h2 className="font-semibold mb-3">Entreprises ({businesses.length})</h2>
        <div className="space-y-3">
          {businesses.map((b) => (
            <div key={b.id} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.name}</div>
                  <div className="text-xs text-gray-500 truncate">{b.owner.name} · {b.owner.phone || b.owner.email}</div>
                  <div className="text-xs text-gray-400">{b._count.products} produits · {b._count.sales} ventes · créée {b.createdAt.toLocaleDateString("fr-FR")}</div>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={b.subscriptionStatus === "ACTIVE" ? "bg-vert-100 text-vert-700" : b.subscriptionStatus === "TRIAL" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                    {b.planCode} · {b.subscriptionStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <form action={setBusinessSubscriptionAction} className="flex items-center gap-1">
                  <input type="hidden" name="businessId" value={b.id} />
                  <input type="hidden" name="action" value="activate" />
                  <select name="plan" defaultValue={b.planCode} className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
                    {PLANS.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  <input name="months" type="number" defaultValue={1} min={1} className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs" />
                  <button className="btn-primary !py-1 !px-2 text-xs">Activer</button>
                </form>
                <form action={setBusinessSubscriptionAction}>
                  <input type="hidden" name="businessId" value={b.id} />
                  <input type="hidden" name="action" value="extend" />
                  <button className="btn-outline !py-1 !px-2 text-xs">+30 j</button>
                </form>
                <form action={setBusinessSubscriptionAction}>
                  <input type="hidden" name="businessId" value={b.id} />
                  <input type="hidden" name="action" value="suspend" />
                  <button className="btn-outline !py-1 !px-2 text-xs !border-red-300 !text-red-600">Suspendre</button>
                </form>
                {b.storePublished && <Link href={`/sama/boutique/${b.slug}`} target="_blank" className="btn-outline !py-1 !px-2 text-xs">Boutique</Link>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
