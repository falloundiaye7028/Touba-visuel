"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ShoppingCart, ClipboardList, Package, Users, Wallet,
  Truck, BarChart3, Megaphone, UserCog, FileText, Boxes, Settings, Store,
  FileSignature, UploadCloud, Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: { href: string; label: string; icon: typeof Home }[] }[] = [
  {
    title: "Gestion",
    items: [
      { href: "/sama/dashboard", label: "Tableau de bord", icon: Home },
      { href: "/sama/ventes", label: "Ventes", icon: ShoppingCart },
      { href: "/sama/commandes", label: "Commandes", icon: ClipboardList },
      { href: "/sama/produits", label: "Produits", icon: Package },
      { href: "/sama/stock", label: "Stock", icon: Boxes },
      { href: "/sama/clients", label: "Clients", icon: Users },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/sama/depenses", label: "Dépenses", icon: Wallet },
      { href: "/sama/factures", label: "Factures", icon: FileText },
      { href: "/sama/devis", label: "Devis", icon: FileSignature },
      { href: "/sama/fournisseurs", label: "Fournisseurs", icon: Truck },
      { href: "/sama/rapports", label: "Rapports", icon: BarChart3 },
    ],
  },
  {
    title: "Croissance",
    items: [
      { href: "/sama/ai", label: "SAMA AI", icon: Bot },
      { href: "/sama/boutique", label: "Boutique en ligne", icon: Store },
      { href: "/sama/marketing", label: "Marketing", icon: Megaphone },
      { href: "/sama/employes", label: "Employés", icon: UserCog },
      { href: "/sama/imports", label: "Importer (CSV)", icon: UploadCloud },
      { href: "/sama/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-gray-200 bg-white h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      <div className="p-3 space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{g.title}</div>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.href || pathname.startsWith(it.href + "/");
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      active ? "bg-vert-50 text-vert-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
