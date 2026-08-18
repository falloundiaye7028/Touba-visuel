import Link from "next/link";
import { Plus, Megaphone, Tag, Users } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { memberCan } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { togglePromoAction } from "@/lib/sama/actions/campaigns";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { SEGMENTS } from "@/lib/sama/constants";
import { PageHeader, Badge, EmptyState } from "@/components/sama/ui";
import PromoForm from "@/components/sama/PromoForm";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const { business, member } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;

  if (!memberCan(member, "marketing.manage")) {
    return (
      <div className="space-y-4">
        <PageHeader title="Marketing" subtitle="Campagnes, segments et codes promo" />
        <EmptyState icon={<Megaphone className="w-6 h-6" />} title="Accès restreint" description="Le module Marketing est disponible pour les propriétaires et les rôles autorisés. Demandez l'accès au propriétaire." />
      </div>
    );
  }

  const [campaigns, promos] = await Promise.all([
    prisma.samaCampaign.findMany({ where: { businessId: business.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.samaPromoCode.findMany({ where: { businessId: business.id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="Marketing" subtitle="Campagnes ciblées et codes promo"
        action={<Link href="/sama/marketing/nouvelle" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Campagne</Link>} />

      {/* Campagnes */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><Megaphone className="w-4 h-4" /> Campagnes</h2>
        {campaigns.length === 0 ? (
          <EmptyState icon={<Megaphone className="w-6 h-6" />} title="Aucune campagne" description="Créez une campagne ciblée (WhatsApp) vers un segment de clients." actionLabel="Nouvelle campagne" actionHref="/sama/marketing/nouvelle" />
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <Link key={c.id} href={`/sama/marketing/${c.id}`} className="card p-3 flex items-center justify-between hover:border-vert-200">
                <div>
                  <div className="font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {c.recipientCount} destinataires · {SEGMENTS.find((s) => s.value === c.segment)?.label ?? c.segment}</div>
                </div>
                <Badge className={c.status === "ENVOYEE" ? "bg-vert-100 text-vert-700" : "bg-amber-100 text-amber-700"}>{c.status === "ENVOYEE" ? "Envoyée" : "Brouillon"}</Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Codes promo */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><Tag className="w-4 h-4" /> Codes promo</h2>
        <div className="card p-4 mb-2"><PromoForm /></div>
        {promos.length > 0 && (
          <div className="space-y-2">
            {promos.map((p) => (
              <div key={p.id} className="card p-3 flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-gray-900">{p.code}</div>
                  <div className="text-xs text-gray-500">
                    {p.type === "POURCENTAGE" ? `${p.value}%` : formatMoney(p.value, cur)} · utilisé {p.usageCount}×{p.maxUsage ? ` / ${p.maxUsage}` : ""}
                  </div>
                </div>
                <form action={togglePromoAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className={`text-xs px-3 py-1.5 rounded-lg ${p.active ? "bg-vert-100 text-vert-700" : "bg-gray-100 text-gray-500"}`}>{p.active ? "Actif" : "Inactif"}</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-[11px] text-gray-400">Les messages sont envoyés manuellement via WhatsApp (un lien pré-rempli par client), dans le respect des règles des plateformes et du consentement des clients.</p>
    </div>
  );
}
