"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Settings, Store, Search, Check, Plus } from "lucide-react";
import ThemeToggle from "@/components/sama/ThemeToggle";
import { switchBusinessAction } from "@/lib/sama/actions/business";

export default function TopBar({
  businessName,
  planName,
  userName,
  unread,
  slug,
  storePublished,
  businesses = [],
  activeId,
}: {
  businessName: string;
  planName: string;
  userName: string;
  unread: number;
  slug: string;
  storePublished: boolean;
  businesses?: { id: string; name: string }[];
  activeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const initials = businessName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-3 gap-2">
      <Link href="/sama/dashboard" className="flex items-center gap-2 min-w-0">
        <span className="w-8 h-8 rounded-xl bg-vert-700 text-white grid place-items-center text-xs font-bold shrink-0">
          {initials}
        </span>
        <span className="font-semibold text-gray-900 truncate hidden sm:block">{businessName}</span>
      </Link>

      <form
        onSubmit={(e) => { e.preventDefault(); const v = (new FormData(e.currentTarget).get("q") as string) || ""; router.push(`/sama/recherche?q=${encodeURIComponent(v)}`); }}
        className="hidden sm:flex items-center gap-2 ml-4 flex-1 max-w-xs bg-gray-100 rounded-xl px-3 py-1.5"
      >
        <Search className="w-4 h-4 text-gray-400" />
        <input name="q" placeholder="Rechercher…" className="bg-transparent text-sm outline-none w-full" />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link href="/sama/recherche" className="sm:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-600"><Search className="w-5 h-5" /></Link>
        <ThemeToggle />
        {storePublished && (
          <Link
            href={`/sama/boutique/${slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-vert-700 px-2 py-1.5 rounded-lg"
          >
            <Store className="w-4 h-4" /> Boutique
          </Link>
        )}
        <Link href="/sama/notifications" className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-600">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50"
          >
            <span className="w-7 h-7 rounded-full bg-or-400 text-gray-900 grid place-items-center text-xs font-bold">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="font-medium text-sm text-gray-900 truncate">{userName}</div>
                  <div className="text-xs text-gray-500">Plan {planName}</div>
                </div>

                {businesses.length > 1 && (
                  <div className="border-b border-gray-100 py-1">
                    <div className="px-3 py-1 text-[11px] uppercase tracking-wide text-gray-400">Mes boutiques</div>
                    {businesses.map((b) => (
                      <form key={b.id} action={switchBusinessAction}>
                        <input type="hidden" name="businessId" value={b.id} />
                        <button type="submit" className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 text-left">
                          <Check className={`w-3.5 h-3.5 ${b.id === activeId ? "text-vert-600" : "text-transparent"}`} />
                          <span className="truncate">{b.name}</span>
                        </button>
                      </form>
                    ))}
                  </div>
                )}
                <Link href="/sama/nouvelle-entreprise" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Plus className="w-4 h-4" /> Ajouter une entreprise
                </Link>
                <Link href="/sama/parametres" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4" /> Paramètres
                </Link>
                <Link href="/sama/abonnement" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Store className="w-4 h-4" /> Mon abonnement
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/sama" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
