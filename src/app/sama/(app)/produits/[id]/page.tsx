import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { updateProductAction, archiveProductAction, adjustStockAction } from "@/lib/sama/actions/products";
import { formatMoney, formatNumber, marginPercent, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Field, Badge } from "@/components/sama/ui";
import { ConfirmButton } from "@/components/sama/ConfirmButton";
import ProductForm from "@/components/sama/ProductForm";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

const MOVE_LABELS: Record<string, string> = {
  ENTREE: "Entrée", SORTIE: "Sortie", AJUSTEMENT: "Ajustement",
  RETOUR_CLIENT: "Retour client", RETOUR_FOURNISSEUR: "Retour fournisseur",
  ENDOMMAGE: "Endommagé", VENTE: "Vente", ANNULATION_VENTE: "Annulation vente",
};

export default async function ProduitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const [product, cats, movements] = await Promise.all([
    prisma.samaProduct.findFirst({ where: { id, businessId: business.id }, include: { category: true } }),
    prisma.samaCategory.findMany({ where: { businessId: business.id }, orderBy: { name: "asc" } }),
    prisma.samaInventoryMovement.findMany({ where: { businessId: business.id, productId: id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);
  if (!product) notFound();

  const margin = product.salePrice - product.costPrice;

  return (
    <div className="space-y-4">
      <PageHeader title={product.name} subtitle={product.sku || "Sans référence"} />

      <Link href={`/sama/produits/${product.id}/contenu`} className="btn-gold w-full !py-2.5 text-sm">
        <Sparkles className="w-4 h-4" /> Créer du contenu avec l&apos;IA
      </Link>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3"><div className="text-xs text-gray-500">Stock</div><div className="text-lg font-bold">{formatNumber(product.stock)}</div></div>
        <div className="card p-3"><div className="text-xs text-gray-500">Marge unitaire</div><div className="text-lg font-bold">{formatMoney(margin, cur)}</div><div className="text-[11px] text-gray-400">{marginPercent(product.salePrice, product.costPrice)}%</div></div>
        <div className="card p-3"><div className="text-xs text-gray-500">Valeur stock</div><div className="text-lg font-bold">{formatMoney(product.costPrice * product.stock, cur)}</div></div>
      </div>

      {/* Ajustement de stock */}
      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Mouvement de stock</h2>
        <form action={adjustStockAction} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
          <input type="hidden" name="productId" value={product.id} />
          <Field label="Type">
            <select name="type" className="input-field !py-2">
              <option value="ENTREE">Entrée</option>
              <option value="SORTIE">Sortie</option>
              <option value="AJUSTEMENT">Ajustement</option>
              <option value="RETOUR_CLIENT">Retour client</option>
              <option value="RETOUR_FOURNISSEUR">Retour fournisseur</option>
              <option value="ENDOMMAGE">Endommagé</option>
            </select>
          </Field>
          <Field label="Quantité">
            <input name="quantity" type="number" min="1" className="input-field !py-2" required />
          </Field>
          <Field label="Motif">
            <input name="reason" className="input-field !py-2" placeholder="Réapprovisionnement…" />
          </Field>
          <SubmitButton className="btn-primary !py-2.5" pendingLabel="…">Valider</SubmitButton>
        </form>
      </section>

      {/* Édition */}
      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Modifier le produit</h2>
        <ProductForm
          action={updateProductAction}
          categories={cats.map((c) => c.name)}
          redirectTo="/sama/produits"
          initial={{
            id: product.id, name: product.name, sku: product.sku ?? "", categoryName: product.category?.name ?? "",
            description: product.description ?? "", costPrice: product.costPrice, salePrice: product.salePrice,
            wholesalePrice: product.wholesalePrice, stock: product.stock, alertThreshold: product.alertThreshold, unit: product.unit,
          }}
        />
      </section>

      {/* Historique */}
      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Historique des mouvements</h2>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun mouvement enregistré.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {movements.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Badge className={m.quantity >= 0 ? "bg-vert-100 text-vert-700" : "bg-red-100 text-red-700"}>
                    {m.quantity >= 0 ? "+" : ""}{formatNumber(m.quantity)}
                  </Badge>
                  <span className="text-gray-600">{MOVE_LABELS[m.type] ?? m.type}{m.reason ? ` · ${m.reason}` : ""}</span>
                </span>
                <span className="text-xs text-gray-400">
                  {m.createdAt.toLocaleDateString("fr-FR")} · stock {formatNumber(m.stockAfter)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form action={archiveProductAction}>
        <input type="hidden" name="id" value={product.id} />
        <ConfirmButton className="btn-outline !border-red-300 !text-red-600 w-full" message="Archiver ce produit ? Il n'apparaîtra plus dans le catalogue.">
          Archiver le produit
        </ConfirmButton>
      </form>
    </div>
  );
}
