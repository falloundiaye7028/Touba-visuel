import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSuperAdmin, setBusinessSubscriptionAction, updatePlanPriceAction, confirmSubscriptionPaymentAction, rejectSubscriptionPaymentAction } from "@/lib/sama/actions/admin";
import { ensurePlans } from "@/lib/sama/plans";
import { PLANS } from "@/lib/sama/constants";
import { formatMoney, formatNumber } from "@/lib/sama/money";
import { StatCard, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

const PILOT_TARGET = 50;

function rate(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export default async function SuperAdminPage() {
  await requireSuperAdmin();
  await ensurePlans();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    businesses,
    samaUsers,
    plans,
    totalBusinesses,
    onboardingDone,
    productBusinesses,
    saleBusinesses,
    aiBusinesses,
    activeBusinesses,
    trialCount,
    suspendedCount,
    newLast7Days,
    pendingPayments,
  ] = await Promise.all([
    prisma.samaBusiness.findMany({
      include: { _count: { select: { sales: true, products: true } }, owner: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.samaMember.findMany({ select: { userId: true }, distinct: ["userId"] }),
    prisma.samaPlan.findMany({ orderBy: { ordre: "asc" } }),
    prisma.samaBusiness.count(),
    prisma.samaBusiness.count({ where: { onboardingDone: true } }),
    prisma.samaProduct.findMany({ select: { businessId: true }, distinct: ["businessId"] }),
    prisma.samaSale.findMany({ where: { cancelled: false }, select: { businessId: true }, distinct: ["businessId"] }),
    prisma.samaActivityLog.findMany({ where: { action: "ai.used" }, select: { businessId: true }, distinct: ["businessId"] }),
    prisma.samaBusiness.findMany({ where: { subscriptionStatus: "ACTIVE" }, select: { id: true, planCode: true } }),
    prisma.samaBusiness.count({ where: { subscriptionStatus: "TRIAL" } }),
    prisma.samaBusiness.count({ where: { subscriptionStatus: "SUSPENDED" } }),
    prisma.samaBusiness.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.samaSubscriptionPayment.findMany({
      where: { status: "EN_ATTENTE" },
      include: { business: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "asc" },
      take: 50,
    }),
  ]);

  const priceMap = new Map(plans.map((p) => [p.code, p.priceMonthly]));
  const mrr = activeBusinesses.reduce((sum, b) => sum + (priceMap.get(b.planCode) ?? 0), 0);
  const pilotProgress = Math.min(100, rate(totalBusinesses, PILOT_TARGET));

  const funnel = [
    { label: "Entreprises inscrites", value: totalBusinesses, hint: `${newLast7Days} nouvelle(s) sur 7 jours` },
    { label: "Onboarding terminé", value: onboardingDone, hint: "Configuration initiale terminée" },
    { label: "Premier produit", value: productBusinesses.length, hint: "Au moins un produit créé" },
    { label: "Première vente", value: saleBusinesses.length, hint: "Au moins une vente réelle enregistrée" },
    { label: "SAMA AI utilisé", value: aiBusinesses.length, hint: "Au moins une question posée à l’assistant" },
    { label: "Abonnement actif", value: activeBusinesses.length, hint: "Entreprise convertie en payant" },
  ];

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
        <StatCard label="Entreprises" value={formatNumber(totalBusinesses)} />
        <StatCard label="Utilisateurs SAMA" value={formatNumber(samaUsers.length)} />
        <StatCard label="Abonnés actifs" value={formatNumber(activeBusinesses.length)} tone="green" />
        <StatCard label="En essai" value={formatNumber(trialCount)} tone="amber" />
        <StatCard label="MRR (revenu mensuel)" value={formatMoney(mrr)} tone="green" />
        <StatCard label="ARPU" value={formatMoney(activeBusinesses.length ? Math.round(mrr / activeBusinesses.length) : 0)} />
        <StatCard label="Conversion payante" value={`${rate(activeBusinesses.length, totalBusinesses)}%`} />
        <StatCard label="Suspendus" value={formatNumber(suspendedCount)} tone="red" />
      </div>

      {/* Pilotage des 50 premières entreprises */}
      <section className="card p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold">Pilote Touba — objectif {PILOT_TARGET} entreprises</h2>
            <p className="text-sm text-gray-500 mt-1">Suivez le passage de l’inscription à l’usage réel puis au paiement.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-vert-700">{Math.min(totalBusinesses, PILOT_TARGET)} / {PILOT_TARGET}</div>
            <div className="text-xs text-gray-500">{pilotProgress}% de l’objectif</div>
          </div>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-vert-600 rounded-full" style={{ width: `${pilotProgress}%` }} />
        </div>

        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {funnel.map((step) => {
            const conversion = rate(step.value, totalBusinesses);
            return (
              <div key={step.label} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-gray-800">{step.label}</div>
                  <div className="text-lg font-bold text-gray-900">{step.value}</div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-vert-500 rounded-full" style={{ width: `${conversion}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-500">
                  <span>{step.hint}</span>
                  <span className="font-semibold text-gray-700">{conversion}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <span className="text-gray-500">Activation vente</span>
            <div className="font-semibold">{rate(saleBusinesses.length, totalBusinesses)}%</div>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <span className="text-gray-500">Adoption SAMA AI</span>
            <div className="font-semibold">{rate(aiBusinesses.length, totalBusinesses)}%</div>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <span className="text-gray-500">Conversion payante</span>
            <div className="font-semibold">{rate(activeBusinesses.length, totalBusinesses)}%</div>
          </div>
        </div>
      </section>

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
        <h2 className="font-semibold mb-3">Entreprises ({totalBusinesses})</h2>
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
