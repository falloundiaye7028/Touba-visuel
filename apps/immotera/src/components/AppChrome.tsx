"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Bot, Building2, CalendarDays, ChevronDown, CircleDollarSign, Command, FileSpreadsheet,
  FileText, Grid2X2, House, KeyRound, Menu, ReceiptText, Search, Settings, ShieldCheck, Users,
  WalletCards, Wrench, X,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: typeof House; badge?: string; alert?: boolean };
const groups: { label?: string; items: NavItem[] }[] = [
  { items: [{ label: "Dashboard", href: "/dashboard", icon: Grid2X2 }] },
  { label: "Immobilier", items: [{ label: "Biens", href: "/properties", icon: House, badge: "24" }, { label: "Immeubles", href: "/buildings", icon: Building2 }, { label: "Propriétaires", href: "/owners", icon: Users }] },
  { label: "CRM", items: [{ label: "Prospects", href: "/leads", icon: Users, badge: "8" }, { label: "Visites", href: "/visits", icon: CalendarDays }] },
  { label: "Gestion locative", items: [{ label: "Locataires", href: "/tenants", icon: KeyRound }, { label: "Contrats", href: "/contracts", icon: FileText }, { label: "Paiements", href: "/payments", icon: WalletCards }, { label: "Impayés", href: "/arrears", icon: CircleDollarSign }] },
  { label: "Finance", items: [{ label: "Dépenses", href: "/expenses", icon: ReceiptText }, { label: "Commissions", href: "/commissions", icon: CircleDollarSign }, { label: "Reversements", href: "/owner-statements", icon: WalletCards }] },
  { label: "Opérations", items: [{ label: "Maintenance", href: "/maintenance", icon: Wrench, alert: true }, { label: "Fournisseurs", href: "/vendors", icon: Users }, { label: "Documents", href: "/documents", icon: FileText }, { label: "Imports", href: "/import", icon: FileSpreadsheet }] },
  { items: [{ label: "Rapports", href: "/reports", icon: FileSpreadsheet }, { label: "IntelligenceImmobilier AI", href: "/ai", icon: Bot }, { label: "Paramètres", href: "/settings", icon: Settings }] },
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const allItems = useMemo(() => groups.flatMap((group) => group.items), []);
  const filtered = allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") { setCommandOpen(false); setMobileOpen(false); setNotificationsOpen(false); }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <main className="app-shell">
      <button className={`mobile-shade ${mobileOpen ? "show" : ""}`} aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand"><span className="brand-mark"><Building2 size={20} /></span><span><strong>INTELLIGENCE<br/>IMMOBILIER</strong><small>L’intelligence immobilière.</small></span><button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer"><X size={18}/></button></div>
        <nav aria-label="Navigation principale">
          {groups.map((group, groupIndex) => <div key={group.label ?? groupIndex}>{group.label && <p className="nav-group">{group.label}</p>}{group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link className={`nav-link ${active ? "active" : ""}`} href={item.href} key={item.href} onClick={() => setMobileOpen(false)}><item.icon size={17}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}{item.alert && <i aria-label="Notification"/>}</Link>;
          })}</div>)}
        </nav>
        <div className="sidebar-foot"><ShieldCheck size={18}/><span><b>Données sécurisées</b><small>Organisation isolée</small></span></div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Ouvrir le menu" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <button className="search" onClick={() => setCommandOpen(true)}><Search size={17}/><span>Rechercher un bien, locataire, paiement…</span><kbd>⌘ K</kbd></button>
          <div className="top-actions"><button className="icon-button" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Bell size={19}/><i/></button><button className="profile"><span>MK</span><div><b>Mamadou Kane</b><small>Administrateur</small></div><ChevronDown size={14}/></button></div>
          {notificationsOpen && <div className="notifications-popover"><div><b>Notifications</b><span>3 nouvelles</span></div><p><i className="danger-dot"/>Loyer en retard · Ibrahima Ba<small>Il y a 12 min</small></p><p><i className="warning-dot"/>Contrat BAIL-2025-009 à renouveler<small>Il y a 2 h</small></p><p><i className="info-dot"/>Nouvelle visite confirmée<small>Hier</small></p></div>}
        </header>
        {children}
        <nav className="mobile-nav" aria-label="Navigation mobile"><Link className={pathname === "/dashboard" ? "active" : ""} href="/dashboard"><Grid2X2 size={19}/><span>Accueil</span></Link><Link className={pathname.startsWith("/properties") ? "active" : ""} href="/properties"><House size={19}/><span>Biens</span></Link><Link className="mobile-add" href="/payments?new=1" aria-label="Nouveau paiement"><span>+</span></Link><Link className={pathname.startsWith("/payments") ? "active" : ""} href="/payments"><WalletCards size={19}/><span>Paiements</span></Link><Link className={pathname.startsWith("/settings") ? "active" : ""} href="/settings"><Settings size={19}/><span>Réglages</span></Link></nav>
      </section>
      {commandOpen && <div className="dialog-layer" role="dialog" aria-modal="true" aria-label="Palette de commandes"><button className="dialog-backdrop" onClick={() => setCommandOpen(false)} aria-label="Fermer"/><div className="command-dialog"><div className="command-input"><Command size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher ou aller vers…"/><kbd>Échap</kbd></div><p>Navigation</p>{filtered.slice(0,8).map((item) => <Link href={item.href} key={item.href} onClick={() => setCommandOpen(false)}><item.icon size={16}/><span>{item.label}</span><small>Aller à la page</small></Link>)}</div></div>}
    </main>
  );
}
