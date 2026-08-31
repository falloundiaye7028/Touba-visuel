import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  CircleDollarSign,
  FileSpreadsheet,
  House,
  KeyRound,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "INTELLIGENCE IMMOBILIER — La plateforme intelligente de gestion immobilière.",
  description: "Gérez votre patrimoine immobilier, vos loyers et vos opérations depuis une plateforme claire, sécurisée et enrichie par l’intelligence métier.",
  robots: { index: true, follow: true },
};

const features = [
  { icon: Building2, title: "Patrimoine unifié", text: "Biens, immeubles, unités et documents dans une base immobilière fiable." },
  { icon: WalletCards, title: "Gestion locative", text: "Contrats, échéances, paiements, quittances et impayés toujours à jour." },
  { icon: Users, title: "Relations maîtrisées", text: "Propriétaires, locataires, prospects et fournisseurs dans un même flux." },
  { icon: Bot, title: "Intelligence métier", text: "Des réponses utiles issues de vos données, avec des accès strictement contrôlés." },
];

const capabilities = [
  [House, "Biens & unités"],
  [KeyRound, "Contrats & locataires"],
  [CircleDollarSign, "Finance & recouvrement"],
  [Wrench, "Maintenance"],
  [FileSpreadsheet, "Rapports & imports"],
  [Bot, "Assistant IA"],
] as const;

export default function LandingPage() {
  return (
    <main className="ii-landing">
      <section className="ii-hero-shell">
        <header className="ii-landing-nav">
          <Link href="/" aria-label="INTELLIGENCE IMMOBILIER — Accueil"><BrandLogo variant="wordmark" light priority /></Link>
          <nav aria-label="Navigation du site"><a href="#solution">Solution</a><a href="#intelligence">Intelligence AI</a><a href="#securite">Sécurité</a><a href="#tarifs">Tarifs</a></nav>
          <div><Link href="/login" className="ii-nav-login">Se connecter</Link><Link href="/register" className="ii-button compact">Commencer</Link></div>
          <button className="ii-menu-button" aria-label="Ouvrir le menu"><Menu size={20}/></button>
        </header>

        <div className="ii-hero">
          <div className="ii-hero-copy">
            <p className="ii-kicker"><Sparkles size={14}/> PILOTAGE IMMOBILIER, AUGMENTÉ</p>
            <h1>Gérez votre immobilier.<br/><em>L’intelligence fait le reste.</em></h1>
            <p>Centralisez vos biens, loyers, propriétaires, locataires et opérations. Détectez les priorités, sécurisez vos revenus et décidez avec une vision claire.</p>
            <div className="ii-hero-actions"><Link href="/register" className="ii-button">Commencer gratuitement <ArrowRight size={16}/></Link><a href="mailto:contact@intelligenceimmobilier.com" className="ii-button ghost">Demander une démo</a></div>
            <span><ShieldCheck size={14}/> Aucune carte requise · Données isolées par organisation</span>
          </div>

          <div className="ii-hero-visual" aria-label="Aperçu de la plateforme">
            <div className="ii-brand-halo"/>
            <BrandLogo variant="full" className="ii-official-hero-logo" priority />
            <div className="ii-dashboard-preview">
              <header><span/><span/><span/><b>TABLEAU DE BORD</b></header>
              <aside><i/><i/><i/><i/><i/></aside>
              <section>
                <div className="ii-preview-heading"><span>Bonjour Mamadou</span><small>Situation de votre portefeuille</small></div>
                <div className="ii-preview-kpis"><i/><i/><i/><i/></div>
                <div className="ii-preview-chart"><b>15,92 M FCFA encaissés</b><div>{[46,61,57,74,69,88,80,95].map((height) => <i key={height} style={{height: `${height}%`}}/>)}</div></div>
              </section>
            </div>
            <div className="ii-floating-metric metric-one"><i><BarChart3 size={16}/></i><span><small>Occupation</small><b>91,4 %</b></span></div>
            <div className="ii-floating-metric metric-two"><i><Check size={16}/></i><span><small>Paiement reçu</small><b>850 000 FCFA</b></span></div>
          </div>
        </div>

        <div className="ii-trust-strip"><span>128 biens pilotés</span><i/><span>117 unités occupées</span><i/><span>15,92 M FCFA encaissés</span><i/><span>Une seule source de vérité</span></div>
      </section>

      <section className="ii-capabilities" aria-label="Fonctionnalités principales">
        {capabilities.map(([Icon, label]) => <span key={label}><Icon size={16}/>{label}</span>)}
      </section>

      <section className="ii-solution" id="solution">
        <div className="ii-section-heading"><p className="ii-kicker">UNE PLATEFORME, TOUTE VOTRE ACTIVITÉ</p><h2>Du portefeuille à l’encaissement,<br/><em>gardez une longueur d’avance.</em></h2><p>Chaque opération importante devient visible, traçable et actionnable.</p></div>
        <div className="ii-feature-grid">{features.map((feature, index) => <article key={feature.title}><span>0{index + 1}</span><i><feature.icon size={22}/></i><h3>{feature.title}</h3><p>{feature.text}</p><a href="#intelligence">Découvrir <ArrowRight size={14}/></a></article>)}</div>
      </section>

      <section className="ii-ai-section" id="intelligence">
        <div>
          <p className="ii-kicker"><Sparkles size={13}/> INTELLIGENCE IMMOBILIER AI</p>
          <h2>Posez une question.<br/><em>Obtenez une décision.</em></h2>
          <p>L’assistant analyse uniquement les données métier autorisées de votre organisation. Il transforme les loyers, contrats, vacances et incidents en prochaines actions claires.</p>
          <div className="ii-prompt-pills"><span>Quels loyers dois-je relancer ?</span><span>Quels contrats expirent bientôt ?</span><span>Quels biens sous-performent ?</span></div>
          <Link href="/register" className="ii-button light">Essayer l’assistant <ArrowRight size={16}/></Link>
        </div>
        <aside className="ii-ai-demo">
          <header><i><Bot size={20}/></i><span><b>Intelligence Immobilier AI</b><small>Connecté à vos outils métier · Lecture sécurisée</small></span><em>EN LIGNE</em></header>
          <div className="ii-ai-question">Quels dossiers dois-je traiter en priorité cette semaine ?</div>
          <div className="ii-ai-answer"><i><Sparkles size={17}/></i><p><b>5 dossiers peuvent sécuriser 1 865 000 FCFA.</b><span>Commencez par Ibrahima Ba, en retard de 34 jours, puis les deux contrats arrivant à échéance sous 15 jours.</span></p></div>
          <footer><ShieldCheck size={14}/> Sources métier vérifiées · Aucune requête SQL libre</footer>
        </aside>
      </section>

      <section className="ii-security" id="securite">
        <div><p className="ii-kicker">LA CONFIANCE PAR CONCEPTION</p><h2>Vos données sont protégées.<br/><em>Votre équipe reste en contrôle.</em></h2><p>Une architecture pensée pour la confidentialité, la traçabilité et la maîtrise des accès.</p></div>
        <div className="ii-security-list"><span><i><Check/></i><b>Isolation par organisation</b><small>Chaque portefeuille reste strictement séparé.</small></span><span><i><Check/></i><b>Permissions côté serveur</b><small>Les rôles contrôlent chaque action sensible.</small></span><span><i><Check/></i><b>Traçabilité complète</b><small>Les opérations critiques restent auditables.</small></span><span><i><Check/></i><b>Documents privés</b><small>Liens temporaires et accès maîtrisés.</small></span></div>
      </section>

      <section className="ii-pricing" id="tarifs">
        <div className="ii-section-heading"><p className="ii-kicker">DES PLANS ADAPTÉS À VOTRE CROISSANCE</p><h2>Commencez simplement.</h2><p>Une base professionnelle aujourd’hui, une plateforme capable de grandir demain.</p></div>
        <div className="ii-pricing-grid">
          <article><p>SOLO</p><h3>19 900 <small>FCFA / mois</small></h3><span>Pour le gestionnaire indépendant.</span><ul><li><Check/>Jusqu’à 20 biens</li><li><Check/>Gestion locative complète</li><li><Check/>Imports et rapports</li></ul><Link href="/register">Démarrer</Link></article>
          <article className="featured"><em>LE PLUS CHOISI</em><p>AGENCE</p><h3>49 900 <small>FCFA / mois</small></h3><span>Pour une équipe immobilière structurée.</span><ul><li><Check/>Jusqu’à 150 biens</li><li><Check/>10 collaborateurs</li><li><Check/>Intelligence Immobilier AI</li></ul><Link href="/register">Essayer gratuitement</Link></article>
          <article><p>ENTREPRISE</p><h3>Sur mesure</h3><span>Pour les grands portefeuilles.</span><ul><li><Check/>Biens illimités</li><li><Check/>API et intégrations</li><li><Check/>Accompagnement dédié</li></ul><a href="mailto:contact@intelligenceimmobilier.com">Nous contacter</a></article>
        </div>
      </section>

      <section className="ii-final-cta"><BrandLogo variant="symbol" light/><p className="ii-kicker">PRÊT À PILOTER AUTREMENT ?</p><h2>Votre immobilier mérite<br/>une intelligence à sa hauteur.</h2><p>Créez votre espace et réunissez enfin toutes vos opérations dans une plateforme claire.</p><Link href="/register" className="ii-button light">Créer mon espace <ArrowRight size={16}/></Link></section>
      <footer className="ii-footer"><BrandLogo variant="wordmark"/><p>© 2026 INTELLIGENCE IMMOBILIER. Tous droits réservés.</p><nav><a href="#securite">Sécurité</a><a href="#tarifs">Tarifs</a><a href="mailto:contact@intelligenceimmobilier.com">Contact</a></nav></footer>
    </main>
  );
}
