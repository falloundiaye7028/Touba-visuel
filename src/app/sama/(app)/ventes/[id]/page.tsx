import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, FileText } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { addPaymentAction, cancelSaleAction } from "@/lib/sama/actions/sales";
import { generateInvoiceAction } from "@/lib/sama/actions/invoices";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Badge, Field } from "@/components/sama/ui";
import { PrintButton } from "@/components/sama/PrintButton";
import { ConfirmButton } from "@/components/sama/ConfirmButton";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { PAY_METHODS } from "@/lib/sama/constants";

export const dynamic = "force-dynamic";

export default async function VenteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const sale = await prisma.samaSale.findFirst({
    where: { id, businessId: business.id },
    include: { items: true, customer: true, payments: { orderBy: { createdAt: "asc" } }, invoice: true },
  });
  if (!sale) notFound();

  const remaining = sale.total - sale.amountPaid;
  const waPhone = (sale.customer?.phone || "").replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Reçu ${sale.number} - ${business.name}\n` +
    sale.items.map((i) => `${i.quantity} × ${i.name} : ${formatMoney(i.total, cur)}`).join("\n") +
    `\nTotal : ${formatMoney(sale.total, cur)}\nMerci de votre confiance !`
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Vente ${sale.number}`}
        subtitle={sale.createdAt.toLocaleString("fr-FR")}
        action={sale.cancelled ? <Badge className="bg-gray-200 text-gray-600">Annulée</Badge> : undefined}
      />

      {/* Reçu imprimable */}
      <div id="receipt" className="card p-5 print-area">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-bold text-lg">{business.name}</div>
            {business.phone && <div className="text-xs text-gray-500">{business.phone}</div>}
            {business.address && <div className="text-xs text-gray-500">{business.address}</div>}
          </div>
          <div className="text-right text-xs text-gray-500">
            <div className="font-semibold text-gray-900">REÇU</div>
            <div>{sale.number}</div>
            <div>{sale.createdAt.toLocaleDateString("fr-FR")}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">Client : {sale.customer?.name ?? "Client de passage"}</div>

        <table className="w-full mt-3 text-sm">
          <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100"><th className="py-1">Article</th><th className="text-center">Qté</th><th className="text-right">P.U.</th><th className="text-right">Total</th></tr></thead>
          <tbody>
            {sale.items.map((it) => (
              <tr key={it.id} className="border-b border-gray-50">
                <td className="py-1.5">{it.name}</td>
                <td className="text-center">{it.quantity}</td>
                <td className="text-right">{formatMoney(it.unitPrice, cur)}</td>
                <td className="text-right font-medium">{formatMoney(it.total, cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Sous-total</span><span>{formatMoney(sale.subtotal, cur)}</span></div>
          {sale.discount > 0 && <div className="flex justify-between text-red-600"><span>Remise</span><span>- {formatMoney(sale.discount, cur)}</span></div>}
          {sale.deliveryFee > 0 && <div className="flex justify-between"><span className="text-gray-500">Livraison</span><span>+ {formatMoney(sale.deliveryFee, cur)}</span></div>}
          <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100"><span>Total</span><span>{formatMoney(sale.total, cur)}</span></div>
          <div className="flex justify-between text-vert-700"><span>Payé</span><span>{formatMoney(sale.amountPaid, cur)}</span></div>
          {remaining > 0 && <div className="flex justify-between text-red-600 font-semibold"><span>Reste dû</span><span>{formatMoney(remaining, cur)}</span></div>}
        </div>
        {business.invoiceFooter && <p className="mt-3 text-xs text-gray-400">{business.invoiceFooter}</p>}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 no-print">
        <PrintButton label="Imprimer le reçu" />
        {waPhone && (
          <a href={`https://wa.me/${waPhone.startsWith("221") ? waPhone : "221" + waPhone}?text=${waText}`} target="_blank" className="btn-primary !py-2 text-sm">
            <MessageCircle className="w-4 h-4" /> Envoyer par WhatsApp
          </a>
        )}
        {sale.invoice && sale.invoice.type !== "FACTURE" && !sale.cancelled && (
          <form action={generateInvoiceAction}>
            <input type="hidden" name="saleId" value={sale.id} />
            <SubmitButton className="btn-outline !py-2 text-sm" pendingLabel="…"><FileText className="w-4 h-4" /> Générer une facture</SubmitButton>
          </form>
        )}
        <Link href={`/sama/factures`} className="btn-outline !py-2 text-sm"><FileText className="w-4 h-4" /> Factures</Link>
      </div>

      {/* Encaissement */}
      {!sale.cancelled && remaining > 0 && (
        <section className="card p-4 no-print">
          <h2 className="font-semibold text-gray-900 mb-3">Encaisser un paiement</h2>
          <form action={addPaymentAction} className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-end">
            <input type="hidden" name="saleId" value={sale.id} />
            <Field label="Montant"><input name="amount" type="number" min="1" max={remaining} className="input-field !py-2" placeholder={String(remaining)} required /></Field>
            <Field label="Moyen">
              <select name="method" className="input-field !py-2">{PAY_METHODS.filter((m) => m.value !== "CREDIT").map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
            </Field>
            <SubmitButton className="btn-primary !py-2.5" pendingLabel="…">Encaisser</SubmitButton>
          </form>
        </section>
      )}

      {sale.payments.length > 0 && (
        <section className="card p-4 no-print">
          <h2 className="font-semibold text-gray-900 mb-2 text-sm">Paiements reçus</h2>
          <ul className="text-sm divide-y divide-gray-100">
            {sale.payments.map((p) => (
              <li key={p.id} className="py-1.5 flex justify-between">
                <span className="text-gray-600">{PAY_METHODS.find((m) => m.value === p.method)?.label ?? p.method} · {p.createdAt.toLocaleDateString("fr-FR")}</span>
                <span className="font-medium">{formatMoney(p.amount, cur)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!sale.cancelled && (
        <form action={cancelSaleAction} className="no-print">
          <input type="hidden" name="id" value={sale.id} />
          <ConfirmButton className="btn-outline !border-red-300 !text-red-600 w-full" message="Annuler cette vente ? Le stock des produits sera restauré.">
            Annuler la vente
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
