import Link from "next/link";
import {
  ArrowRight, Bot, Lightbulb, Megaphone, Package, ShoppingCart,
  Sparkles, TrendingUp, Users,
} from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { canUseAI, buildSnapshot, weeklyReport } from "@/lib/sama/ai";
import { getDailyPriorities, type DailyPriorityKind } from "@/lib/sama/priorities";
import { PageHeader } from "@/components/sama/ui";
import SamaAiChat from "@/components/sama/SamaAiChat";

export const dynamic = "force-dynamic";

const PRIORITY_ICONS = {
  stock: Package,
  receivables: Users,
  inactive_customers: Megaphone,
  sales_decline: TrendingUp,
  pending_orders: ShoppingCart,
} satisfies Record<DailyPriorityKind, typeof Package>;

export default async function AiPage() {
  const { business } = await requireOnboardedTenant();

  if (!canUseAI(business)) {
    return (
      <div className="space-y-4">
        <PageHeader title="SAMA AI" subtitle="Votre assistant business intelligent" />
        <div className="card p-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-vert-100 text-vert-700 grid place-items-center mb-4"><Bot className="w-6 h-6" /></div>
          <h3 className="font-semibold text-gray-900">Débloquez SAMA AI</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">Analysez vos données, générez du contenu marketing et recevez des recommandations. Inclus dans le plan Pro IA.</p>
          <Link href="/sama/abonnement" className="btn-primary mt-4">Voir le plan Pro IA</Link>
        </div>
      </div>
    );
  }

  const snapshot = await buildSnapshot(business);
  const report = weeklyReport(snapshot);
  const priorities = getDailyPriorities(snapshot);

  return (
    <div className="space-y-4">
      <PageHeader title="SAMA AI" subtitle="Assistant business — réponses basées sur vos données réelles" />

      <section className="card p-4">
        <div className="mb-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Ce que vous devez faire aujourd&apos;hui</h2>
          <p className="text-xs text-gray-500 mt-1">SAMA priorise les actions à partir de vos chiffres réels.</p>
        </div>

        {priorities.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {priorities.slice(0, 4).map((priority) => {
              const Icon = PRIORITY_ICONS[priority.kind];
              return (
                <Link key={priority.kind} href={priority.href} className="rounded-xl border border-gray-100 p-3 hover:border-vert-200 hover:bg-vert-50/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-lg bg-vert-50 text-vert-700 grid place-items-center shrink-0"><Icon className="w-4 h-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-gray-900">{priority.title}</div>
                      <p className="text-xs text-gray-500 mt-0.5">{priority.detail}</p>
                      <span className="text-xs font-medium text-vert-700 mt-2 inline-flex items-center gap-1">{priority.cta}<ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-vert-50 border border-vert-100 p-3 text-sm text-vert-800">
            Aucune alerte prioritaire aujourd&apos;hui. Continuez à enregistrer vos ventes et à suivre votre activité.
          </div>
        )}
      </section>

      {/* Synthèse */}
      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-vert-600" /> Votre activité en résumé</h2>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {report.lines.map((l, i) => <li key={i} className="flex gap-2"><Sparkles className="w-4 h-4 text-or-500 shrink-0 mt-0.5" />{l}</li>)}
        </ul>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Recommandations</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {report.recommendations.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>
      </section>

      <SamaAiChat />

      <p className="text-[11px] text-gray-400 text-center">SAMA AI s&apos;appuie sur vos données réelles et n&apos;invente jamais de chiffres. Les recommandations sont des indicateurs de gestion.</p>
    </div>
  );
}
