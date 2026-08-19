import { Bell, Package, ShoppingBag, FileText, CreditCard } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { markNotificationsReadAction } from "@/lib/sama/actions/subscription";
import { PageHeader, EmptyState } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

const ICONS: Record<string, typeof Bell> = { STOCK: Package, ORDER: ShoppingBag, INVOICE: FileText, SUBSCRIPTION: CreditCard };

export default async function NotificationsPage() {
  const { business } = await requireOnboardedTenant();
  const notifs = await prisma.samaNotification.findMany({ where: { businessId: business.id }, orderBy: { createdAt: "desc" }, take: 50 });
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} non lue(s)` : "Tout est à jour"}
        action={unread > 0 ? (
          <form action={markNotificationsReadAction}><SubmitButton className="btn-outline !py-2 text-sm" pendingLabel="…">Tout marquer lu</SubmitButton></form>
        ) : undefined}
      />
      {notifs.length === 0 ? (
        <EmptyState icon={<Bell className="w-6 h-6" />} title="Aucune notification" description="Vous serez alerté ici du stock faible, des nouvelles commandes et des échéances." />
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <div key={n.id} className={`card p-3 flex gap-3 ${!n.read ? "border-vert-200 bg-vert-50/40" : ""}`}>
                <span className="w-9 h-9 rounded-xl bg-vert-50 text-vert-600 grid place-items-center shrink-0"><Icon className="w-4 h-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-900">{n.title}</div>
                  {n.body && <div className="text-sm text-gray-500">{n.body}</div>}
                  <div className="text-xs text-gray-400 mt-0.5">{n.createdAt.toLocaleString("fr-FR")}</div>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-vert-500 mt-1.5" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
