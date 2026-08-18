import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { updateCustomerAction } from "@/lib/sama/actions/customers";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Badge } from "@/components/sama/ui";
import CustomerForm from "@/components/sama/CustomerForm";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;

  const customer = await prisma.samaCustomer.findFirst({
    where: { id, businessId: business.id },
    include: { sales: { where: { cancelled: false }, orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!customer) notFound();

  const totalBought = customer.sales.reduce((a, s) => a + s.total, 0);
  const debt = customer.sales.reduce((a, s) => a + (s.total - s.amountPaid), 0);
  const waPhone = (customer.phone || "").replace(/\D/g, "");

  return (
    <div className="space-y-4">
      <PageHeader title={customer.name} subtitle={customer.city || customer.source || "Client"} />

      <div className="flex gap-2">
        {customer.phone && (
          <a href={`tel:${customer.phone}`} className="btn-outline !py-2 text-sm flex-1"><Phone className="w-4 h-4" /> Appeler</a>
        )}
        {waPhone && (
          <a href={`https://wa.me/${waPhone.startsWith("221") ? waPhone : "221" + waPhone}`} target="_blank" className="btn-primary !py-2 text-sm flex-1">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3"><div className="text-xs text-gray-500">Total acheté</div><div className="font-bold">{formatMoney(totalBought, cur)}</div></div>
        <div className="card p-3"><div className="text-xs text-gray-500">Commandes</div><div className="font-bold">{customer.sales.length}</div></div>
        <div className="card p-3"><div className="text-xs text-gray-500">Dette</div><div className={`font-bold ${debt > 0 ? "text-red-600" : ""}`}>{formatMoney(debt, cur)}</div></div>
      </div>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Historique des achats</h2>
        {customer.sales.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun achat pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {customer.sales.map((s) => (
              <li key={s.id} className="py-2 flex items-center justify-between">
                <Link href={`/sama/ventes/${s.id}`} className="text-vert-700 font-medium">{s.number}</Link>
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{formatMoney(s.total, cur)}</span>
                  <Badge className={s.payStatus === "PAYE" ? "bg-vert-100 text-vert-700" : "bg-amber-100 text-amber-700"}>
                    {s.payStatus === "PAYE" ? "Payé" : s.payStatus === "PARTIEL" ? "Partiel" : "Crédit"}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Modifier la fiche</h2>
        <CustomerForm
          action={updateCustomerAction}
          redirectTo={`/sama/clients/${customer.id}`}
          initial={{
            id: customer.id, name: customer.name, phone: customer.phone ?? "", email: customer.email ?? "",
            address: customer.address ?? "", city: customer.city ?? "", source: customer.source ?? "", notes: customer.notes ?? "",
          }}
        />
      </section>
    </div>
  );
}
