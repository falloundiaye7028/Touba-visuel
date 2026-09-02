"use client";

import { AlertTriangle, ArrowRight, Building2, CalendarClock, CheckCircle2, CircleDollarSign, FileCheck2, Sparkles, Users, Wrench } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { trackPublicEvent } from "@/components/LandingAnalytics";

const scenarios = [
  { id: "priorities", question: "Quels dossiers dois-je traiter aujourd’hui ?", action: "Voir les priorités" },
  { id: "arrears", question: "Quels loyers sont en retard ?", action: "Voir les impayés", secondary: "Préparer les relances" },
  { id: "contracts", question: "Quels contrats expirent bientôt ?", action: "Examiner les contrats" },
  { id: "vacancy", question: "Quels biens restent vacants ?", action: "Ouvrir les biens" },
  { id: "owners", question: "Prépare les reversements propriétaires.", action: "Contrôler les reversements" },
] as const;
type ScenarioId = (typeof scenarios)[number]["id"];

function ScenarioResult({ id }: { id: ScenarioId }) {
  if (id === "priorities") return <div className="ii-ai-result-grid">{[[CircleDollarSign,"12","Loyers à relancer"],[CalendarClock,"5","Contrats à renouveler"],[Wrench,"3","Interventions urgentes"],[CheckCircle2,"2","Reversements à valider"]].map(([Icon,value,label]) => { const I=Icon as typeof CircleDollarSign; return <span key={String(label)}><i><I size={16}/></i><b>{String(value)}</b><small>{String(label)}</small></span>; })}</div>;
  if (id === "arrears") return <div className="ii-ai-arrears"><div className="ii-ai-kpi-strip"><span><small>Impayés</small><b>2 530 000 FCFA</b></span><span><small>Locataires</small><b>12</b></span><span><small>Retard &gt; 30 jours</small><b>3</b></span></div><div className="ii-ai-table"><header><span>Locataire</span><span>Retard</span><span>Solde</span></header>{[["Ibrahima Ba","34 jours","1 200 000"],["Abdoulaye Seck","18 jours","450 000"],["Fatou Ndiaye","12 jours","325 000"]].map(row=><div key={row[0]}><span><Users size={14}/>{row[0]}</span><em>{row[1]}</em><b>{row[2]} FCFA</b></div>)}</div></div>;
  if (id === "contracts") return <div className="ii-ai-contract-list"><div className="urgent"><CalendarClock size={17}/><span><b>BAIL-2025-009</b><small>Expire demain · Bureau Horizon</small></span><em>Décision requise</em></div><div><FileCheck2 size={17}/><span><b>BAIL-2025-014</b><small>Expire dans 18 jours · Villa Ndar</small></span><em>Préparer le renouvellement</em></div><div><FileCheck2 size={17}/><span><b>BAIL-2025-022</b><small>Expire dans 43 jours · Studio Point E</small></span><em>À planifier</em></div></div>;
  if (id === "vacancy") return <div className="ii-ai-property-cards">{[["Appartement Mamelles B2","41 jours","550 000","Relancer la diffusion"],["Résidence Mermoz — U08","32 jours","575 000","Proposer aux prospects"]].map(row=><article key={row[0]}><i><Building2 size={17}/></i><div><b>{row[0]}</b><small>{row[1]} de vacance</small></div><strong>{row[2]} <small>FCFA / mois</small></strong><span>{row[3]} <ArrowRight size={12}/></span></article>)}</div>;
  return <div className="ii-ai-owner-result"><div><span>Encaissé</span><b>3 850 000 FCFA</b><i style={{width:"100%"}}/></div><div><span>Dépenses</span><b>225 000 FCFA</b><i style={{width:"18%"}}/></div><div><span>Commissions</span><b>385 000 FCFA</b><i style={{width:"27%"}}/></div><footer><span>Net à reverser</span><strong>3 240 000 FCFA</strong></footer></div>;
}

export function AiMarketingDemo() {
  const [activeId, setActiveId] = useState<ScenarioId>("priorities");
  const [loading, setLoading] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0];

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [activeId, loading]);

  const select = (id: ScenarioId) => { setActiveId(id); setLoading(true); trackPublicEvent("ai_demo_interaction", id); };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? scenarios.length - 1 : (index + ([ "ArrowRight", "ArrowDown" ].includes(event.key) ? 1 : -1) + scenarios.length) % scenarios.length;
    select(scenarios[next].id);
    tabRefs.current[next]?.focus();
  };

  return <section className="ii-ai-section-v3" id="intelligence">
    <div className="ii-ai-v2-copy"><p className="ii-kicker"><Sparkles size={14}/>INTELLIGENCE IMMOBILIER AI</p><h2>Votre copilote<br/><em>immobilier.</em></h2><p>Détecter. Analyser. Prioriser. Recommander. Agir.</p><div className="ii-ai-flow" aria-label="Question, analyse, résultat, action"><span>Question</span><i>↓</i><span>Analyse</span><i>↓</i><span>Résultat</span><i>↓</i><span>Action</span></div><div className="ii-ai-proof"><AlertTriangle size={16}/><span>Démonstration UI — les actions sensibles restent soumises aux droits et à une validation.</span></div></div>
    <div className="ii-ai-console">
      <header><span><Sparkles size={17}/></span><div><b>Analyse opérationnelle</b><small>Données de démonstration · Accès métier contrôlé</small></div></header>
      <div className="ii-ai-scenario-tabs" role="tablist" aria-label="Questions Intelligence AI">{scenarios.map((scenario,index)=><button ref={(node)=>{tabRefs.current[index]=node}} key={scenario.id} type="button" role="tab" tabIndex={scenario.id===activeId?0:-1} aria-selected={scenario.id===activeId} aria-controls="ai-result-panel" onKeyDown={(event)=>onKeyDown(event,index)} onClick={()=>select(scenario.id)}><span>0{index+1}</span>{scenario.question}</button>)}</div>
      <section className="ii-ai-answer" id="ai-result-panel" role="tabpanel" aria-live="polite"><p><Sparkles size={14}/>{active.question}</p>{loading?<div className="ii-ai-skeleton" role="status" aria-label="Analyse en cours"><i/><i/><i/></div>:<div className="ii-ai-result-enter"><ScenarioResult id={active.id}/></div>}<div className="ii-ai-actions"><button type="button" onClick={()=>trackPublicEvent("ai_demo_interaction",`${active.id}_action`)}>{active.action}<ArrowRight size={14}/></button>{"secondary" in active&&active.secondary?<button className="secondary" type="button" onClick={()=>trackPublicEvent("ai_demo_interaction",`${active.id}_secondary`)}>{active.secondary}</button>:null}</div></section>
    </div>
  </section>;
}
