"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { trackPublicEvent } from "@/components/LandingAnalytics";

const views = [
  { id: "dashboard", label: "Dashboard", image: "/product/dashboard.jpg", title: "La situation complète, dès l’ouverture", description: "Indicateurs, encaissements, occupation et priorités sont réunis dans une vue opérationnelle.", points: ["5 KPI de pilotage", "Centre d’actions", "Analyse financière"], href: "/dashboard" },
  { id: "properties", label: "Biens", image: "/product/properties.jpg", title: "Un portefeuille structuré et actionnable", description: "Retrouvez chaque bien, sa disponibilité, son propriétaire, son loyer et son taux d’occupation.", points: ["Immeubles et unités", "Statuts et filtres", "Fiches détaillées"], href: "/properties" },
  { id: "owners", label: "Propriétaires", image: "/product/owners.jpg", title: "Une relation propriétaire plus transparente", description: "Consolidez patrimoine, encaissements, dépenses et reversements dans un même espace.", points: ["Portefeuille par propriétaire", "Solde à reverser", "Historique consolidé"], href: "/owners" },
  { id: "tenants", label: "Locataires", image: "/product/tenants.jpg", title: "Des dossiers locataires toujours lisibles", description: "Centralisez les coordonnées, contrats, biens occupés et historiques de paiement.", points: ["Dossiers centralisés", "Contrats associés", "Statut de paiement"], href: "/tenants" },
  { id: "payments", label: "Paiements", image: "/product/payments.jpg", title: "Les encaissements rapprochés des bons dossiers", description: "Suivez les paiements enregistrés, leur mode, leur période et leur justificatif.", points: ["Paiements et quittances", "Impayés prioritaires", "Modes de règlement"], href: "/payments" },
  { id: "crm", label: "CRM", image: "/product/crm.jpg", title: "Chaque demande avance vers la signature", description: "Suivez les prospects, leur budget, leurs critères et la prochaine action commerciale.", points: ["Pipeline immobilier", "Visites et relances", "Matching déterministe"], href: "/leads" },
  { id: "maintenance", label: "Maintenance", image: "/product/maintenance.jpg", title: "Les incidents ne se perdent plus", description: "Priorisez les tickets, assignez les prestataires et suivez coûts, délais et statuts.", points: ["Tickets priorisés", "Prestataires assignés", "Coûts suivis"], href: "/maintenance" },
  { id: "ai", label: "Intelligence AI", image: "/product/ai.jpg", title: "L’information métier devient une prochaine action", description: "Interrogez les données autorisées de l’organisation et obtenez une synthèse exploitable.", points: ["Outils métier contrôlés", "Périmètre organisationnel", "Actions à valider"], href: "/ai" },
] as const;

export function ProductShowcase() {
  const [activeId, setActiveId] = useState<(typeof views)[number]["id"]>("dashboard");
  const active = views.find((view) => view.id === activeId) ?? views[0];

  const select = (id: (typeof views)[number]["id"]) => {
    setActiveId(id);
    trackPublicEvent("product_demo_tab", id);
  };

  return <section className="ii-product-showcase-v2" id="produit">
    <div className="ii-section-heading">
      <p className="ii-kicker">LE PRODUIT EN CONDITIONS RÉELLES</p>
      <h2>Découvrez<br/><em>Intelligence Immobilier.</em></h2>
      <p>Une seule plateforme pour piloter l’ensemble de votre activité immobilière.</p>
    </div>
    <div className="ii-product-tabs" role="tablist" aria-label="Interfaces du produit">
      {views.map((view) => <button key={view.id} type="button" role="tab" aria-selected={view.id === activeId} aria-controls={`product-panel-${view.id}`} id={`product-tab-${view.id}`} onClick={() => select(view.id)}>{view.label}</button>)}
    </div>
    <article className="ii-product-stage" role="tabpanel" id={`product-panel-${active.id}`} aria-labelledby={`product-tab-${active.id}`}>
      <div className="ii-product-screen">
        <span className="ii-demo-badge">DONNÉES DE DÉMONSTRATION</span>
        <Image src={active.image} alt={`Interface réelle du module ${active.label} d’Intelligence Immobilier`} fill sizes="(max-width: 800px) 100vw, 68vw" priority={active.id === "dashboard"}/>
      </div>
      <div className="ii-product-detail">
        <p className="ii-kicker">{active.label.toUpperCase()}</p>
        <h3>{active.title}</h3>
        <p>{active.description}</p>
        <ul>{active.points.map((point) => <li key={point}><Check size={15}/>{point}</li>)}</ul>
        <Link href="/demo" data-analytics="hero_demo" data-analytics-label={active.id}>Explorer un environnement de démonstration <ExternalLink size={15}/></Link>
      </div>
    </article>
    <Link className="ii-product-detail-link" href="/properties/PROP-004">Voir aussi une fiche bien détaillée <ArrowRight size={14}/></Link>
  </section>;
}
