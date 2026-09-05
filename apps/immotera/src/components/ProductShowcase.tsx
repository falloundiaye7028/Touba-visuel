"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";
import { trackPublicEvent } from "@/components/LandingAnalytics";

const views = [
  { id: "dashboard", label: "Dashboard", image: "/product/dashboard.jpg", title: "La situation complète, dès l’ouverture.", description: "Indicateurs, encaissements, occupation et priorités sont réunis dans une vue opérationnelle.", points: ["5 KPI de pilotage", "Centre d’actions", "Analyse financière"], mobile: ["91,4 %", "Occupation"] },
  { id: "properties", label: "Biens", image: "/product/properties.jpg", title: "Pilotez chaque actif avec précision.", description: "Retrouvez disponibilité, propriétaire, loyer et occupation sans recouper plusieurs fichiers.", points: ["Immeubles et unités", "Statuts et filtres", "Fiches détaillées"], mobile: ["24", "Biens suivis"] },
  { id: "payments", label: "Paiements", image: "/product/payments.jpg", title: "Gardez une vision claire de chaque encaissement.", description: "Les paiements restent rapprochés de la bonne période et du bon dossier locataire.", points: ["Suivi des loyers", "Paiements partiels", "Quittances et reçus"], mobile: ["86,3 %", "Recouvrement"] },
  { id: "owners", label: "Propriétaires", image: "/product/owners.jpg", title: "Rendez chaque reversement explicable.", description: "Biens, encaissements, dépenses et net propriétaire sont consolidés dans une même vue.", points: ["Portefeuille propriétaire", "Dépenses rapprochées", "Net à reverser"], mobile: ["3,24 M", "Net à reverser"] },
  { id: "crm", label: "CRM", image: "/product/crm.jpg", title: "Transformez les demandes en prochaines actions.", description: "Suivez budget, critères, visites et progression commerciale jusqu’à la signature.", points: ["Pipeline immobilier", "Visites et relances", "Matching déterministe"], mobile: ["92 %", "Compatibilité"] },
  { id: "maintenance", label: "Maintenance", image: "/product/maintenance.jpg", title: "Traitez les incidents avant qu’ils ne s’installent.", description: "Priorisez les tickets et suivez prestataires, coûts, délais et statuts.", points: ["Tickets priorisés", "Prestataires assignés", "Coûts suivis"], mobile: ["3", "Tickets urgents"] },
  { id: "ai", label: "Intelligence AI", image: "/product/ai.jpg", title: "Passez de la question à l’action.", description: "Interrogez les données autorisées et obtenez une synthèse métier directement exploitable.", points: ["Analyse contrôlée", "Priorités explicites", "Actions à valider"], mobile: ["5", "Analyses métier"] },
] as const;

type ViewId = (typeof views)[number]["id"];

export function ProductShowcase() {
  const [activeId, setActiveId] = useState<ViewId>("dashboard");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = views.find((view) => view.id === activeId) ?? views[0];

  const select = (id: ViewId) => {
    setActiveId(id);
    trackPublicEvent("product_demo_tab", id);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? views.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + views.length) % views.length;
    select(views[next].id);
    tabRefs.current[next]?.focus();
  };

  return <section className="ii-product-showcase-v3" id="produit">
    <div className="ii-section-heading">
      <p className="ii-kicker">LE PRODUIT EN CONDITIONS RÉELLES</p>
      <h2>Découvrez<br/><em>Intelligence Immobilier.</em></h2>
      <p>Une seule plateforme pour piloter l’ensemble de votre activité immobilière.</p>
    </div>
    <div className="ii-product-tabs" role="tablist" aria-label="Interfaces du produit">
      {views.map((view,index) => <button ref={(node)=>{tabRefs.current[index]=node}} key={view.id} type="button" role="tab" tabIndex={view.id === activeId ? 0 : -1} aria-selected={view.id === activeId} aria-controls={`product-panel-${view.id}`} id={`product-tab-${view.id}`} onKeyDown={(event)=>onKeyDown(event,index)} onClick={() => select(view.id)}>{view.label}</button>)}
    </div>
    <article className="ii-product-stage" role="tabpanel" id={`product-panel-${active.id}`} aria-labelledby={`product-tab-${active.id}`}>
      <div className="ii-product-screen" key={active.id}>
        <span className="ii-demo-badge">DONNÉES DE DÉMONSTRATION</span>
        <div className="ii-screen-chrome" aria-hidden="true"><i/><i/><i/><span>{active.label}</span></div>
        <Image src={active.image} alt={`Interface réelle du module ${active.label} d’Intelligence Immobilier`} fill sizes="(max-width: 780px) 92vw, (max-width: 1050px) 90vw, 68vw" priority={active.id === "dashboard"}/>
        <div className="ii-product-mobile-summary"><strong>{active.mobile[0]}</strong><span>{active.mobile[1]}</span></div>
      </div>
      <div className="ii-product-detail">
        <p className="ii-kicker">{active.label.toUpperCase()}</p>
        <h3>{active.title}</h3>
        <p>{active.description}</p>
        <ul>{active.points.map((point) => <li key={point}><Check size={15}/>{point}</li>)}</ul>
        <Link href="/demo" data-analytics="hero_demo" data-analytics-label={active.id}>Explorer la démo <ExternalLink size={15}/></Link>
      </div>
    </article>
    <Link className="ii-product-detail-link" href="/properties/PROP-004">Voir une fiche bien détaillée <ArrowRight size={14}/></Link>
  </section>;
}
