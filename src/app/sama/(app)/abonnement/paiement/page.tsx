import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Smartphone, Info } from "lucide-react";
import { requireOnboardedTenant, memberCan } from "@/lib/sama/tenant";
import { planByCode } from "@/lib/sama/constants";
import { getPaymentInstructions } from "@/lib/sama/payments";
import { initiateSubscriptionPaymentAction } from "@/lib/sama/actions/subscription";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Field } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

export default async function PaiementAbonnementPage({ searchParams }: { searchParams: Promise<{ plan?: string; months?: string }> }) {
  const { business, member } = await requireOnboardedTenant();
  if (!memberCan(member, "subscription.manage")) redirect("/sama/abonnement");
  const cur = business.currency as CurrencyCode;
  const sp = await searchParams;

  const plan = planByCode(sp.plan || "");
  if (plan.priceMonthly <= 0) redirect("/sama/abonnement");
  const months = Math.max(1, parseInt(sp.months || "1", 10) || 1);
  const amount = plan.priceMonthly * months;
  const instructions = getPaymentInstructions();

  return (
    <div className="space-y-4">
      <Link href="/sama/abonnement" className="inline-flex items-center gap-1 text-sm text-gray-500"><ArrowLeft className="w-4 h-4" /> Retour</Link>
      <PageHeader title={`Payer le plan ${plan.name}`} subtitle={`${formatMoney(amount, cur)} pour ${months} mois`} />

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4 text-vert-600" /> Comment payer</h2>
        <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
          <li>Envoyez <strong>{formatMoney(amount, cur)}</strong> via Wave ou Orange Money au numéro ci-dessous.</li>
          <li>Notez la <strong>référence</strong> de votre transaction (reçue par SMS).</li>
          <li>Saisissez-la dans le formulaire — nous activons votre plan après vérification.</li>
        </ol>
        <div className="mt-3 space-y-2">
          {instructions.map((i) => (
            <div key={i.method} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-sm">
              <span className="font-medium text-gray-700">{i.label}</span>
              <span className="font-mono text-gray-900">{i.number}{i.link ? " · " + i.link : ""}</span>
            </div>
          ))}
        </div>
      </div>

      <form action={initiateSubscriptionPaymentAction} className="card p-4 space-y-3">
        <input type="hidden" name="plan" value={plan.code} />
        <input type="hidden" name="months" value={months} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Moyen utilisé">
            <select name="method" className="input-field">
              {instructions.map((i) => <option key={i.method} value={i.method}>{i.label}</option>)}
            </select>
          </Field>
          <Field label="Durée">
            <div className="input-field bg-gray-50 flex items-center">{months} mois</div>
          </Field>
        </div>
        <Field label="Référence de la transaction" required hint="Ex : identifiant Wave / OM du transfert">
          <input name="reference" className="input-field" required placeholder="TXN123456789" />
        </Field>
        <SubmitButton className="btn-primary w-full" pendingLabel="Enregistrement…">
          J&apos;ai payé {formatMoney(amount, cur)} — enregistrer
        </SubmitButton>
      </form>

      <div className="flex items-start gap-2 text-xs text-gray-400">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>SAMA BUSINESS ne débite jamais votre compte automatiquement. Le paiement est effectué par vous via Wave/OM, puis vérifié par notre équipe avant activation. Une intégration API automatique est prévue.</p>
      </div>
    </div>
  );
}
