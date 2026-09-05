"use client";

import { AlertTriangle, ArrowRight, Building2, CalendarClock, CheckCircle2, CircleDollarSign, Sparkles, Users, Wrench } from "lucide-react";
import { useState } from "react";
import { trackPublicEvent } from "@/components/LandingAnalytics";

const scenarios = [
  { id: "priorities", question: "Quels dossiers dois-je traiter aujourd’hui ?", action: "Voir les priorités" },
  { id: "arrears", question: "Quels locataires dois-je relancer ?", action: "Préparer les relances" },
  { id: "vacancy", question: "Quels biens restent vacants ?", action: "Ouvrir les biens" },
  { id: "owners", question: "Prépare les reversements propriétaires", action: "Contrôler les reversements" },
] as const;

function ScenarioResult({ id }: { id: (typeof scenarios)[number]["id"] }) {
  if (id === "priorities") return <div className="ii-ai-result-grid">{[[CircleDollarSign,"12","Loyers en retard"],[CalendarClock,"5","Contrats à échéance"],[Wrench,"3","Interventions urgentes"],[CheckCircle2,"2","Reversements à valider"]].map(([Icon,value,label]) => { const I=Icon as typeof CircleDollarSign; return <span key={String(label)}><i><I size={16}/></i><b>{String(value)}</b><small>{String(label)}</small></span>; })}</div>;
  if (id === "arrears") return <div className="ii-ai-table"><header><span>Locataire</span><span>Retard</span><span>Solde</span></header>{[["Ibrahima Ba","34 jours","1 200 000"],["Abdoulaye Seck","18 jours","450 000"],["Fatou Ndiaye","12 jours","325 000"]].map(row=><div key={row[0]}><span><Users size={14}/>{row[0]}</span><em>{row[1]}</em><b>{row[2]} FCFA</b></div>)}<footer><span>3 personnes concernées</span><strong>1 975 000 FCFA</strong></footer></div>;
  if (id === "vacancy") return <div className="ii-ai-table ii-ai-vacancy"><header><span>Bien</span><span>Vacance</span><span>Loyer</span></header>{[["Appartement Mamelles B2","41 jours","550 000"],["Résidence Mermoz — U08","32 jours","575 000"]].map(row=><div key={row[0]}><span><Building2 size={14}/>{row[0]}</span><em>{row[1]}</em><b>{row[2]} FCFA</b></div>)}<footer><span>Potentiel mensuel</span><strong>1 125 000 FCFA</strong></footer></div>;
  return <div className="ii-ai-owner-result"><div><span>Encaissé</span><b>3 850 000 FCFA</b></div><div><span>Dépenses</span><b>225 000 FCFA</b></div><div><span>Commissions</span><b>385 000 FCFA</b></div><footer><span>Net à reverser</span><strong>3 240 000 FCFA</strong></footer></div>;
}

export function AiMarketingDemo() {
  const [activeId, setActiveId] = useState<(typeof scenarios)[number]["id"]>("priorities");
  const active = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0];
  const select = (id: (typeof scenarios)[number]["id"]) => { setActiveId(id); trackPublicEvent("ai_demo_interaction", id); };

  return <section className="ii-ai-section-v2" id="intelligence">
    <div className="ii-ai-v2-copy"><p className="ii-kicker"><Sparkles size={14}/>INTELLIGENCE IMMOBILIER AI</p><h2>Votre copilote<br/><em>immobilier.</em></h2><p>Interrogez votre activité. Intelligence Immobilier transforme vos données en actions.</p><div className="ii-ai-proof"><AlertTriangle size={16}/><span>Démonstration UI — les actions sensibles restent soumises aux droits et à une validation.</span></div></div>
    <div className="ii-ai-console">
      <header><span><Sparkles size={17}/></span><div><b>Analyse opérationnelle</b><small>Données de démonstration · Accès métier contrôlé</small></div></header>
      <div className="ii-ai-scenario-tabs" role="tablist" aria-label="Scénarios Intelligence AI">{scenarios.map((scenario,index)=><button key={scenario.id} type="button" role="tab" aria-selected={scenario.id===activeId} onClick={()=>select(scenario.id)}><span>0{index+1}</span>{scenario.question}</button>)}</div>
      <section className="ii-ai-answer" aria-live="polite"><p><Sparkles size={14}/>{active.question}</p><ScenarioResult id={active.id}/><button type="button" onClick={()=>trackPublicEvent("ai_demo_interaction",`${active.id}_action`)}>{active.action}<ArrowRight size={14}/></button></section>
    </div>
  </section>;
}
