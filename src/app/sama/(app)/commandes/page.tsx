import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge } from "@/components/sama/ui";
import { ORDER_STATUS } from "@/lib/sama/constants";

export const dynamic = "force-dynamic";

export default async function CommandesPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const orders = await prisma.samaOrder.findMany({
    where: { businessId: business.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Commandes" subtitle={`${orders.length} commande(s)`}
        action={<Link href="/sama/commandes/nouvelle" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Nouvelle</Link>} />

      {orders.length === 0 ? (
        <EmptyState icon={<ClipboardList className="w-6 h-6" />} title="Aucune commande" description="Les commandes créées manuellement et celles reçues depuis votre boutique en ligne apparaîtront ici." actionLabel="Créer une commande" actionHref="/sama/commandes/nouvelle" />
      ) : (
        <div className="space-y-2">
          {orders.map((o) => {
            const st = ORDER_STATUS.find((s) => s.value === o.status);
            return (
              <Link key={o.id} href={`/sama/commandes/${o.id}`} className="card p-3 flex items-center justify-between hover:border-vert-200">
                <div>
                  <div className="font-medium text-gray-900">{o.number}</div>
                  <div className="text-xs text-gray-500">{o.customer?.name ?? o.guestName ?? "Client"} · {o.createdAt.toLocaleDateString("fr-FR")}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatMoney(o.total, cur)}</div>
                  <Badge className={st?.color}>{st?.label}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
