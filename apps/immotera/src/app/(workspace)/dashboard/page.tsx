import { ArrowDownRight, ArrowUpRight, CalendarDays, CircleDollarSign } from "lucide-react";
import Link from "next/link";

const kpis = [
  { label: "Revenus du mois", value: "8 450 000", unit: "FCFA", trend: "+12,5 %", positive: true, tone: "indigo" },
  { label: "Taux d’occupation", value: "91,7", unit: "%", trend: "+2,1 %", positive: true, tone: "teal" },
  { label: "Loyers impayés", value: "1 275 000", unit: "FCFA", trend: "−8,4 %", positive: true, tone: "amber" },
  { label: "À reverser", value: "6 820 000", unit: "FCFA", trend: "4 propriétaires", positive: null, tone: "violet" },
];

const payments = [
  ["AC", "Awa Cissé", "Villa Ndar · Août", "850 000", "Wave", "Payé"],
  ["MD", "Moussa Diop", "Apt. Mermoz A3", "475 000", "Virement", "Payé"],
  ["FN", "Fatou Ndiaye", "Studio Point E", "325 000", "Orange Money", "Partiel"],
  ["IB", "Ibrahima Ba", "Bureau Plateau", "1 200 000", "Chèque", "Payé"],
];

export default function DashboardPage() {
  return <div className="page-content">
    <div className="page-heading"><div><p className="eyebrow">DIMANCHE 30 AOÛT 2026</p><h1>Bonjour Mamadou<span>.</span></h1><p>Voici ce qui se passe aujourd’hui chez IntelligenceImmobilier Démo Dakar.</p></div><div className="heading-actions"><button className="button secondary"><CalendarDays size={16}/>Ce mois-ci</button><Link className="button primary" href="/payments?new=1">+ Nouveau paiement</Link></div></div>
    <section className="kpi-grid" aria-label="Indicateurs clés">{kpis.map((kpi) => <article className="kpi-card" key={kpi.label}><div className={`kpi-icon ${kpi.tone}`}><CircleDollarSign size={19}/></div><p>{kpi.label}</p><h2>{kpi.value} <span>{kpi.unit}</span></h2><div className={`trend ${kpi.positive ? "positive" : "neutral"}`}>{kpi.positive ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}<b>{kpi.trend}</b><span>depuis juillet</span></div></article>)}</section>
    <section className="dashboard-grid"><article className="panel revenue-panel"><div className="panel-head"><div><p className="panel-kicker">PERFORMANCE</p><h2>Encaissements</h2></div><button className="more">•••</button></div><div className="revenue-total"><b>42 680 000 <small>FCFA</small></b><span><ArrowUpRight size={13}/> +18,2 %</span></div><div className="chart" aria-label="Graphique des encaissements mensuels"><div className="y-axis"><span>10M</span><span>7,5M</span><span>5M</span><span>2,5M</span><span>0</span></div><div className="bars">{[43,58,52,72,65,89,79,94].map((height,index)=><div className="bar-wrap" key={index}><div className={`bar ${index===7?"current":""}`} style={{height:`${height}%`}}/><span>{["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû"][index]}</span></div>)}</div></div></article><article className="panel occupancy"><div className="panel-head"><div><p className="panel-kicker">PORTEFEUILLE</p><h2>Occupation</h2></div><button className="more">•••</button></div><div className="donut"><div><strong>91,7<small>%</small></strong><span>22 / 24 unités</span></div></div><div className="legend"><span><i className="occupied"/>Occupés <b>22</b></span><span><i className="vacant"/>Vacants <b>2</b></span><span><i className="maintenance"/>Maintenance <b>1</b></span></div></article></section>
    <section className="lower-grid"><article className="panel payments"><div className="panel-head"><div><p className="panel-kicker">DERNIÈRES OPÉRATIONS</p><h2>Paiements récents</h2></div><Link href="/payments">Voir tout →</Link></div><div className="payment-table"><div className="table-head"><span>Locataire</span><span>Bien & période</span><span>Montant</span><span>Mode</span><span>Statut</span></div>{payments.map(([initials,name,property,amount,method,status])=><div className="payment-row" key={name}><span className="tenant"><i>{initials}</i><b>{name}</b></span><span>{property}</span><strong>{amount} <small>FCFA</small></strong><span>{method}</span><em className={status === "Partiel" ? "partial" : "paid"}>{status}</em></div>)}</div></article><article className="panel alerts"><div className="panel-head"><div><p className="panel-kicker">À TRAITER</p><h2>Priorités</h2></div><span className="alert-count">6</span></div><Link className="alert-item urgent" href="/arrears"><i/><div><b>3 loyers en retard</b><span>1 275 000 FCFA à recouvrer</span></div><span>→</span></Link><Link className="alert-item warning" href="/contracts"><i/><div><b>2 contrats expirent bientôt</b><span>Dans les 30 prochains jours</span></div><span>→</span></Link><Link className="alert-item info" href="/maintenance"><i/><div><b>Maintenance urgente</b><span>Fuite d’eau · Villa Ndar</span></div><span>→</span></Link></article></section>
  </div>;
}
