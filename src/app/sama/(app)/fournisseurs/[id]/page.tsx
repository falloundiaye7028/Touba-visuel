import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { updateSupplierAction, addSupplierEntryAction } from "@/lib/sama/actions/suppliers";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Field, Badge } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";
import SupplierForm from "@/components/sama/SupplierForm";

export const dynamic = "force-dynamic";

const ENTRY_LABEL: Record<string, string> = { ACHAT: "Achat", PAIEMENT: "Paiement", RETOUR: "Retour" };

export default async function FournisseurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const supplier = await prisma.samaSupplier.findFirst({
    where: { id, businessId: business.id },
    include: { products: { where: { archived: false }, take: 20 }, entries: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!supplier) notFound();

  return (
    <div className="space-y-4">
      <PageHeader title={supplier.name} subtitle={supplier.contact || supplier.phone || "Fournisseur"} />

      <div className="card p-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">Dette actuelle</span>
        <span className={`text-xl font-bold ${supplier.balanceDue > 0 ? "text-red-600" : "text-vert-700"}`}>{formatMoney(supplier.balanceDue, cur)}</span>
      </div>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Nouvelle écriture</h2>
        <form action={addSupplierEntryAction} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
          <input type="hidden" name="supplierId" value={supplier.id} />
          <Field label="Type"><select name="type" className="input-field !py-2"><option value="ACHAT">Achat (dette +)</option><option value="PAIEMENT">Paiement (dette −)</option><option value="RETOUR">Retour (dette −)</option></select></Field>
          <Field label="Montant"><input name="amount" type="number" min="1" className="input-field !py-2" required /></Field>
          <Field label="Description"><input name="description" className="input-field !py-2" /></Field>
          <SubmitButton className="btn-primary !py-2.5" pendingLabel="…">Ajouter</SubmitButton>
        </form>
      </section>

      {supplier.products.length > 0 && (
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /> Produits fournis</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {supplier.products.map((p) => (
              <li key={p.id} className="py-2 flex justify-between"><Link href={`/sama/produits/${p.id}`} className="text-gray-700">{p.name}</Link><span className="text-gray-400">stock {p.stock}</span></li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">Grand livre</h2>
        {supplier.entries.length === 0 ? <p className="text-sm text-gray-400">Aucune écriture.</p> : (
          <ul className="divide-y divide-gray-100 text-sm">
            {supplier.entries.map((e) => (
              <li key={e.id} className="py-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Badge className={e.type === "ACHAT" ? "bg-red-100 text-red-700" : "bg-vert-100 text-vert-700"}>{ENTRY_LABEL[e.type]}</Badge>
                  <span className="text-gray-600">{e.description || "—"}</span>
                </span>
                <span className="text-xs text-gray-400">{formatMoney(e.amount, cur)} · solde {formatMoney(e.balanceAfter, cur)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Modifier la fiche</h2>
        <SupplierForm action={updateSupplierAction} redirectTo={`/sama/fournisseurs/${supplier.id}`} initial={{ id: supplier.id, name: supplier.name, contact: supplier.contact ?? "", phone: supplier.phone ?? "", email: supplier.email ?? "", address: supplier.address ?? "", notes: supplier.notes ?? "" }} />
      </section>
    </div>
  );
}
