import Link from "next/link";
import { Check } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { PLANS, planByCode } from "@/lib/sama/constants";
import { isActive } from "@/lib/sama/limits";
import { requestPlanAction } from "@/lib/sama/actions/subscription";
import { formatMoney } from "@/lib/sama/money";
import { PageHeader, Badge } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AbonnementPage({ searchParams }: { searchParams: Promise<{ paiement?: string }> }) {
  const { business } = await requireOnboardedTenant();
  const current = planByCode(business.planCode);
  const active = isActive(business);
  const trialDays = business.trialEndsAt ? Math.ceil((business.trialEndsAt.getTime() - Date.now()) / 86400000) : 0;
  const { paiement } = await searchParams;
  const pending = await prisma.samaSubscriptionPayment.findFirst({
    where: { businessId: business.id, status: "EN_ATTENTE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Abonnement" subtitle="Choisissez le plan adapté à votre activité" />

      {paiement === "enregistre" && (
        <div className="bg-vert-50 border border-vert-200 rounded-2xl px-4 py-3 text-sm text-vert-800">
          Paiement enregistré ✓ Votre plan sera activé après vérification par notre équipe.
        </div>
      )}
      {pending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-800">
          Paiement en attente de confirmation : plan {planByCode(pending.planCode).name} · {formatMoney(pending.amount, business.currency as "XOF")}
          {pending.reference ? ` · réf. ${pending.reference}` : ""}.
        </div>
      )}

      <div className="card p-4 bg-vert-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase">Plan actuel</div>
            <div className="text-lg font-bold">{current.name}</div>
          </div>
          <Badge className={active ? "bg-vert-100 text-vert-700" : "bg-red-100 text-red-700"}>
            {business.subscriptionStatus === "TRIAL" ? (active ? `Essai · ${trialDays}j restants` : "Essai expiré") : business.subscriptionStatus}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {PLANS.map((p) => {
          const isCurrent = p.code === business.planCode && active;
          return (
            <div key={p.code} className={`card p-4 ${p.highlight ? "ring-2 ring-vert-500" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">{p.name} {p.highlight && <Badge className="bg-or-100 text-or-700">Populaire</Badge>}</div>
                  <div className="text-2xl font-extrabold mt-1">{p.priceMonthly === 0 ? "Gratuit" : formatMoney(p.priceMonthly)}<span className="text-sm font-normal text-gray-400">{p.priceMonthly > 0 && "/mois"}</span></div>
                </div>
                {isCurrent && <Badge className="bg-vert-100 text-vert-700">Actuel</Badge>}
              </div>
              <ul className="mt-3 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-vert-600 shrink-0" /> {f}</li>
                ))}
              </ul>
              {!isCurrent && (
                p.code === "GRATUIT" ? (
                  <form action={requestPlanAction} className="mt-3">
                    <input type="hidden" name="plan" value={p.code} />
                    <SubmitButton className="btn-outline w-full" pendingLabel="…">Passer au plan Gratuit</SubmitButton>
                  </form>
                ) : (
                  <Link href={`/sama/abonnement/paiement?plan=${p.code}`} className="btn-primary w-full mt-3">
                    Choisir {p.name} — {formatMoney(p.priceMonthly)}/mois
                  </Link>
                )
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Paiement par Wave, Orange Money ou virement. L&apos;activation des plans payants est confirmée par notre équipe. Aucune carte bancaire requise pour l&apos;essai.
      </p>
    </div>
  );
}
