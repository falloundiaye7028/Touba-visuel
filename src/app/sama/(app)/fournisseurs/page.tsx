import Link from "next/link";
import { Plus, Truck } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, StatCard, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function FournisseursPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const suppliers = await prisma.samaSupplier.findMany({
    where: { businessId: business.id },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  const totalDue = suppliers.reduce((a, s) => a + s.balanceDue, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Fournisseurs" subtitle={`${suppliers.length} fournisseur(s)`}
        action={<Link href="/sama/fournisseurs/nouveau" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Ajouter</Link>} />

      {suppliers.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Fournisseurs" value={String(suppliers.length)} />
          <StatCard label="Dette totale" value={formatMoney(totalDue, cur)} tone={totalDue > 0 ? "red" : "default"} />
        </div>
      )}

      {suppliers.length === 0 ? (
        <EmptyState icon={<Truck className="w-6 h-6" />} title="Aucun fournisseur" description="Enregistrez vos fournisseurs pour suivre vos achats et vos dettes." actionLabel="Ajouter un fournisseur" actionHref="/sama/fournisseurs/nouveau" />
      ) : (
        <div className="space-y-2">
          {suppliers.map((s) => (
            <Link key={s.id} href={`/sama/fournisseurs/${s.id}`} className="card p-3 flex items-center justify-between hover:border-vert-200">
              <div>
                <div className="font-medium text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-500">{s.phone || s.contact || "—"} · {s._count.products} produit(s)</div>
              </div>
              {s.balanceDue > 0 ? <Badge className="bg-red-100 text-red-700">Dette {formatMoney(s.balanceDue, cur)}</Badge> : <Badge className="bg-vert-100 text-vert-700">À jour</Badge>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
