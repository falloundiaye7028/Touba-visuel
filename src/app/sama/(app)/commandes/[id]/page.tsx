import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { updateOrderStatusAction } from "@/lib/sama/actions/orders";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, Badge } from "@/components/sama/ui";
import { ORDER_STATUS } from "@/lib/sama/constants";

export const dynamic = "force-dynamic";

export default async function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { id } = await params;
  const order = await prisma.samaOrder.findFirst({ where: { id, businessId: business.id }, include: { items: true, customer: true } });
  if (!order) notFound();

  const st = ORDER_STATUS.find((s) => s.value === order.status);
  const name = order.customer?.name ?? order.guestName ?? "Client";
  const phone = order.customer?.phone ?? order.guestPhone ?? "";
  const wa = phone.replace(/\D/g, "");

  return (
    <div className="space-y-4">
      <PageHeader title={`Commande ${order.number}`} subtitle={order.createdAt.toLocaleString("fr-FR")} action={<Badge className={st?.color}>{st?.label}</Badge>} />

      <section className="card p-4">
        <div className="text-sm"><span className="text-gray-500">Client :</span> <strong>{name}</strong></div>
        {phone && <div className="text-sm text-gray-500">{phone}</div>}
        {(order.guestAddress || order.guestCity) && <div className="text-sm text-gray-500">{order.guestAddress} {order.guestCity}</div>}
        {order.comment && <div className="text-sm text-gray-500 mt-1">« {order.comment} »</div>}
      </section>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">Articles</h2>
        <ul className="divide-y divide-gray-100 text-sm">
          {order.items.map((it) => (
            <li key={it.id} className="py-2 flex justify-between"><span>{it.quantity} × {it.name}</span><span className="font-medium">{formatMoney(it.total, cur)}</span></li>
          ))}
        </ul>
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100"><span>Total</span><span>{formatMoney(order.total, cur)}</span></div>
      </section>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Mettre à jour le statut</h2>
        <form action={updateOrderStatusAction} className="flex gap-2">
          <input type="hidden" name="id" value={order.id} />
          <select name="status" defaultValue={order.status} className="input-field !py-2 flex-1">
            {ORDER_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button type="submit" className="btn-primary !py-2">Valider</button>
        </form>
      </section>

      {wa && (
        <a href={`https://wa.me/${wa.startsWith("221") ? wa : "221" + wa}`} target="_blank" className="btn-primary w-full !py-2 text-sm"><MessageCircle className="w-4 h-4" /> Contacter le client</a>
      )}
    </div>
  );
}
