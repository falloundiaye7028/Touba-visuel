import { UserPlus } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { ROLE_LABELS, hasPermission, expandRolePermissions } from "@/lib/sama/constants";
import { updateMemberRoleAction, toggleMemberAction } from "@/lib/sama/actions/employees";
import { PageHeader, Badge } from "@/components/sama/ui";
import InviteEmployeeForm from "@/components/sama/InviteEmployeeForm";
import MemberPermissions from "@/components/sama/MemberPermissions";

export const dynamic = "force-dynamic";

const ROLES = ["MANAGER", "SELLER", "CASHIER", "STOCK", "COMMERCIAL"] as const;

export default async function EmployesPage() {
  const { business, role } = await requireOnboardedTenant();
  const canManage = hasPermission(role, "employees.manage");

  const [members, logs] = await Promise.all([
    prisma.samaMember.findMany({ where: { businessId: business.id }, include: { user: { select: { name: true, email: true, phone: true } } }, orderBy: { createdAt: "asc" } }),
    prisma.samaActivityLog.findMany({ where: { businessId: business.id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader title="Employés" subtitle={`${members.length} membre(s)`} />

      {canManage && (
        <section className="card p-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4 text-vert-600" /> Inviter un employé</h2>
          <InviteEmployeeForm />
        </section>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className={`card p-3 ${!m.active ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-vert-100 text-vert-700 grid place-items-center font-bold">{(m.user.name || m.user.email).slice(0, 1).toUpperCase()}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{m.user.name || m.user.email}</div>
                <div className="text-xs text-gray-500">{m.user.phone || m.user.email}</div>
              </div>
              <Badge className={m.role === "OWNER" ? "bg-or-100 text-or-700" : "bg-gray-100 text-gray-600"}>{ROLE_LABELS[m.role]}</Badge>
            </div>
            {canManage && m.role !== "OWNER" && (
              <div className="flex flex-wrap gap-2 mt-2">
                <form action={updateMemberRoleAction} className="flex items-center gap-1">
                  <input type="hidden" name="memberId" value={m.id} />
                  <select name="role" defaultValue={m.role} className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                  <button className="btn-primary !py-1 !px-2 text-xs">Modifier</button>
                </form>
                <form action={toggleMemberAction}>
                  <input type="hidden" name="memberId" value={m.id} />
                  <button className="btn-outline !py-1 !px-2 text-xs">{m.active ? "Désactiver" : "Réactiver"}</button>
                </form>
              </div>
            )}
            {canManage && m.role !== "OWNER" && (
              <MemberPermissions
                memberId={m.id}
                custom={Array.isArray(m.customPermissions)}
                current={Array.isArray(m.customPermissions) ? (m.customPermissions as string[]) : expandRolePermissions(m.role)}
              />
            )}
          </div>
        ))}
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
