import Link from "next/link";
import { FileText } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = { FACTURE: "Facture", DEVIS: "Devis", RECU: "Reçu", BON_COMMANDE: "Bon de commande" };
const STATUS_BADGE: Record<string, string> = {
  PAYEE: "bg-vert-100 text-vert-700", PARTIELLE: "bg-amber-100 text-amber-700",
  EMISE: "bg-blue-100 text-blue-700", ANNULEE: "bg-gray-100 text-gray-500",
};

export default async function FacturesPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const invoices = await prisma.samaInvoice.findMany({
    where: { businessId: business.id, type: { in: ["FACTURE", "DEVIS"] } },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Factures & Devis" subtitle={`${invoices.length} document(s)`} />
      {invoices.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="Aucune facture pour le moment"
          description="Générez une facture depuis n'importe quelle vente. Les reçus sont créés automatiquement à chaque encaissement."
          actionLabel="Voir les ventes"
          actionHref="/sama/ventes"
        />
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/sama/factures/${inv.id}`} className="card p-3 flex items-center justify-between hover:border-vert-200">
              <div>
                <div className="font-medium text-gray-900">{inv.number}</div>
                <div className="text-xs text-gray-500">{TYPE_LABEL[inv.type]} · {inv.customer?.name ?? "Client de passage"} · {inv.createdAt.toLocaleDateString("fr-FR")}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatMoney(inv.total, cur)}</div>
                <Badge className={STATUS_BADGE[inv.status] ?? "bg-gray-100 text-gray-600"}>{inv.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
