"use client";

import { useState } from "react";

/* ── Types ───────────────────────────── */
interface Post { titre: string; contenu: string }

/* ── Données ─────────────────────────── */
const PLATEFORMES = [
  { id: "Instagram",  label: "Instagram",  emoji: "📸", couleur: "#e1306c" },
  { id: "Facebook",   label: "Facebook",   emoji: "👥", couleur: "#1877f2" },
  { id: "WhatsApp",   label: "WhatsApp",   emoji: "💬", couleur: "#25d366" },
  { id: "TikTok",     label: "TikTok",     emoji: "🎵", couleur: "#ff0050" },
  { id: "LinkedIn",   label: "LinkedIn",   emoji: "💼", couleur: "#0077b5" },
];

const TONS = [
  { id: "professionnel", label: "Professionnel", emoji: "👔" },
  { id: "chaleureux",    label: "Chaleureux",    emoji: "🤝" },
  { id: "urgent",        label: "Urgence / Promo",emoji: "🔥" },
  { id: "humoristique",  label: "Humoristique",  emoji: "😄" },
  { id: "inspirant",     label: "Inspirant",     emoji: "✨" },
  { id: "storytelling",  label: "Storytelling",  emoji: "📖" },
];

const SECTEURS = [
  "Commerce / Boutique", "Restaurant / Alimentation", "Immobilier",
  "Transport / Logistique", "Santé / Beauté / Pharmacie", "Formation / Éducation",
  "BTP / Construction", "Mode / Textile", "Artisanat", "Tech / Informatique",
  "Agriculture", "Finance / Microfinance", "Services professionnels", "Autre",
];

const OBJECTIFS = [
  "Vendre un produit / service",
  "Attirer de nouveaux clients",
  "Annoncer une promotion ou offre",
  "Augmenter l'engagement (likes, partages)",
  "Présenter mon entreprise",
  "Annoncer une nouveauté",
  "Fidéliser mes clients",
];

const INPUT_STYLE: React.CSSProperties = {
  background: "#12122a",
  color: "#f3f4f6",
  borderColor: "rgba(255,255,255,0.1)",
  outline: "none",
};

/* ── Composant carte post ────────────── */
function PostCard({ post, index, plateforme }: { post: Post; index: number; plateforme: string }) {
  const [copie, setCopie] = useState(false);
  const [ouvert, setOuvert] = useState(index === 0);
  const pl = PLATEFORMES.find((p) => p.id === plateforme) ?? PLATEFORMES[0];

  function copier() {
    navigator.clipboard.writeText(post.contenu);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  function partagerWA() {
    window.open(`https://wa.me/?text=${encodeURIComponent(post.contenu)}`, "_blank");
  }

  const badges = ["Version A", "Version B", "Version C"];

  return (
    <div
      className="rounded-3xl border overflow-hidden transition-all"
      style={{
        background: "#0e0e22",
        borderColor: ouvert ? `${pl.couleur}50` : "rgba(255,255,255,0.06)",
        boxShadow: ouvert ? `0 0 30px ${pl.couleur}15` : "none",
      }}
    >
      {/* En-tête */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ background: pl.couleur }}
          >
            {index + 1}
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-sm">{post.titre}</p>
            <p className="text-xs" style={{ color: pl.couleur }}>{badges[index]} · {pl.emoji} {pl.label}</p>
          </div>
        </div>
        <span className="text-gray-500 text-lg">{ouvert ? "▲" : "▼"}</span>
      </button>

      {/* Contenu */}
      {ouvert && (
        <div className="px-6 pb-6">
          {/* Aperçu plateforme */}
          <div
            className="rounded-2xl p-5 mb-4 border text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              background: "#080818",
              borderColor: "rgba(255,255,255,0.04)",
              color: "#e5e7eb",
              fontFamily: "system-ui, -apple-system, sans-serif",
              minHeight: "120px",
            }}
          >
            {post.contenu}
          </div>

          {/* Stats longueur */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs" style={{ color: "#6b7280" }}>
              {post.contenu.length} caractères
            </span>
            <span className="text-xs" style={{ color: "#6b7280" }}>
              {post.contenu.split(/\s+/).length} mots
            </span>
            {post.contenu.length > 280 && plateforme === "Twitter" && (
              <span className="text-xs text-red-400">⚠ Trop long pour Twitter</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={copier}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={
                copie
                  ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }
                  : { background: "rgba(255,255,255,0.06)", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {copie ? "✓ Copié !" : "📋 Copier"}
            </button>
            <button
              onClick={partagerWA}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: "rgba(37,211,102,0.12)", color: "#4ade80", border: "1px solid rgba(37,211,102,0.25)" }}
            >
              📱 Envoyer sur WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page principale ─────────────────── */
export default function GenerateurIAPage() {
  const [plateforme, setPlateforme] = useState("Instagram");
  const [ton, setTon]               = useState("professionnel");
  const [secteur, setSecteur]       = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [produit, setProduit]       = useState("");
  const [objectif, setObjectif]     = useState("");
  const [langue, setLangue]         = useState("Français");

  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur]   = useState("");
  const [genCount, setGenCount] = useState(0);

  const canGenerate = produit.trim().length > 0;

  async function generer() {
    if (!canGenerate) return;
    setLoading(true);
    setErreur("");
    setPosts([]);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entreprise, secteur, produit, plateforme, ton, objectif, langue }),
      });

      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error ?? "Erreur serveur");

      setPosts(data.posts ?? []);
      setGenCount((n) => n + 1);
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const pl = PLATEFORMES.find((p) => p.id === plateforme) ?? PLATEFORMES[0];

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%), #030712",
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── HERO ─────────────────────────── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            IA Marketing · Touba Visuel
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            Générateur de posts<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ffc800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              100% IA · 100% Sénégal
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Décrivez votre business — notre IA génère <strong className="text-white">3 posts uniques et prêts à publier</strong> en quelques secondes, adaptés au marché sénégalais.
          </p>
          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount * 3} posts générés depuis le début
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── FORMULAIRE ───────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Plateforme */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Réseau social cible
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATEFORMES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlateforme(p.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border"
                    style={{
                      background: plateforme === p.id ? `${p.couleur}20` : "#16162e",
                      borderColor: plateforme === p.id ? p.couleur : "rgba(255,255,255,0.07)",
                      color: plateforme === p.id ? p.couleur : "#9ca3af",
                    }}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Ton / Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTon(t.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: ton === t.id ? "rgba(99,102,241,0.2)" : "#16162e",
                      borderColor: ton === t.id ? "#6366f1" : "rgba(255,255,255,0.07)",
                      color: ton === t.id ? "#a5b4fc" : "#9ca3af",
                    }}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Secteur */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Secteur d&apos;activité
              </label>
              <select
                value={secteur}
                onChange={(e) => setSecteur(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition-colors"
                style={{ ...INPUT_STYLE, background: "#12122a", color: "#f3f4f6", borderColor: "rgba(255,255,255,0.1)" }}
              >
                <option value="" style={{ background: "#12122a" }}>Choisir un secteur</option>
                {SECTEURS.map((s) => (
                  <option key={s} value={s} style={{ background: "#12122a" }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Entreprise */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Nom de votre entreprise
              </label>
              <input
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                placeholder="Ex: Boutique Aminata, Restaurant Chez Fatou…"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-colors"
                style={INPUT_STYLE}
              />
            </div>

            {/* Produit */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Produit / Service à promouvoir *
              </label>
              <textarea
                value={produit}
                onChange={(e) => setProduit(e.target.value)}
                placeholder="Ex: Robe bazin rouge brodée pour femme, disponible en toutes tailles, livraison Touba et Dakar…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm border transition-colors resize-none"
                style={INPUT_STYLE}
              />
            </div>

            {/* Objectif */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Objectif du post
              </label>
              <select
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
                style={{ ...INPUT_STYLE, background: "#12122a", color: "#f3f4f6", borderColor: "rgba(255,255,255,0.1)" }}
              >
                <option value="" style={{ background: "#12122a" }}>Sélectionner un objectif</option>
                {OBJECTIFS.map((o) => (
                  <option key={o} value={o} style={{ background: "#12122a" }}>{o}</option>
                ))}
              </select>
            </div>

            {/* Langue */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Langue principale
              </label>
              <div className="flex gap-2">
                {["Français", "Français + Wolof", "Wolof"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangue(l)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                    style={{
                      background: langue === l ? "rgba(99,102,241,0.2)" : "#16162e",
                      borderColor: langue === l ? "#6366f1" : "rgba(255,255,255,0.07)",
                      color: langue === l ? "#a5b4fc" : "#9ca3af",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton */}
            <button
              onClick={generer}
              disabled={!canGenerate || loading}
              className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: canGenerate ? "0 0 40px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  L&apos;IA rédige vos posts…
                </span>
              ) : (
                `✍️ Générer 3 posts ${pl.emoji} ${pl.label}`
              )}
            </button>

            {!canGenerate && (
              <p className="text-center text-xs" style={{ color: "#f59e0b80" }}>
                * Décrivez votre produit ou service pour commencer
              </p>
            )}

            {/* CTA pack */}
            <div className="rounded-2xl p-4 border" style={{ background: "rgba(255,200,0,0.04)", borderColor: "rgba(255,200,0,0.18)" }}>
              <p className="font-bold text-sm mb-1" style={{ color: "#fbbf24" }}>🚀 Automatisation complète ?</p>
              <p className="text-xs mb-2" style={{ color: "#6b7280" }}>
                Avec nos packs IA, on publie vos posts automatiquement chaque jour.
              </p>
              <a href="/services-ia"
                className="text-xs font-bold hover:underline"
                style={{ color: "#fbbf24" }}>
                Voir les packs → /services-ia
              </a>
            </div>
          </div>

          {/* ── RÉSULTATS ────────────────────── */}
          <div className="lg:col-span-3">

            {/* État vide */}
            {!loading && posts.length === 0 && !erreur && (
              <div
                className="rounded-3xl border flex flex-col items-center justify-center text-center p-16"
                style={{ background: "#0d0d20", borderColor: "rgba(255,255,255,0.05)", minHeight: "400px" }}
              >
                <div className="text-7xl mb-6 opacity-25">✍️</div>
                <p className="text-white font-bold text-xl mb-2">Vos posts IA apparaîtront ici</p>
                <p className="text-gray-600 text-sm max-w-xs">
                  Remplissez le formulaire à gauche, choisissez votre plateforme et votre ton, puis cliquez sur <span style={{ color: "#6366f1" }} className="font-bold">Générer</span>.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {PLATEFORMES.slice(0, 3).map((p) => (
                    <div key={p.id}
                      className="rounded-2xl p-3 text-center border"
                      style={{ background: `${p.couleur}10`, borderColor: `${p.couleur}25` }}>
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      <p className="text-xs font-bold" style={{ color: p.couleur }}>{p.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chargement */}
            {loading && (
              <div
                className="rounded-3xl border flex flex-col items-center justify-center text-center p-16"
                style={{ background: "#0d0d20", borderColor: "rgba(99,102,241,0.2)", minHeight: "400px" }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 rounded-full animate-spin"
                    style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
                </div>
                <p className="text-white font-black text-xl mb-2">L&apos;IA rédige vos posts…</p>
                <p className="text-gray-500 text-sm mb-6">
                  Notre IA analyse votre business et crée 3 posts uniques adaptés au marché sénégalais
                </p>
                <div className="flex gap-2">
                  {["Analyse du contexte…", "Rédaction en cours…", "Optimisation…"].map((step, i) => (
                    <div key={i}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        borderColor: "rgba(99,102,241,0.3)",
                        color: "#a5b4fc",
                        animation: `pulse ${1 + i * 0.3}s infinite`,
                      }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Erreur */}
            {erreur && !loading && (
              <div className="rounded-2xl p-6 border text-center" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-400 font-bold mb-2">{erreur}</p>
                <button onClick={generer}
                  className="px-6 py-2.5 rounded-xl font-bold text-white text-sm mt-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  ↻ Réessayer
                </button>
              </div>
            )}

            {/* Posts générés */}
            {!loading && posts.length > 0 && (
              <div className="space-y-4">
                {/* Header résultat */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-black text-lg">
                      🎉 3 posts générés pour {pl.emoji} {plateforme}
                    </p>
                    <p className="text-gray-500 text-sm">Cliquez sur chaque post pour le voir et le copier</p>
                  </div>
                  <button
                    onClick={generer}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all hover:bg-white/5"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "#a5b4fc" }}
                  >
                    ↻ Regénérer
                  </button>
                </div>

                {posts.map((post, i) => (
                  <PostCard key={i} post={post} index={i} plateforme={plateforme} />
                ))}

                {/* Changer de plateforme */}
                <div className="rounded-2xl p-5 border mt-4" style={{ background: "#0d0d20", borderColor: "rgba(255,255,255,0.05)" }}>
                  <p className="text-gray-400 text-sm font-semibold mb-3">
                    📱 Générer les mêmes posts pour une autre plateforme :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLATEFORMES.filter((p) => p.id !== plateforme).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setPlateforme(p.id); setTimeout(generer, 100); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
                        style={{ background: `${p.couleur}15`, borderColor: `${p.couleur}40`, color: p.couleur }}
                      >
                        {p.emoji} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
