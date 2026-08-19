import Link from "next/link";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, formatNumber, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge, ExportButton } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function ProduitsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { q } = await searchParams;

  const products = await prisma.samaProduct.findMany({
    where: {
      businessId: business.id,
      archived: false,
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const stockValue = products.reduce((acc, p) => acc + p.costPrice * p.stock, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Produits"
        subtitle={`${products.length} produit(s) · valeur du stock ${formatMoney(stockValue, cur)}`}
        action={<div className="flex gap-2"><ExportButton type="produits" /><Link href="/sama/produits/nouveau" className="btn-primary !py-2 text-sm"><Plus className="w-4 h-4" /> Ajouter</Link></div>}
      />

      <form className="relative">
        <input name="q" defaultValue={q} placeholder="Rechercher un produit, une référence…" className="input-field !py-2.5" />
      </form>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-6 h-6" />}
          title="Aucun produit pour le moment"
          description="Ajoutez votre premier produit pour commencer à suivre votre stock et vos ventes."
          actionLabel="Ajouter un produit"
          actionHref="/sama/produits/nouveau"
        />
      ) : (
        <div className="space-y-2">
          {products.map((p) => {
            const low = p.stock <= p.alertThreshold;
            return (
              <Link key={p.id} href={`/sama/produits/${p.id}`} className="card p-3 flex items-center gap-3 hover:border-vert-200">
                <div className="w-11 h-11 rounded-xl bg-gray-100 grid place-items-center text-gray-400 shrink-0">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {p.category?.name ?? "Sans catégorie"} · {p.sku || "—"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-gray-900">{formatMoney(p.salePrice, cur)}</div>
                  <div className="text-xs">
                    {low ? (
                      <Badge className="bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3 mr-0.5" />{formatNumber(p.stock)}</Badge>
                    ) : (
                      <span className="text-gray-500">Stock : {formatNumber(p.stock)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
