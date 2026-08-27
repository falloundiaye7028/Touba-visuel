"use client";

import { useMemo, useState } from "react";
import {
  Activity, Bell, ChevronDown, CircleHelp, ClipboardList, Droplets, FileCheck2,
  FolderKanban, HandCoins, LayoutDashboard, Map, Menu, Plus, Search, ShieldCheck,
  TrendingUp, Users, WalletCards, X, Zap, CheckCircle2, Clock3, ArrowUpRight,
} from "lucide-react";

type View = "dashboard" | "members" | "contributions" | "projects" | "requests";

const nav: { id: View | "more"; label: string; icon: typeof Activity; badge?: string }[] = [
  { id: "dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "members", label: "Membres", icon: Users, badge: "24 892" },
  { id: "contributions", label: "Contributions", icon: HandCoins },
  { id: "more", label: "Finances", icon: WalletCards },
  { id: "projects", label: "Projets & chantiers", icon: FolderKanban, badge: "18" },
  { id: "more", label: "Commissions", icon: ClipboardList },
  { id: "requests", label: "Demandes citoyennes", icon: CircleHelp, badge: "37" },
  { id: "more", label: "Cartographie", icon: Map },
];

const stats = [
  { label: "Collecté ce mois", value: "18 450 000", suffix: "F CFA", delta: "+12,4 %", icon: HandCoins, color: "emerald" },
  { label: "Contributeurs actifs", value: "24 892", suffix: "membres", delta: "+834", icon: Users, color: "blue" },
  { label: "Projets en cours", value: "18", suffix: "sur 31 projets", delta: "7 en bonne voie", icon: FolderKanban, color: "gold" },
  { label: "Budget disponible", value: "82 700 000", suffix: "F CFA", delta: "61 % restant", icon: WalletCards, color: "purple" },
];

const projects = [
  { title: "Extension réseau d’eau — Darou Marnane", area: "Hydraulique", progress: 74, budget: "32,5 M", icon: Droplets, color: "#1884c7" },
  { title: "Éclairage solaire — Route de Ndindy", area: "Éclairage public", progress: 52, budget: "18,2 M", icon: Zap, color: "#d69a16" },
  { title: "Assainissement Keur Niang", area: "Voirie & assainissement", progress: 89, budget: "44,8 M", icon: Activity, color: "#168b62" },
];

const requests = [
  { id: "TCK-2608-0142", text: "Panne de lampadaire", place: "Darou Khoudoss", time: "Il y a 18 min", level: "Urgent" },
  { id: "TCK-2608-0141", text: "Besoin de nettoiement", place: "Touba Mosquée", time: "Il y a 42 min", level: "Normal" },
  { id: "TCK-2608-0138", text: "Adduction d’eau", place: "Ndamatou", time: "Il y a 2 h", level: "Élevé" },
];

export default function TckDashboard() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [notice, setNotice] = useState(false);
  const today = useMemo(() => new Intl.DateTimeFormat("fr-SN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()), []);

  const selectView = (id: View | "more") => {
    if (id === "more") { setNotice(true); return; }
    setView(id); setSidebar(false);
  };

  return (
    <main className="tck-shell">
      <aside className={`tck-sidebar ${sidebar ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>TC</span><b>K</b></div>
          <div><strong>TCK <em>CONNECT</em></strong><small>Touba Ca Kanam</small></div>
          <button className="close-side" onClick={() => setSidebar(false)} aria-label="Fermer"><X size={20}/></button>
        </div>
        <div className="workspace"><span className="avatar small">MB</span><div><small>ESPACE DE TRAVAIL</small><b>Bureau exécutif</b></div><ChevronDown size={16}/></div>
        <nav>
          <p>PILOTAGE</p>
          {nav.map((item, i) => <button key={`${item.label}-${i}`} className={item.id === view ? "active" : ""} onClick={() => selectView(item.id)}><item.icon size={19}/><span>{item.label}</span>{item.badge && <i>{item.badge}</i>}</button>)}
          <p>CONTRÔLE & SYSTÈME</p>
          <button onClick={() => setNotice(true)}><ShieldCheck size={19}/><span>Audit & conformité</span></button>
          <button onClick={() => setNotice(true)}><FileCheck2 size={19}/><span>Rapports publics</span></button>
        </nav>
        <div className="secure"><ShieldCheck size={20}/><div><b>Système sécurisé</b><small>Dernière vérification : aujourd’hui</small></div></div>
        <div className="profile"><span className="avatar">MB</span><div><b>Moussa Bâ</b><small>Secrétaire général</small></div><button>•••</button></div>
      </aside>

      <section className="tck-content">
        <header>
          <button className="menu" onClick={() => setSidebar(true)} aria-label="Menu"><Menu/></button>
          <div className="search"><Search size={18}/><input aria-label="Recherche" placeholder="Rechercher un membre, projet, dossier…"/><kbd>⌘ K</kbd></div>
          <button className="circle" onClick={() => setNotice(true)}><CircleHelp size={20}/></button>
          <button className="circle has-dot" onClick={() => setNotice(true)}><Bell size={20}/></button>
          <div className="mobile-avatar avatar">MB</div>
        </header>

        <div className="canvas">
          {view === "dashboard" ? <Dashboard today={today} onNotice={() => setNotice(true)}/> : <ModuleView view={view} onBack={() => setView("dashboard")}/>} 
        </div>
      </section>
      {sidebar && <button className="backdrop" onClick={() => setSidebar(false)} aria-label="Fermer le menu"/>}
      {notice && <div className="toast"><CheckCircle2 size={20}/><div><b>Action enregistrée</b><span>Cette fonctionnalité est prête à être connectée à l’API sécurisée.</span></div><button onClick={() => setNotice(false)}><X size={16}/></button></div>}
    </main>
  );
}

function Dashboard({ today, onNotice }: { today: string; onNotice: () => void }) {
  return <>
    <div className="title-row"><div><p className="eyebrow">{today}</p><h1>Jàmm nga am, Moussa <span>👋🏾</span></h1><p>Voici la situation de Touba Ca Kanam aujourd’hui.</p></div><button className="primary" onClick={onNotice}><Plus size={19}/> Nouvelle opération</button></div>
    <div className="demo"><span>DONNÉES DE DÉMONSTRATION</span><p>Les chiffres affichés sont fictifs et servent uniquement à illustrer la plateforme.</p><button>En savoir plus</button></div>
    <section className="stat-grid">{stats.map(s => <article className="stat" key={s.label}><div className={`stat-icon ${s.color}`}><s.icon size={21}/></div><p>{s.label}</p><h2>{s.value}</h2><div className="stat-foot"><span>{s.suffix}</span><b><TrendingUp size={13}/>{s.delta}</b></div></article>)}</section>
    <div className="main-grid">
      <article className="panel collections"><PanelTitle title="Dynamique des contributions" sub="Janvier — Août 2026"/><div className="chart"><div className="y-axis"><span>24M</span><span>18M</span><span>12M</span><span>6M</span><span>0</span></div><div className="bars">{[47,55,52,69,67,76,71,88].map((h,i)=><div className="bar-wrap" key={i}><div className="bar" style={{height:`${h}%`}}><i>{i === 7 ? "18,4 M" : ""}</i></div><span>{["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août"][i]}</span></div>)}</div></div><div className="chart-summary"><div><span className="dot green"/>Collecté <b>126,8 M F</b></div><div><span className="dot gold"/>Objectif <b>144 M F</b></div><strong>88 % de l’objectif</strong></div></article>
      <article className="panel map-panel"><PanelTitle title="Interventions à Touba" sub="Vue en temps réel"/><div className="map-faux"><span className="road r1"/><span className="road r2"/><span className="road r3"/><span className="zone z1">TOUBA MOSQUÉE</span><span className="zone z2">NDAMATOU</span><span className="zone z3">DAROU MARNANE</span>{[[24,28,"water"],[58,38,"light"],[73,67,"work"],[38,73,"water"],[79,27,"light"]].map((m,i)=><i key={i} className={`pin ${m[2]}`} style={{left:`${m[0]}%`,top:`${m[1]}%`}}>{m[2]==="water"?"●":m[2]==="light"?"✦":"◆"}</i>)}<button>Ouvrir la carte <ArrowUpRight size={14}/></button></div><div className="legend"><span><i className="water"/>Eau</span><span><i className="light"/>Éclairage</span><span><i className="work"/>Chantiers</span></div></article>
    </div>
    <div className="lower-grid">
      <article className="panel"><PanelTitle title="Projets prioritaires" sub="3 projets nécessitent votre attention" action="Voir tous"/>{projects.map(p=><div className="project" key={p.title}><span className="project-icon" style={{color:p.color,background:p.color+"16"}}><p.icon size={20}/></span><div className="project-info"><b>{p.title}</b><small>{p.area} · Budget {p.budget} F</small><div><i style={{width:`${p.progress}%`,background:p.color}}/></div></div><strong>{p.progress}%</strong></div>)}</article>
      <article className="panel"><PanelTitle title="Demandes récentes" sub="37 dossiers en attente" action="Tout afficher"/>{requests.map(r=><div className="request" key={r.id}><span className={r.level === "Urgent" ? "urgent" : r.level === "Élevé" ? "high" : "normal"}/><div><b>{r.text}</b><small>{r.id} · {r.place}</small></div><div><i>{r.level}</i><small><Clock3 size={12}/>{r.time}</small></div></div>)}</article>
    </div>
  </>;
}

function PanelTitle({title,sub,action}:{title:string;sub:string;action?:string}) { return <div className="panel-title"><div><h3>{title}</h3><p>{sub}</p></div>{action && <button>{action} →</button>}</div> }

function ModuleView({view,onBack}:{view:Exclude<View,"dashboard">;onBack:()=>void}) {
  const content = {
    members: ["Registre des membres", "24 892 membres identifiés", ["TCK-2026-24892 · Awa Diop", "TCK-2026-24891 · Serigne Fall", "TCK-2026-24890 · Fatou Ndiaye"]],
    contributions: ["Contributions & collecte", "Rapprochement et reçus traçables", ["Reçu TCK-R-0826-1840 · 1 000 F", "Clôture caisse Zone 4 · 385 000 F", "Don projet hydraulique · 50 000 F"]],
    projects: ["Projets & chantiers", "18 projets actifs", projects.map(p=>`${p.title} · ${p.progress}%`)],
    requests: ["Demandes citoyennes", "37 dossiers à traiter", requests.map(r=>`${r.id} · ${r.text} · ${r.level}`)],
  }[view] as [string,string,string[]];
  return <><button className="back" onClick={onBack}>← Vue d’ensemble</button><div className="title-row"><div><p className="eyebrow">MODULE OPÉRATIONNEL</p><h1>{content[0]}</h1><p>{content[1]}</p></div><button className="primary"><Plus size={19}/> Ajouter</button></div><article className="panel module"><div className="module-toolbar"><div className="search"><Search size={17}/><input placeholder="Rechercher…"/></div><button>Filtrer <ChevronDown size={15}/></button></div>{content[2].map((x,i)=><div className="module-row" key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><i>Consulter →</i></div>)}</article></>;
}
