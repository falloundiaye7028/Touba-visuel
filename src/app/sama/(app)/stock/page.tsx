import Link from "next/link";
import { AlertTriangle, Boxes } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, formatNumber, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, StatCard, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;

  const products = await prisma.samaProduct.findMany({
    where: { businessId: business.id, archived: false },
    include: { category: true },
    orderBy: { stock: "asc" },
    take: 300,
  });

  const stockValue = products.reduce((a, p) => a + p.costPrice * p.stock, 0);
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.alertThreshold);
  const out = products.filter((p) => p.stock <= 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Stock" subtitle={`${products.length} produit(s)`} />
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Valeur du stock" value={formatMoney(stockValue, cur)} />
        <StatCard label="Stock faible" value={formatNumber(low.length)} tone={low.length ? "amber" : "default"} />
        <StatCard label="En rupture" value={formatNumber(out.length)} tone={out.length ? "red" : "default"} />
      </div>

      {(low.length > 0 || out.length > 0) && (
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> À réapprovisionner</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {[...out, ...low].map((p) => (
              <li key={p.id} className="py-2 flex items-center justify-between">
                <Link href={`/sama/produits/${p.id}`} className="font-medium text-gray-800">{p.name}</Link>
                <Badge className={p.stock <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>
                  {p.stock <= 0 ? "Rupture" : `Reste ${p.stock}`}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Boxes className="w-4 h-4 text-gray-400" /> Tous les produits</h2>
        <ul className="divide-y divide-gray-100 text-sm">
          {products.map((p) => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <Link href={`/sama/produits/${p.id}`} className="min-w-0">
                <div className="font-medium text-gray-800 truncate">{p.name}</div>
                <div className="text-xs text-gray-400">{p.category?.name ?? "—"}</div>
              </Link>
              <span className={`font-semibold ${p.stock <= p.alertThreshold ? "text-red-600" : "text-gray-700"}`}>{formatNumber(p.stock)} {p.unit}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
