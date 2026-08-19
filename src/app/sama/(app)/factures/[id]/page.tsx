import { notFound } from "next/navigation";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader } from "@/components/sama/ui";
import { PrintButton } from "@/components/sama/PrintButton";

export const dynamic = "force-dynamic";
const TYPE_LABEL: Record<string, string> = { FACTURE: "FACTURE", DEVIS: "DEVIS", RECU: "REÇU", BON_COMMANDE: "BON DE COMMANDE" };

export default async function FactureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const invoice = await prisma.samaInvoice.findFirst({
    where: { id, businessId: business.id },
    include: { customer: true, sale: { include: { items: true } } },
  });
  if (!invoice) notFound();

  const items = invoice.sale?.items ?? [];
  const remaining = invoice.total - invoice.amountPaid;

  return (
    <div className="space-y-4">
      <PageHeader title={invoice.number} subtitle={TYPE_LABEL[invoice.type]} action={<PrintButton label="Télécharger / Imprimer" />} />

      <div className="card p-6 print-area bg-white">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            {business.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logoUrl} alt={business.name} className="h-12 mb-2" />
            )}
            <div className="font-bold text-xl text-gray-900">{business.name}</div>
            {business.address && <div className="text-sm text-gray-500">{business.address}</div>}
            {business.phone && <div className="text-sm text-gray-500">Tél : {business.phone}</div>}
            {business.email && <div className="text-sm text-gray-500">{business.email}</div>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: business.brandColor }}>{TYPE_LABEL[invoice.type]}</div>
            <div className="text-sm text-gray-600 mt-1">N° {invoice.number}</div>
            <div className="text-sm text-gray-500">{invoice.createdAt.toLocaleDateString("fr-FR")}</div>
            {invoice.dueDate && <div className="text-sm text-gray-500">Échéance : {invoice.dueDate.toLocaleDateString("fr-FR")}</div>}
          </div>
        </div>

        <div className="py-4">
          <div className="text-xs uppercase text-gray-400">Facturé à</div>
          <div className="font-semibold text-gray-900">{invoice.customer?.name ?? "Client de passage"}</div>
          {invoice.customer?.phone && <div className="text-sm text-gray-500">{invoice.customer.phone}</div>}
          {invoice.customer?.address && <div className="text-sm text-gray-500">{invoice.customer.address}</div>}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b-2 border-gray-200 text-gray-600">
              <th className="py-2">Désignation</th><th className="text-center">Qté</th><th className="text-right">P.U.</th><th className="text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-100">
                <td className="py-2">{it.name}</td>
                <td className="text-center">{it.quantity}</td>
                <td className="text-right">{formatMoney(it.unitPrice, cur)}</td>
                <td className="text-right font-medium">{formatMoney(it.total, cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-1 text-sm">
            {invoice.sale && invoice.sale.discount > 0 && <div className="flex justify-between text-red-600"><span>Remise</span><span>- {formatMoney(invoice.sale.discount, cur)}</span></div>}
            {invoice.sale && invoice.sale.deliveryFee > 0 && <div className="flex justify-between"><span className="text-gray-500">Livraison</span><span>{formatMoney(invoice.sale.deliveryFee, cur)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-1"><span>Total</span><span>{formatMoney(invoice.total, cur)}</span></div>
            <div className="flex justify-between text-vert-700"><span>Payé</span><span>{formatMoney(invoice.amountPaid, cur)}</span></div>
            {remaining > 0 && <div className="flex justify-between text-red-600 font-semibold"><span>Reste dû</span><span>{formatMoney(remaining, cur)}</span></div>}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 border-t border-gray-100 pt-3">
          {business.invoiceFooter || "Merci de votre confiance."}
        </p>
      </div>
    </div>
  );
}
