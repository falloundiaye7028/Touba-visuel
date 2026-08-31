"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Bot, Building2, CalendarDays, ChevronDown, ChevronsLeft, ChevronsRight,
  CircleDollarSign, Command, FileSpreadsheet, FileText, Grid2X2, HelpCircle, House,
  KeyRound, LogOut, Menu, Moon, Plus, ReceiptText, Search, Settings, Sparkles, Sun,
  Users, WalletCards, Wrench, X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

type NavItem = { label: string; href: string; icon: typeof House; badge?: string; alert?: boolean };

const groups: { label?: string; items: NavItem[] }[] = [
  { items: [{ label: "Tableau de bord", href: "/dashboard", icon: Grid2X2 }] },
  { label: "Immobilier", items: [{ label: "Biens", href: "/properties", icon: House, badge: "128" }, { label: "Immeubles & unités", href: "/buildings", icon: Building2 }] },
  { label: "Gestion locative", items: [{ label: "Locataires", href: "/tenants", icon: KeyRound }, { label: "Contrats", href: "/contracts", icon: FileText }, { label: "Paiements", href: "/payments", icon: WalletCards }, { label: "Impayés", href: "/arrears", icon: CircleDollarSign, alert: true }] },
  { label: "Propriétaires", items: [{ label: "Propriétaires", href: "/owners", icon: Users }, { label: "Reversements", href: "/owner-statements", icon: ReceiptText }] },
  { label: "Commercial", items: [{ label: "Prospects", href: "/leads", icon: Users, badge: "7" }, { label: "Visites", href: "/visits", icon: CalendarDays }] },
  { label: "Opérations", items: [{ label: "Maintenance", href: "/maintenance", icon: Wrench }, { label: "Fournisseurs", href: "/vendors", icon: Users }, { label: "Documents", href: "/documents", icon: FileText }] },
  { label: "Finance", items: [{ label: "Dépenses", href: "/expenses", icon: ReceiptText }, { label: "Commissions", href: "/commissions", icon: CircleDollarSign }] },
  { label: "Intelligence", items: [{ label: "Intelligence Immobilier AI", href: "/ai", icon: Bot }, { label: "Rapports & analyses", href: "/reports", icon: FileSpreadsheet }] },
  { items: [{ label: "Paramètres", href: "/settings", icon: Settings }] },
];

const quickActions = [
  { label: "Ajouter un bien", href: "/properties?new=1", icon: House },
  { label: "Créer un locataire", href: "/tenants?new=1", icon: Users },
  { label: "Créer un propriétaire", href: "/owners?new=1", icon: KeyRound },
  { label: "Créer un contrat", href: "/contracts?new=1", icon: FileText },
  { label: "Enregistrer un paiement", href: "/payments?new=1", icon: WalletCards },
  { label: "Nouveau prospect", href: "/leads?new=1", icon: Sparkles },
  { label: "Ticket de maintenance", href: "/maintenance?new=1", icon: Wrench },
];

const allItems = groups.flatMap((group) => group.items);

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const filtered = allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const storedTheme = localStorage.getItem("ii-theme") === "dark" ? "dark" : "light";
    const storedSidebar = localStorage.getItem("ii-sidebar") === "collapsed";
    document.documentElement.dataset.theme = storedTheme;
    const frame = window.requestAnimationFrame(() => {
      setTheme(storedTheme);
      setCollapsed(storedSidebar);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") { setCommandOpen(false); setMobileOpen(false); setNotificationsOpen(false); setQuickOpen(false); }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("ii-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const toggleSidebar = () => {
    const nextCollapsed = !collapsed;
    setCollapsed(nextCollapsed);
    localStorage.setItem("ii-sidebar", nextCollapsed ? "collapsed" : "expanded");
  };

  return (
    <main className={`app-shell premium-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <button className={`mobile-shade ${mobileOpen ? "show" : ""}`} aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="premium-brand-row">
          <Link href="/dashboard" aria-label="INTELLIGENCE IMMOBILIER — Tableau de bord"><BrandLogo variant={collapsed ? "symbol" : "wordmark"} light priority /></Link>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fermer"><X size={18}/></button>
        </div>
        <nav aria-label="Navigation principale">
          {groups.map((group, groupIndex) => <div key={group.label ?? groupIndex}>{group.label ? <p className="nav-group">{group.label}</p> : null}{group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link className={`nav-link ${active ? "active" : ""}`} href={item.href} key={`${item.label}-${item.href}`} title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)}><item.icon size={17}/><span>{item.label}</span>{item.badge ? <b>{item.badge}</b> : null}{item.alert ? <i aria-label="Notification"/> : null}</Link>;
          })}</div>)}
        </nav>
        <div className="sidebar-account">
          <div className="organization-chip"><span>II</span><div><b>II Démo Dakar</b><small>Plan Agence</small></div></div>
          <div className="sidebar-profile"><span>MK</span><div><b>Mamadou Kane</b><small>Administrateur</small></div><ChevronDown size={14}/></div>
          <div className="sidebar-utilities"><button aria-label="Aide"><HelpCircle size={16}/><span>Aide</span></button><button aria-label="Déconnexion"><LogOut size={16}/><span>Déconnexion</span></button></div>
        </div>
        <button className="sidebar-collapse" onClick={toggleSidebar} aria-label={collapsed ? "Déployer la navigation" : "Réduire la navigation"}>{collapsed ? <ChevronsRight size={17}/> : <><ChevronsLeft size={17}/><span>Réduire</span></>}</button>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Ouvrir le menu" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <button className="search" onClick={() => setCommandOpen(true)}><Search size={17}/><span>Rechercher un bien, locataire, propriétaire…</span><kbd>⌘ K</kbd></button>
          <div className="top-actions">
            <div className="quick-action-wrap"><button className="quick-add" onClick={() => setQuickOpen((value) => !value)}><Plus size={16}/>Nouveau<ChevronDown size={13}/></button>{quickOpen ? <div className="quick-menu"><p>Création rapide</p>{quickActions.map((action) => <Link href={action.href} key={action.label} onClick={() => setQuickOpen(false)}><action.icon size={16}/><span>{action.label}</span></Link>)}</div> : null}</div>
            <Link className="ai-top-button" href="/ai"><Sparkles size={16}/><span>Demander à l’IA</span></Link>
            <button className="icon-button" aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"} onClick={toggleTheme}>{theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}</button>
            <button className="icon-button" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Bell size={19}/><i/></button>
            <button className="profile"><span>MK</span><div><b>Mamadou Kane</b><small>Administrateur</small></div><ChevronDown size={14}/></button>
          </div>
          {notificationsOpen ? <div className="notifications-popover"><div><b>Notifications</b><span>3 nouvelles</span></div><p><i className="danger-dot"/>Loyer en retard · Ibrahima Ba<small>Il y a 12 min</small></p><p><i className="warning-dot"/>Contrat BAIL-2025-009 à renouveler<small>Il y a 2 h</small></p><p><i className="info-dot"/>Nouvelle visite confirmée<small>Hier</small></p></div> : null}
        </header>
        {children}
        <nav className="mobile-nav" aria-label="Navigation mobile"><Link className={pathname === "/dashboard" ? "active" : ""} href="/dashboard"><Grid2X2 size={19}/><span>Accueil</span></Link><Link className={pathname.startsWith("/properties") ? "active" : ""} href="/properties"><House size={19}/><span>Biens</span></Link><Link className="mobile-add" href="/payments?new=1" aria-label="Nouveau paiement"><span>+</span></Link><Link className={pathname.startsWith("/payments") ? "active" : ""} href="/payments"><WalletCards size={19}/><span>Paiements</span></Link><Link className={pathname.startsWith("/ai") ? "active" : ""} href="/ai"><Bot size={19}/><span>IA</span></Link></nav>
      </section>
      {commandOpen ? <div className="dialog-layer" role="dialog" aria-modal="true" aria-label="Palette de commandes"><button className="dialog-backdrop" onClick={() => setCommandOpen(false)} aria-label="Fermer"/><div className="command-dialog premium-command"><div className="command-input"><Command size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher ou lancer une action…"/><kbd>Échap</kbd></div><p>Actions rapides</p>{query ? filtered.slice(0,8).map((item) => <Link href={item.href} key={`${item.label}-${item.href}`} onClick={() => setCommandOpen(false)}><item.icon size={16}/><span>{item.label}</span><small>Ouvrir</small></Link>) : quickActions.slice(0,6).map((action) => <Link href={action.href} key={action.label} onClick={() => setCommandOpen(false)}><action.icon size={16}/><span>{action.label}</span><small>Créer</small></Link>)}<Link className="command-ai" href="/ai" onClick={() => setCommandOpen(false)}><Sparkles size={16}/><span>Demander à Intelligence Immobilier AI</span><small>⌘ ↵</small></Link></div></div> : null}
    </main>
  );
}
