import Link from "next/link";
import { Plus, Users, Phone } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { q } = await searchParams;

  const customers = await prisma.samaCustomer.findMany({
    where: {
      businessId: business.id,
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {}),
    },
    include: { sales: { where: { cancelled: false }, select: { total: true, amountPaid: true } } },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const enriched = customers.map((c) => {
    const totalBought = c.sales.reduce((a, s) => a + s.total, 0);
    const debt = c.sales.reduce((a, s) => a + (s.total - s.amountPaid), 0);
    return { ...c, totalBought, debt, orders: c.sales.length };
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clients"
        subtitle={`${customers.length} client(s)`}
        action={<Link href="/sama/clients/nouveau" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Ajouter</Link>}
      />
      <form><input name="q" defaultValue={q} placeholder="Rechercher par nom ou téléphone…" className="input-field !py-2.5" /></form>

      {enriched.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="Aucun client pour le moment"
          description="Ajoutez vos clients pour suivre leurs achats, leurs commandes et leurs créances."
          actionLabel="Ajouter un client"
          actionHref="/sama/clients/nouveau"
        />
      ) : (
        <div className="space-y-2">
          {enriched.map((c) => (
            <Link key={c.id} href={`/sama/clients/${c.id}`} className="card p-3 flex items-center gap-3 hover:border-vert-200">
              <span className="w-11 h-11 rounded-full bg-vert-100 text-vert-700 grid place-items-center font-bold shrink-0">
                {c.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">{c.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {c.phone && <><Phone className="w-3 h-3" />{c.phone}</>}
                  {c.city && <span>· {c.city}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-gray-900">{formatMoney(c.totalBought, cur)}</div>
                {c.debt > 0 && <Badge className="bg-red-100 text-red-700">Doit {formatMoney(c.debt, cur)}</Badge>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
