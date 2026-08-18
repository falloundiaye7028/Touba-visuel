import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { convertQuoteToSaleAction, deleteQuoteAction } from "@/lib/sama/actions/quotes";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Badge } from "@/components/sama/ui";
import { PrintButton } from "@/components/sama/PrintButton";
import { ConfirmButton } from "@/components/sama/ConfirmButton";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

interface QData { items: { name: string; quantity: number; unitPrice: number; total: number }[]; discount: number; deliveryFee: number; note?: string; convertedSaleId?: string }

export default async function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const quote = await prisma.samaInvoice.findFirst({ where: { id, businessId: business.id, type: "DEVIS" }, include: { customer: true } });
  if (!quote) notFound();
  const data = JSON.parse(quote.data) as QData;
  const subtotal = data.items.reduce((a, l) => a + l.total, 0);

  return (
    <div className="space-y-4">
      <PageHeader title={quote.number} subtitle="Devis"
        action={<Badge className={quote.status === "CONVERTIE" ? "bg-vert-100 text-vert-700" : "bg-blue-100 text-blue-700"}>{quote.status === "CONVERTIE" ? "Convertie en vente" : "En cours"}</Badge>} />

      <div className="card p-6 print-area bg-white">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="font-bold text-xl">{business.name}</div>
            {business.phone && <div className="text-sm text-gray-500">Tél : {business.phone}</div>}
            {business.address && <div className="text-sm text-gray-500">{business.address}</div>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: business.brandColor }}>DEVIS</div>
            <div className="text-sm text-gray-600 mt-1">N° {quote.number}</div>
            <div className="text-sm text-gray-500">{quote.createdAt.toLocaleDateString("fr-FR")}</div>
            {quote.dueDate && <div className="text-sm text-gray-500">Valable jusqu&apos;au {quote.dueDate.toLocaleDateString("fr-FR")}</div>}
          </div>
        </div>

        <div className="py-4">
          <div className="text-xs uppercase text-gray-400">Destinataire</div>
          <div className="font-semibold">{quote.customer?.name ?? "Client de passage"}</div>
          {quote.customer?.phone && <div className="text-sm text-gray-500">{quote.customer.phone}</div>}
        </div>

        <table className="w-full text-sm">
          <thead><tr className="text-left border-b-2 border-gray-200 text-gray-600"><th className="py-2">Désignation</th><th className="text-center">Qté</th><th className="text-right">P.U.</th><th className="text-right">Montant</th></tr></thead>
          <tbody>
            {data.items.map((it, i) => (
              <tr key={i} className="border-b border-gray-100"><td className="py-2">{it.name}</td><td className="text-center">{it.quantity}</td><td className="text-right">{formatMoney(it.unitPrice, cur)}</td><td className="text-right font-medium">{formatMoney(it.total, cur)}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-1 text-sm">
            {data.discount > 0 && <div className="flex justify-between text-red-600"><span>Remise</span><span>- {formatMoney(data.discount, cur)}</span></div>}
            {data.deliveryFee > 0 && <div className="flex justify-between"><span className="text-gray-500">Livraison</span><span>{formatMoney(data.deliveryFee, cur)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-1"><span>Total</span><span>{formatMoney(Math.max(0, subtotal - data.discount + data.deliveryFee), cur)}</span></div>
          </div>
        </div>
        {data.note && <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">{data.note}</p>}
      </div>

      <div className="flex flex-wrap gap-2 no-print">
        <PrintButton label="Télécharger / Imprimer" />
        {quote.status === "CONVERTIE" && data.convertedSaleId && (
          <Link href={`/sama/ventes/${data.convertedSaleId}`} className="btn-outline !py-2 text-sm">Voir la vente</Link>
        )}
      </div>

      {quote.status !== "CONVERTIE" && (
        <div className="flex flex-col sm:flex-row gap-2 no-print">
          <form action={convertQuoteToSaleAction} className="flex-1">
            <input type="hidden" name="id" value={quote.id} />
            <SubmitButton className="btn-primary w-full" pendingLabel="Conversion…"><ArrowRight className="w-4 h-4" /> Convertir en vente</SubmitButton>
          </form>
          <form action={deleteQuoteAction}>
            <input type="hidden" name="id" value={quote.id} />
            <ConfirmButton className="btn-outline !border-red-300 !text-red-600" message="Supprimer ce devis ?">Supprimer</ConfirmButton>
          </form>
        </div>
      )}
    </div>
  );
}
