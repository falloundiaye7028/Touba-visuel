import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileSpreadsheet,
  Gauge,
  House,
  KeyRound,
  MapPin,
  Plus,
  Sparkles,
  Upload,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";

const kpis = [
  { label: "Patrimoine géré", value: "128", unit: "biens", note: "+4 ce mois", icon: Building2, tone: "navy", href: "/properties" },
  { label: "Taux d’occupation", value: "91,4", unit: "%", note: "117 / 128 occupés", icon: KeyRound, tone: "teal", href: "/properties" },
  { label: "Loyers attendus", value: "18 450 000", unit: "FCFA", note: "Échéances d’août", icon: CalendarDays, tone: "blue", href: "/contracts" },
  { label: "Loyers encaissés", value: "15 920 000", unit: "FCFA", note: "86,3 % collectés", icon: WalletCards, tone: "success", href: "/payments" },
  { label: "Impayés", value: "2 530 000", unit: "FCFA", note: "12 locataires", icon: AlertTriangle, tone: "danger", href: "/arrears" },
];

const revenue = [
  { month: "Mars", expected: 72, collected: 63 },
  { month: "Avr.", expected: 78, collected: 71 },
  { month: "Mai", expected: 82, collected: 76 },
  { month: "Juin", expected: 88, collected: 80 },
  { month: "Juil.", expected: 92, collected: 84 },
  { month: "Août", expected: 96, collected: 83 },
];

const actions = [
  { label: "12 loyers à relancer", meta: "2 530 000 FCFA", href: "/arrears", icon: CircleDollarSign, tone: "danger" },
  { label: "5 contrats expirent bientôt", meta: "Sous 45 jours", href: "/contracts", icon: Clock3, tone: "warning" },
  { label: "3 biens vacants", meta: "Depuis plus de 30 jours", href: "/properties", icon: House, tone: "blue" },
  { label: "4 tickets de maintenance", meta: "1 intervention urgente", href: "/maintenance", icon: Wrench, tone: "teal" },
  { label: "7 prospects à rappeler", meta: "Potentiel estimé : 3,8 M", href: "/leads", icon: Users, tone: "navy" },
];

const locations = [
  { name: "Résidence Almadies", location: "Almadies", units: "28 unités", occupancy: "96 %", revenue: "5,8 M", progress: 96 },
  { name: "Horizon Mermoz", location: "Mermoz", units: "42 unités", occupancy: "93 %", revenue: "4,9 M", progress: 93 },
  { name: "Keur Océan", location: "Ouakam", units: "18 unités", occupancy: "89 %", revenue: "2,7 M", progress: 89 },
];

const arrears = [
  { initials: "IB", name: "Ibrahima Ba", property: "Bureau Horizon", amount: "1 200 000", delay: "34 jours", critical: true },
  { initials: "AS", name: "Abdoulaye Seck", property: "Apt. Sacré-Cœur", amount: "450 000", delay: "18 jours" },
  { initials: "FN", name: "Fatou Ndiaye", property: "Studio Point E", amount: "325 000", delay: "12 jours" },
];

export default function DashboardPage() {
  return (
    <div className="page-content premium-dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">LUNDI 31 AOÛT 2026</p>
          <h1>Bonjour Mamadou <span aria-hidden="true">👋</span></h1>
          <p>Voici la situation de votre portefeuille immobilier aujourd’hui.</p>
        </div>
        <div className="dashboard-actions">
          <Link className="button secondary" href="/properties?new=1"><Plus size={16}/> Ajouter</Link>
          <Link className="button secondary" href="/import"><Upload size={16}/> Importer</Link>
          <Link className="button ai-action" href="/ai"><Sparkles size={16}/> Demander à l’IA</Link>
        </div>
      </section>

      <div className="dashboard-control-row">
        <div className="period-tabs" aria-label="Période d’analyse">
          <button>Aujourd’hui</button>
          <button className="active">Ce mois</button>
          <button>Ce trimestre</button>
          <button>Cette année</button>
        </div>
        <button className="date-control"><CalendarDays size={15}/> 01–31 août 2026</button>
      </div>

      <section className="premium-kpi-grid" aria-label="Indicateurs clés">
        {kpis.map((kpi) => (
          <Link className={`premium-kpi ${kpi.tone}`} href={kpi.href} key={kpi.label}>
            <div className="premium-kpi-top">
              <span className="premium-kpi-icon"><kpi.icon size={19}/></span>
              <ArrowUpRight size={16}/>
            </div>
            <p>{kpi.label}</p>
            <strong>{kpi.value} <small>{kpi.unit}</small></strong>
            <span>{kpi.note}</span>
          </Link>
        ))}
      </section>

      <section className="dashboard-main-grid">
        <article className="premium-panel revenue-overview">
          <header className="premium-panel-head">
            <div><p className="panel-kicker">PERFORMANCE FINANCIÈRE</p><h2>Encaissements mensuels</h2></div>
            <Link href="/reports">Voir le rapport <ArrowRight size={14}/></Link>
          </header>
          <div className="revenue-summary">
            <div><span>Encaissé ce mois</span><strong>15 920 000 <small>FCFA</small></strong></div>
            <span className="positive-chip"><ArrowUpRight size={13}/> +8,4 % vs juillet</span>
          </div>
          <div className="revenue-legend"><span><i className="expected"/>Attendu</span><span><i className="collected"/>Encaissé</span></div>
          <div className="revenue-chart" aria-label="Loyers attendus et encaissés des six derniers mois">
            <div className="chart-scale"><span>20M</span><span>15M</span><span>10M</span><span>5M</span><span>0</span></div>
            <div className="paired-bars">
              {revenue.map((item) => <div className="paired-bar" key={item.month}><div><i className="expected" style={{height: `${item.expected}%`}}/><i className="collected" style={{height: `${item.collected}%`}}/></div><span>{item.month}</span></div>)}
            </div>
          </div>
        </article>

        <article className="premium-panel action-center">
          <header className="premium-panel-head"><div><p className="panel-kicker">CENTRE D’ACTIONS</p><h2>À traiter en priorité</h2></div><span className="panel-count">31</span></header>
          <div className="action-list">
            {actions.map((action) => <Link href={action.href} key={action.label}><i className={action.tone}><action.icon size={16}/></i><span><b>{action.label}</b><small>{action.meta}</small></span><ArrowRight size={15}/></Link>)}
          </div>
          <Link className="panel-footer-link" href="/reports">Voir toutes les actions <ArrowRight size={14}/></Link>
        </article>
      </section>

      <section className="dashboard-secondary-grid">
        <article className="premium-panel occupancy-card">
          <header className="premium-panel-head"><div><p className="panel-kicker">OCCUPATION</p><h2>État du portefeuille</h2></div><Gauge size={20}/></header>
          <div className="occupation-content">
            <div className="premium-donut"><div><strong>91,4<small>%</small></strong><span>occupation</span></div></div>
            <div className="occupation-breakdown">
              <span><i className="occupied"/><b>117</b><small>Biens occupés</small></span>
              <span><i className="vacant"/><b>8</b><small>Biens vacants</small></span>
              <span><i className="maintenance"/><b>3</b><small>En maintenance</small></span>
            </div>
          </div>
        </article>

        <article className="premium-panel ai-insight-card">
          <div className="ai-insight-orb"><Bot size={21}/><Sparkles size={11}/></div>
          <div>
            <p className="panel-kicker">INTELLIGENCE IMMOBILIER AI</p>
            <h2>Votre recouvrement peut progresser de 4,7 points.</h2>
            <p>En relançant les 5 dossiers les plus anciens cette semaine, vous pourriez sécuriser jusqu’à <strong>1 865 000 FCFA</strong>.</p>
          </div>
          <Link href="/ai">Analyser avec l’IA <ArrowRight size={14}/></Link>
        </article>
      </section>

      <section className="dashboard-tertiary-grid">
        <article className="premium-panel portfolio-performance">
          <header className="premium-panel-head"><div><p className="panel-kicker">PORTEFEUILLE</p><h2>Biens les plus performants</h2></div><Link href="/properties">Tous les biens</Link></header>
          <div className="performance-table">
            <div className="performance-head"><span>Bien</span><span>Occupation</span><span>Revenu mensuel</span></div>
            {locations.map((item) => <Link href="/properties" key={item.name}><span className="property-identity"><i><Building2 size={16}/></i><span><b>{item.name}</b><small><MapPin size={11}/>{item.location} · {item.units}</small></span></span><span className="occupancy-progress"><b>{item.occupancy}</b><i><em style={{width: `${item.progress}%`}}/></i></span><strong>{item.revenue} <small>FCFA</small></strong></Link>)}
          </div>
        </article>

        <article className="premium-panel arrears-priority">
          <header className="premium-panel-head"><div><p className="panel-kicker">RECOUVREMENT</p><h2>Impayés prioritaires</h2></div><Link href="/arrears">Voir tout</Link></header>
          <div className="priority-list">
            {arrears.map((item) => <Link href="/arrears" key={item.name}><i className="priority-avatar">{item.initials}</i><span><b>{item.name}</b><small>{item.property}</small></span><strong>{item.amount} <small>FCFA</small></strong><em className={item.critical ? "critical" : ""}>{item.delay}</em></Link>)}
          </div>
          <div className="arrears-total"><span><CheckCircle2 size={15}/> 86,3 % du mois déjà recouvré</span><b>2,53 M FCFA restants</b></div>
        </article>
      </section>

      <section className="dashboard-export-note">
        <FileSpreadsheet size={18}/><span><b>Rapport mensuel prêt</b><small>Les données d’août sont consolidées et disponibles à l’export.</small></span><Link href="/reports">Ouvrir le rapport <ArrowRight size={14}/></Link>
      </section>
    </div>
  );
}
