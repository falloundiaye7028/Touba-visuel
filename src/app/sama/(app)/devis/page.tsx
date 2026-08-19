import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { EMISE: "bg-blue-100 text-blue-700", CONVERTIE: "bg-vert-100 text-vert-700", ANNULEE: "bg-gray-100 text-gray-500" };

export default async function DevisPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const quotes = await prisma.samaInvoice.findMany({
    where: { businessId: business.id, type: "DEVIS" },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" }, take: 100,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Devis" subtitle={`${quotes.length} devis`}
        action={<Link href="/sama/devis/nouveau" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Nouveau</Link>} />

      {quotes.length === 0 ? (
        <EmptyState icon={<FileText className="w-6 h-6" />} title="Aucun devis" description="Créez un devis professionnel et convertissez-le en vente en un clic une fois accepté." actionLabel="Créer un devis" actionHref="/sama/devis/nouveau" />
      ) : (
        <div className="space-y-2">
          {quotes.map((q) => (
            <Link key={q.id} href={`/sama/devis/${q.id}`} className="card p-3 flex items-center justify-between hover:border-vert-200">
              <div>
                <div className="font-medium text-gray-900">{q.number}</div>
                <div className="text-xs text-gray-500">{q.customer?.name ?? "Client de passage"} · {q.createdAt.toLocaleDateString("fr-FR")}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatMoney(q.total, cur)}</div>
                <Badge className={STATUS[q.status] ?? "bg-gray-100 text-gray-600"}>{q.status === "CONVERTIE" ? "Convertie" : q.status === "EMISE" ? "En cours" : q.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
