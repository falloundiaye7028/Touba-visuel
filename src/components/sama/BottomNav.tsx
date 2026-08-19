"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, ClipboardList, Package, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/sama/dashboard", label: "Accueil", icon: Home },
  { href: "/sama/ventes", label: "Ventes", icon: ShoppingCart },
  { href: "/sama/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/sama/produits", label: "Produits", icon: Package },
  { href: "/sama/plus", label: "Plus", icon: LayoutGrid },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-vert-700" : "text-gray-400"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
