import Link from "next/link";
import {
  Users, Wallet, Truck, BarChart3, Megaphone, UserCog, FileText,
  Boxes, Settings, Store, Bell, CreditCard, ChevronRight,
} from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { ROLE_LABELS } from "@/lib/sama/constants";
import { PageHeader } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/sama/clients", label: "Clients", icon: Users },
  { href: "/sama/stock", label: "Stock", icon: Boxes },
  { href: "/sama/depenses", label: "Dépenses", icon: Wallet },
  { href: "/sama/factures", label: "Factures & Devis", icon: FileText },
  { href: "/sama/fournisseurs", label: "Fournisseurs", icon: Truck },
  { href: "/sama/rapports", label: "Rapports", icon: BarChart3 },
  { href: "/sama/boutique", label: "Boutique en ligne", icon: Store },
  { href: "/sama/marketing", label: "Marketing", icon: Megaphone },
  { href: "/sama/employes", label: "Employés", icon: UserCog },
  { href: "/sama/notifications", label: "Notifications", icon: Bell },
  { href: "/sama/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/sama/parametres", label: "Paramètres", icon: Settings },
];

export default async function PlusPage() {
  const { business, role } = await requireOnboardedTenant();
  return (
    <div className="space-y-4">
      <PageHeader title="Plus" subtitle={`${business.name} · ${ROLE_LABELS[role]}`} />
      <div className="card divide-y divide-gray-100">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <span className="w-9 h-9 rounded-xl bg-vert-50 text-vert-600 grid place-items-center"><l.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" /></span>
            <span className="flex-1 font-medium text-gray-800">{l.label}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
