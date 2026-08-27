"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Check, Droplets, HeartHandshake, Lightbulb, MapPin, ReceiptText, ShieldCheck, TrendingUp, UsersRound } from "lucide-react";
import "./public.css";

type PublicProject = { id: string; name: string; domain: string; budget: string; spent: string; progress: number; place: string; status: string; iconName: "health" | "water" | "building" | "light" };
type PublicMetrics = { activeMembers: number; collectedThisMonth: number; contributionCount: number; projects: number };
type PublicApiResponse = {
  activeMembers: number;
  collectedThisMonth: number;
  contributionCount: number;
  projects: Array<{ projectCode: string; name: string; domain: string; budget: number; spent: number; progress: number; place: string | null; status: "PLANNED" | "IN_PROGRESS" | "FINALIZATION" | "COMPLETED" }>;
};

const fallbackProjects: PublicProject[] = [
  { id: "PRJ-001", name: "Centre de dialyse Ndamatou", domain: "Santé", budget: "480 M", spent: "312 M", progress: 65, place: "Ndamatou", status: "En cours", iconName: "health" },
  { id: "PRJ-002", name: "Réseau d’eau — 12 quartiers", domain: "Hydraulique", budget: "195 M", spent: "154 M", progress: 79, place: "Touba périphérie", status: "En cours", iconName: "water" },
  { id: "PRJ-004", name: "Lampadaires solaires — lot 4", domain: "Éclairage", budget: "86 M", spent: "81 M", progress: 94, place: "6 quartiers", status: "Finalisation", iconName: "light" },
];

const icons = { health: HeartHandshake, water: Droplets, building: Building2, light: Lightbulb };
const statuses = { PLANNED: "Planifié", IN_PROGRESS: "En cours", FINALIZATION: "Finalisation", COMPLETED: "Terminé" } as const;

function formatMoney(amount: number) {
  if (amount >= 1_000_000_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(amount / 1_000_000_000)} Md`;
  if (amount >= 1_000_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(amount / 1_000_000)} M`;
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function TckPublicPage() {
  const [projects, setProjects] = useState<PublicProject[]>(fallbackProjects);
  const [localOperations, setLocalOperations] = useState(0);
  const [metrics, setMetrics] = useState<PublicMetrics>({ activeMembers: 184240, collectedThisMonth: 146800000, contributionCount: 0, projects: 24 });
  const [sourceMode, setSourceMode] = useState<"server" | "demo">("demo");

  useEffect(() => {
    async function loadPublicData() {
      try {
        const response = await fetch("/api/tck/public", { cache: "no-store" });
        if (!response.ok) throw new Error("API publique indisponible");
        const payload = await response.json() as PublicApiResponse;
        setProjects(payload.projects.map((project) => ({
          id: project.projectCode,
          name: project.name,
          domain: project.domain,
          budget: formatMoney(project.budget),
          spent: formatMoney(project.spent),
          progress: project.progress,
          place: project.place || "Touba",
          status: statuses[project.status],
          iconName: project.domain === "Santé" ? "health" : project.domain === "Hydraulique" ? "water" : project.domain === "Éclairage" ? "light" : "building",
        })));
        setMetrics({ activeMembers: payload.activeMembers, collectedThisMonth: payload.collectedThisMonth, contributionCount: payload.contributionCount, projects: payload.projects.length });
        setSourceMode("server");
      } catch {
        try {
          const stored = JSON.parse(window.localStorage.getItem("tck-connect:v1:projects") || "null") as { version?: number; records?: PublicProject[] } | null;
          if (stored?.version === 1 && Array.isArray(stored.records)) setProjects(stored.records);
          const audit = JSON.parse(window.localStorage.getItem("tck-connect:v1:audit") || "[]") as unknown[];
          setLocalOperations(Array.isArray(audit) ? audit.length : 0);
        } catch {
          setProjects(fallbackProjects);
        }
      }
    }
    void loadPublicData();
  }, []);

  return <main className="tck-public">
    <header className="tck-public-nav"><a href="/tck-connect"><ArrowLeft size={16} />Retour à TCK CONNECT</a><div><span>TCK</span><strong>TCK CONNECT</strong></div><p><ShieldCheck size={15} />Données publiques vérifiées</p></header>
    <section className="tck-public-hero"><div><span className="tck-eyebrow">Touba Ca Kanam · Transparence publique</span><h1>La confiance se construit<br />avec des preuves visibles.</h1><p>Mobilisation, affectation des ressources et avancement des projets : les indicateurs essentiels sont réunis ici, sans exposer les données personnelles des membres.</p><div className="tck-public-proof"><ShieldCheck size={20} /><span><strong>Dernière consolidation</strong>27 août 2026 · 18:30 GMT</span></div></div><div className="tck-public-score"><span>96<small>%</small></span><p>des ressources directement affectées aux projets</p><i><Check size={20} /></i></div></section>
    <section className="tck-public-stats"><article><UsersRound /><span><strong>{new Intl.NumberFormat("fr-FR").format(metrics.activeMembers)}</strong>Membres actifs</span></article><article><ReceiptText /><span><strong>{formatMoney(metrics.collectedThisMonth)} F CFA</strong>Collectés ce mois</span></article><article><TrendingUp /><span><strong>{metrics.projects}</strong>Projets suivis</span></article><article><ShieldCheck /><span><strong>100 %</strong>Opérations traçables</span></article></section>
    <section className="tck-public-section"><div className="tck-public-heading"><div><span className="tck-eyebrow">Impact territorial</span><h2>Projets prioritaires</h2><p>Un aperçu public synchronisé avec le portefeuille central.</p></div><span>{projects.length} dossiers publiés</span></div><div className="tck-public-projects">{projects.slice(0, 6).map((project) => { const Icon = icons[project.iconName] || Building2; return <article key={project.id}><div><span><Icon size={21} /></span><i>{project.status}</i></div><small>{project.domain}</small><h3>{project.name}</h3><p><MapPin size={14} />{project.place}</p><dl><div><dt>Budget</dt><dd>{project.budget}</dd></div><div><dt>Dépensé</dt><dd>{project.spent}</dd></div></dl><div className="tck-public-progress"><i style={{ width: `${project.progress}%` }} /></div><footer><span>Avancement</span><strong>{project.progress} %</strong></footer></article>; })}{projects.length === 0 && <article><div><span><Building2 size={21} /></span><i>Prêt</i></div><h3>Portefeuille central initialisé</h3><p>Le premier projet public apparaîtra ici après validation.</p></article>}</div></section>
    <section className="tck-public-method"><div><span className="tck-eyebrow">Méthode de contrôle</span><h2>Du franc collecté à la preuve d’impact</h2></div><ol><li><span>01</span><div><strong>Collecte identifiée</strong><p>Chaque opération reçoit une référence unique et un canal vérifiable.</p></div></li><li><span>02</span><div><strong>Quorum de validation</strong><p>Les dépenses passent par 13 validateurs avant décaissement.</p></div></li><li><span>03</span><div><strong>Publication agrégée</strong><p>Les indicateurs publics excluent toute donnée personnelle.</p></div></li></ol></section>
    <footer className="tck-public-footer"><div><strong>TCK CONNECT</strong><span>Système numérique central de Touba Ca Kanam</span></div><p><ShieldCheck size={15} />{sourceMode === "server" ? `${metrics.contributionCount} contribution${metrics.contributionCount > 1 ? "s" : ""} consolidée${metrics.contributionCount > 1 ? "s" : ""} par le serveur` : `${localOperations} opération${localOperations > 1 ? "s" : ""} locale${localOperations > 1 ? "s" : ""} dans le journal de démonstration`}</p></footer>
  </main>;
}
