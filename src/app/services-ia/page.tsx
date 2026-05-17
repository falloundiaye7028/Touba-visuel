"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */
interface Plan {
  nom: string;
  prix: string;
  badge: string;
  couleur: string;
  services: string[];
  cta: string;
  whatsapp: string;
  highlight?: boolean;
}

interface Service {
  emoji: string;
  titre: string;
  desc: string;
  details: string[];
  couleur: string;
}

interface Etape {
  num: string;
  titre: string;
  desc: string;
}

/* ── Data ───────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    emoji: "✍️",
    titre: "Création de contenu IA",
    desc: "Posts Instagram, Facebook, WhatsApp générés automatiquement — textes, légendes, hashtags, appels à l'action.",
    details: [
      "Captions optimisées par plateforme",
      "30 posts/mois générés automatiquement",
      "Adaptation à votre ton de marque",
      "Hashtags trending Sénégal & monde",
    ],
    couleur: "#ffc800",
  },
  {
    emoji: "📲",
    titre: "Gestion réseaux sociaux",
    desc: "Publication automatique, planning éditorial, modération des commentaires et statistiques en temps réel.",
    details: [
      "Calendrier éditorial automatisé",
      "Publication multi-plateforme",
      "Réponses auto aux commentaires fréquents",
      "Rapport mensuel de performance",
    ],
    couleur: "#22c55e",
  },
  {
    emoji: "🎯",
    titre: "Publicités Meta & Google IA",
    desc: "Campagnes ads créées, ciblées et optimisées par l'IA pour maximiser votre ROI au Sénégal et à l'international.",
    details: [
      "Ciblage IA ultra-précis",
      "A/B testing automatique",
      "Optimisation budget en temps réel",
      "Rapports ROI détaillés",
    ],
    couleur: "#3b82f6",
  },
  {
    emoji: "🤖",
    titre: "Chatbot IA 24/7",
    desc: "Assistant virtuel intelligent sur votre WhatsApp, site web ou Facebook — répond à vos clients à toute heure.",
    details: [
      "Répond en Wolof, Français, Anglais",
      "Prend les commandes automatiquement",
      "Qualification de leads automatisée",
      "Intégration WhatsApp Business",
    ],
    couleur: "#a855f7",
  },
  {
    emoji: "🎨",
    titre: "Design publicitaire IA",
    desc: "Visuels, flyers, stories et banners créés par IA en quelques secondes — prêts à publier.",
    details: [
      "Visuels brandés en 1 clic",
      "Formats optimisés par réseau",
      "Templates personnalisés ATV",
      "Export HD PNG / MP4",
    ],
    couleur: "#f97316",
  },
  {
    emoji: "📊",
    titre: "Analyse & reporting IA",
    desc: "Tableau de bord intelligent qui suit vos performances, détecte les tendances et recommande les actions.",
    details: [
      "Dashboard temps réel",
      "Alertes intelligentes",
      "Recommandations IA hebdomadaires",
      "Benchmark concurrents",
    ],
    couleur: "#06b6d4",
  },
];

const PLANS: Plan[] = [
  {
    nom: "Starter",
    prix: "49 999",
    badge: "Idéal pour démarrer",
    couleur: "#22c55e",
    services: [
      "30 posts IA/mois",
      "Gestion 2 réseaux sociaux",
      "Chatbot IA basique",
      "1 campagne Meta/mois",
      "Rapport mensuel",
    ],
    cta: "Démarrer Starter",
    whatsapp: "Je veux le Pack Starter IA (49 999 F/mois)",
  },
  {
    nom: "Growth",
    prix: "99 999",
    badge: "⭐ Le plus populaire",
    couleur: "#ffc800",
    highlight: true,
    services: [
      "60 posts IA/mois",
      "Gestion 4 réseaux sociaux",
      "Chatbot IA avancé (Wolof + FR)",
      "3 campagnes Meta + Google/mois",
      "Visuels publicitaires IA",
      "Rapport hebdomadaire",
      "Support WhatsApp prioritaire",
    ],
    cta: "Choisir Growth",
    whatsapp: "Je veux le Pack Growth IA (99 999 F/mois)",
  },
  {
    nom: "Elite",
    prix: "199 999",
    badge: "🏆 Agence complète IA",
    couleur: "#a855f7",
    services: [
      "Posts IA illimités",
      "Tous réseaux sociaux",
      "Chatbot IA full custom",
      "Campagnes illimitées Meta + Google",
      "Design publicitaire illimité",
      "Rapport en temps réel",
      "Account manager dédié",
      "Stratégie IA mensuelle",
    ],
    cta: "Devenir Elite",
    whatsapp: "Je veux le Pack Elite IA (199 999 F/mois)",
  },
];

const ETAPES: Etape[] = [
  {
    num: "01",
    titre: "Briefing en 5 min",
    desc: "Vous répondez à quelques questions sur votre business, vos objectifs et votre audience cible.",
  },
  {
    num: "02",
    titre: "L'IA configure tout",
    desc: "Notre système IA analyse votre marché, crée votre calendrier éditorial et paramètre vos campagnes.",
  },
  {
    num: "03",
    titre: "Publication automatique",
    desc: "Vos posts sont publiés aux meilleurs horaires, vos ads tournent et votre chatbot répond 24/7.",
  },
  {
    num: "04",
    titre: "Vous suivez & récoltez",
    desc: "Dashboard en temps réel, rapports clairs, ROI mesurable. Vous vous concentrez sur votre business.",
  },
];

const RESULTATS = [
  { chiffre: "3×", label: "Plus d'engagement moyen", sous: "vs gestion manuelle" },
  { chiffre: "24/7", label: "Présence sur les réseaux", sous: "même quand vous dormez" },
  { chiffre: "-70%", label: "Temps gagné", sous: "sur la création de contenu" },
  { chiffre: "+250%", label: "ROI ads en moyenne", sous: "grâce à l'optimisation IA" },
];

/* ── Composant principal ──────────────────────────────────── */
export default function ServicesIAPage() {
  const [serviceActif, setServiceActif] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    entreprise: "",
    secteur: "",
    budget: "",
    objectif: "",
  });
  const [envoye, setEnvoye] = useState(false);

  function envoyerBrief(e: React.FormEvent) {
    e.preventDefault();
    const msg = `🤖 DEMANDE SERVICES IA — TOUBA VISUEL\n\nNom: ${formData.nom}\nEntreprise: ${formData.entreprise}\nSecteur: ${formData.secteur}\nBudget: ${formData.budget} F/mois\nObjectif: ${formData.objectif}`;
    window.open(
      `https://wa.me/221768001717?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 4000);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO IA ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-24 pb-20 px-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 70%), #030712",
        }}
      >
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Particules lumineuses */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-32 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge IA */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-8 border"
            style={{
              background: "rgba(168,85,247,0.15)",
              borderColor: "rgba(168,85,247,0.4)",
              color: "#c084fc",
            }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Intelligence Artificielle · Marketing Autonome
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-white">Touba Visuel</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #3b82f6, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              passe à l&apos;IA
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Votre marketing digital <strong className="text-white">entièrement automatisé</strong> par l&apos;IA.
            Contenu, réseaux sociaux, publicités Meta & Google, chatbot 24/7 —{" "}
            <em className="text-purple-400">tout roule pendant que vous gérez votre business.</em>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/221768001717?text=Je veux les services IA de Touba Visuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-gray-900 text-lg shadow-2xl hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
            >
              🚀 Démarrer avec l&apos;IA
            </a>
            <a
              href="#tarifs"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            >
              Voir les tarifs →
            </a>
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS CHIFFRÉS ──────────────────────────────── */}
      <section className="py-16 px-4 border-y border-white/5" style={{ background: "#0a0a0f" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {RESULTATS.map((r) => (
            <div key={r.chiffre} className="text-center p-6 rounded-2xl border border-white/5 bg-white/3">
              <div
                className="text-4xl md:text-5xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #ffc800, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {r.chiffre}
              </div>
              <div className="text-white font-bold text-sm mb-1">{r.label}</div>
              <div className="text-gray-500 text-xs">{r.sous}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES IA ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Ce qu&apos;on automatise pour vous</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              6 services IA{" "}
              <span style={{ color: "#ffc800" }}>tout-en-un</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une suite complète d&apos;outils IA qui travaillent ensemble pour propulser votre présence digitale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="relative group cursor-pointer rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: serviceActif === i
                    ? `linear-gradient(135deg, ${s.couleur}15, ${s.couleur}08)`
                    : "rgba(255,255,255,0.02)",
                  borderColor: serviceActif === i ? `${s.couleur}60` : "rgba(255,255,255,0.06)",
                  boxShadow: serviceActif === i ? `0 0 40px ${s.couleur}20` : "none",
                }}
                onClick={() => setServiceActif(serviceActif === i ? null : i)}
              >
                {/* Icône */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `${s.couleur}20`, border: `1px solid ${s.couleur}40` }}
                >
                  {s.emoji}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{s.titre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>

                {/* Détails dépliables */}
                {serviceActif === i && (
                  <ul className="space-y-2 pt-3 border-t border-white/10">
                    {s.details.map((d, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span style={{ color: s.couleur }}>✓</span>
                        <span className="text-gray-300">{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="text-xs mt-3 font-semibold" style={{ color: s.couleur }}>
                  {serviceActif === i ? "Cliquer pour fermer ↑" : "En savoir plus →"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "linear-gradient(180deg, #0a0a0f, #0f0a1f, #0a0a0f)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Processus automatisé</p>
            <h2 className="text-4xl font-black">Votre marketing roule seul</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ETAPES.map((e, i) => (
              <div key={e.num} className="relative">
                {i < ETAPES.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                    style={{ background: "linear-gradient(90deg, #a855f740, transparent)" }}
                  />
                )}
                <div className="relative z-10 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl text-gray-900"
                    style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
                  >
                    {e.num}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{e.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ──────────────────────────────────────────── */}
      <section id="tarifs" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-3">Investissement mensuel</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Choisissez votre{" "}
              <span style={{ color: "#ffc800" }}>niveau IA</span>
            </h2>
            <p className="text-gray-400">Sans engagement · Résiliable à tout moment · Résultats dès le 1er mois</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.nom}
                className="relative rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,122,42,0.05))"
                    : "rgba(255,255,255,0.02)",
                  borderColor: plan.highlight ? "#ffc80060" : "rgba(255,255,255,0.08)",
                  boxShadow: plan.highlight ? "0 0 60px rgba(255,200,0,0.1)" : "none",
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-gray-900"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
                  >
                    ⭐ RECOMMANDÉ
                  </div>
                )}

                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: plan.couleur }}>
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-4">{plan.nom}</h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">{plan.prix}</span>
                  <span className="text-gray-400 text-sm">F CFA / mois</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.services.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-lg" style={{ color: plan.couleur }}>✓</span>
                      <span className="text-gray-300">{s}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/221768001717?text=${encodeURIComponent(plan.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-4 rounded-2xl font-black text-base transition-all hover:opacity-90"
                  style={
                    plan.highlight
                      ? { background: "linear-gradient(135deg, #ffc800, #ff7a2a)", color: "#111" }
                      : { background: `${plan.couleur}20`, color: plan.couleur, border: `1px solid ${plan.couleur}40` }
                  }
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Besoin d&apos;un devis personnalisé ?{" "}
            <a
              href="https://wa.me/221768001717?text=Je veux un devis IA personnalisé"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              Contactez-nous sur WhatsApp
            </a>
          </p>
        </div>
      </section>

      {/* ── FORMULAIRE BRIEF IA ─────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "linear-gradient(135deg, #0f0a1f, #0a1229, #0a0a0f)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Démarrer maintenant</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Brief IA <span style={{ color: "#a855f7" }}>gratuit</span>
            </h2>
            <p className="text-gray-400">5 minutes. Notre équipe vous rappelle sous 24h avec votre stratégie IA personnalisée.</p>
          </div>

          <form
            onSubmit={envoyerBrief}
            className="space-y-5 bg-white/3 border border-white/8 rounded-3xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Votre nom *</label>
                <input
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Moussa Diallo"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Votre entreprise *</label>
                <input
                  required
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  placeholder="Mon Business SN"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm font-semibold block mb-2">Secteur d&apos;activité *</label>
              <select
                required
                value={formData.secteur}
                onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                style={{ colorScheme: "dark" }}
              >
                <option value="">Choisir votre secteur</option>
                <option>Commerce / Boutique</option>
                <option>Restaurant / Alimentation</option>
                <option>Immobilier</option>
                <option>Transport / Logistique</option>
                <option>Santé / Beauté</option>
                <option>Formation / Education</option>
                <option>BTP / Construction</option>
                <option>Artisanat / Mode</option>
                <option>Services professionnels</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-sm font-semibold block mb-2">Budget mensuel marketing</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                style={{ colorScheme: "dark" }}
              >
                <option value="">Sélectionner un budget</option>
                <option>Moins de 50 000 F</option>
                <option>50 000 – 100 000 F</option>
                <option>100 000 – 200 000 F</option>
                <option>Plus de 200 000 F</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-sm font-semibold block mb-2">Votre objectif principal *</label>
              <textarea
                required
                value={formData.objectif}
                onChange={(e) => setFormData({ ...formData, objectif: e.target.value })}
                placeholder="Ex: Je veux 100 nouveaux clients par mois, augmenter ma visibilité sur Instagram, automatiser mes posts Facebook..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-gray-900 text-base transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
            >
              {envoye ? "✓ Brief envoyé ! On vous contacte bientôt" : "🤖 Envoyer mon brief IA gratuit"}
            </button>

            <p className="text-center text-gray-600 text-xs">
              Sans engagement · Réponse sous 24h · 100% gratuit
            </p>
          </form>
        </div>
      </section>

      {/* ── FAQ IA ──────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "L'IA va-t-elle vraiment remplacer mon community manager ?",
                r: "L'IA automatise les tâches répétitives (création de posts, publication, réponses basiques) et libère votre temps. Elle travaille sous la supervision de notre équipe pour garantir la qualité.",
              },
              {
                q: "Est-ce que ça marche pour les petites entreprises à Touba ?",
                r: "Absolument ! L'IA est particulièrement efficace pour les PME sénégalaises. Elle crée du contenu adapté au marché local, en Wolof et en français.",
              },
              {
                q: "Combien de temps avant de voir des résultats ?",
                r: "La plupart de nos clients voient une augmentation de l'engagement dès les 2 premières semaines. Les résultats ads sont visibles dès la 1ère campagne.",
              },
              {
                q: "Est-ce que je garde le contrôle de mon compte ?",
                r: "Oui ! Vous restez propriétaire de tous vos comptes. Vous approuvez le contenu si vous le souhaitez, ou laissez l'IA publier automatiquement.",
              },
              {
                q: "Quel mode de paiement acceptez-vous ?",
                r: "Wave, Orange Money, virement bancaire ou paiement en espèces à Touba. Facturation mensuelle, sans engagement.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-white/8 rounded-2xl overflow-hidden"
              >
                <summary
                  className="flex items-center justify-between p-6 cursor-pointer font-semibold text-white hover:bg-white/3 transition-colors"
                >
                  {item.q}
                  <span className="text-purple-400 text-xl ml-4 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                  {item.r}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(168,85,247,0.2) 0%, transparent 70%), #030712",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🤖</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Prêt à automatiser votre marketing ?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez les entreprises sénégalaises qui font confiance à Touba Visuel IA pour leur croissance digitale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/221768001717?text=Je veux démarrer avec les services IA de Touba Visuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-black text-gray-900 text-lg shadow-2xl hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
            >
              🚀 Démarrer maintenant
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            >
              Retour au site
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            📞 +221 76 800 17 17 · WhatsApp Business disponible 7j/7
          </p>
        </div>
      </section>
    </main>
  );
}
