import { UserCog } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/sama/constants";
import { PageHeader, Badge } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function EmployesPage() {
  const { business } = await requireOnboardedTenant();
  const members = await prisma.samaMember.findMany({
    where: { businessId: business.id },
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "asc" },
  });

  const logs = await prisma.samaActivityLog.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Employés" subtitle={`${members.length} membre(s)`} />

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="card p-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-vert-100 text-vert-700 grid place-items-center font-bold">
              {(m.user.name || m.user.email).slice(0, 1).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{m.user.name || m.user.email}</div>
              <div className="text-xs text-gray-500">{m.user.phone || m.user.email}</div>
            </div>
            <Badge className={m.role === "OWNER" ? "bg-or-100 text-or-700" : "bg-gray-100 text-gray-600"}>{ROLE_LABELS[m.role]}</Badge>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-or-50/50 flex items-center gap-3">
        <UserCog className="w-5 h-5 text-or-600 shrink-0" />
        <p className="text-sm text-gray-600">L&apos;invitation d&apos;employés par SMS et la gestion fine des permissions arrivent en Version 2. Les rôles et permissions sont déjà appliqués côté serveur.</p>
      </div>

      <section className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Journal d&apos;activité</h2>
        {logs.length === 0 ? <p className="text-sm text-gray-400">Aucune activité récente.</p> : (
          <ul className="space-y-1.5 text-sm text-gray-600">
            {logs.map((l) => (
              <li key={l.id} className="flex justify-between gap-2">
                <span className="truncate">{l.action}{l.entity ? ` · ${l.entity}` : ""}</span>
                <span className="text-xs text-gray-400 shrink-0">{l.createdAt.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
