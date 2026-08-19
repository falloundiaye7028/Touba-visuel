import Link from "next/link";
import { Bot, Sparkles, TrendingUp, Lightbulb } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { canUseAI, buildSnapshot, weeklyReport } from "@/lib/sama/ai";
import { PageHeader } from "@/components/sama/ui";
import SamaAiChat from "@/components/sama/SamaAiChat";

export const dynamic = "force-dynamic";

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

  return (
    <div className="space-y-4">
      <PageHeader title="SAMA AI" subtitle="Assistant business — réponses basées sur vos données réelles" />

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
