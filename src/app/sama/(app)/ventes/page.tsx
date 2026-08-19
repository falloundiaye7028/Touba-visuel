import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge, ExportButton } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

const PAY_BADGE: Record<string, { label: string; cls: string }> = {
  PAYE: { label: "Payé", cls: "bg-vert-100 text-vert-700" },
  PARTIEL: { label: "Partiel", cls: "bg-amber-100 text-amber-700" },
  CREDIT: { label: "Crédit", cls: "bg-red-100 text-red-700" },
};

export default async function VentesPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const sales = await prisma.samaSale.findMany({
    where: { businessId: business.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Ventes"
        subtitle={`${sales.length} vente(s)`}
        action={<div className="flex gap-2"><ExportButton type="ventes" /><Link href="/sama/ventes/nouvelle" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Vendre</Link></div>}
      />

      {sales.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-6 h-6" />}
          title="Aucune vente enregistrée"
          description="Enregistrez votre première vente : le stock, le chiffre d'affaires et la marge sont calculés automatiquement."
          actionLabel="Nouvelle vente"
          actionHref="/sama/ventes/nouvelle"
        />
      ) : (
        <div className="space-y-2">
          {sales.map((s) => {
            const b = PAY_BADGE[s.payStatus];
            return (
              <Link key={s.id} href={`/sama/ventes/${s.id}`} className={`card p-3 flex items-center justify-between hover:border-vert-200 ${s.cancelled ? "opacity-50" : ""}`}>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {s.number}
                    {s.cancelled && <Badge className="bg-gray-200 text-gray-600">Annulée</Badge>}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.customer?.name ?? "Client de passage"} · {s.createdAt.toLocaleDateString("fr-FR")} {s.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold">{formatMoney(s.total, cur)}</div>
                  {!s.cancelled && <Badge className={b.cls}>{b.label}</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
