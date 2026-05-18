"use client";

import { useState, useRef } from "react";

/* ── Types ───────────────────────────── */
interface Voix {
  id: string;
  nom: string;
  genre: string;
  langue: string;
  drapeau: string;
  description: string;
  couleur: string;
}

interface Modele {
  label: string;
  texte: string;
  categorie: string;
  emoji: string;
}

/* ── Voix disponibles ────────────────── */
const VOIX: Voix[] = [
  { id: "Lea",      nom: "Léa",      genre: "Femme",  langue: "Français",  drapeau: "🇫🇷", description: "Voix féminine neuronale, douce et professionnelle", couleur: "#6366f1" },
  { id: "Celine",   nom: "Céline",   genre: "Femme",  langue: "Français",  drapeau: "🇫🇷", description: "Voix féminine claire, idéale pour les annonces", couleur: "#a855f7" },
  { id: "Mathieu",  nom: "Mathieu",  genre: "Homme",  langue: "Français",  drapeau: "🇫🇷", description: "Voix masculine grave et autoritaire", couleur: "#3b82f6" },
  { id: "Joanna",   nom: "Joanna",   genre: "Femme",  langue: "Anglais",   drapeau: "🇺🇸", description: "Voix féminine neuronale américaine", couleur: "#ec4899" },
  { id: "Matthew",  nom: "Matthew",  genre: "Homme",  langue: "Anglais",   drapeau: "🇺🇸", description: "Voix masculine professionnelle américaine", couleur: "#0ea5e9" },
  { id: "Amy",      nom: "Amy",      genre: "Femme",  langue: "Anglais",   drapeau: "🇬🇧", description: "Voix féminine britannique élégante", couleur: "#f97316" },
];

/* ── Modèles de texte ────────────────── */
const MODELES: Modele[] = [
  { emoji: "📢", categorie: "Pub",         label: "Spot publicitaire",    texte: "Agence Touba Visuel, votre partenaire communication au Sénégal. Flyers, banderoles, t-shirts, sites web et marketing digital. Qualité premium, livraison rapide à Touba et Dakar. Contactez-nous dès aujourd'hui !" },
  { emoji: "🎉", categorie: "Événement",   label: "Annonce événement",    texte: "Nous avons le plaisir de vous annoncer notre grande journée portes ouvertes. Venez découvrir nos services, profitez d'offres exceptionnelles et rencontrez notre équipe. Vous êtes tous les bienvenus !" },
  { emoji: "🛍️", categorie: "Commerce",   label: "Promotion produit",    texte: "Grande promotion ! Jusqu'à cinquante pour cent de réduction sur tous nos produits. Stocks limités, ne manquez pas cette opportunité unique. Commandez maintenant via WhatsApp au soixante-seize huit cents dix-sept dix-sept." },
  { emoji: "🤝", categorie: "Accueil",     label: "Message de bienvenue", texte: "Bienvenue chez nous ! Nous sommes ravis de vous accueillir et mettons tout en œuvre pour vous offrir la meilleure expérience possible. N'hésitez pas à nous contacter pour toute question." },
  { emoji: "📱", categorie: "WhatsApp",    label: "Message WhatsApp pro", texte: "Bonjour ! Je vous contacte de la part de Touba Visuel. Nous proposons des solutions de communication complètes pour votre entreprise. Serait-il possible d'échanger quelques minutes sur vos besoins ?" },
  { emoji: "🎓", categorie: "Formation",   label: "Présentation cours",   texte: "Bonjour à tous et bienvenue dans cette formation. Aujourd'hui, nous allons aborder ensemble les fondamentaux du marketing digital adapté au marché sénégalais. Installez-vous confortablement, la session peut commencer." },
  { emoji: "🏢", categorie: "Entreprise",  label: "Présentation société", texte: "Agence Touba Visuel est une entreprise sénégalaise spécialisée dans la communication visuelle et le marketing digital. Depuis notre création, nous accompagnons les entreprises dans leur développement et leur visibilité." },
  { emoji: "📞", categorie: "Accueil",     label: "Répondeur téléphonique", texte: "Vous êtes bien contacté l'Agence Touba Visuel. Nos équipes ne sont pas disponibles pour le moment. Veuillez laisser votre message après le signal sonore ou rappeler durant nos heures d'ouverture. Merci de votre appel." },
  { emoji: "🌙", categorie: "Religieux",   label: "Vœux Tabaski",         texte: "À l'occasion de la fête de Tabaski, toute l'équipe de Touba Visuel vous présente ses meilleurs vœux. Que cette journée bénie vous apporte bonheur, santé et prospérité. Tabaski Moubarak à vous et à vos familles." },
  { emoji: "🕌", categorie: "Religieux",   label: "Vœux Magal",           texte: "À l'occasion du Grand Magal de Touba, nous vous adressons nos sincères prières et vœux. Que Cheikh Ahmadou Bamba intercède en notre faveur. Que ce pèlerinage béni soit source de bénédictions pour tous." },
];

const INPUT_STYLE: React.CSSProperties = { background: "#12122a", color: "#f3f4f6", borderColor: "rgba(255,255,255,0.1)" };

/* ── Composant player audio ──────────── */
function AudioPlayer({ src, onReset }: { src: string; onReset: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function telecharger() {
    const a = document.createElement("a");
    a.href = src;
    a.download = `voix-ia-atv-${Date.now()}.mp3`;
    a.click();
  }

  return (
    <div className="rounded-3xl p-6 border" style={{ background: "#0a0a1e", borderColor: "rgba(99,102,241,0.4)", boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl animate-pulse"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}>
          🎙️
        </div>
        <div>
          <p className="text-white font-black text-base">Voix IA générée</p>
          <p className="text-indigo-400 text-xs font-medium">Technologie Amazon Polly Neural · Touba Visuel</p>
        </div>
        <button onClick={onReset} className="ml-auto text-gray-600 hover:text-gray-400 transition-colors text-sm">✕</button>
      </div>

      {/* Barre de progression */}
      <div
        className="w-full h-2 rounded-full mb-3 cursor-pointer overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          if (audioRef.current) { audioRef.current.currentTime = ratio * audioRef.current.duration; }
        }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
        />
      </div>

      <div className="flex items-center justify-between mb-5 text-xs" style={{ color: "#6b7280" }}>
        <span>{formatTime(duration * progress / 100)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}
        >
          {playing
            ? <><span className="text-xl">⏸</span> Pause</>
            : <><span className="text-xl">▶</span> Écouter</>}
        </button>
        <button
          onClick={telecharger}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(99,102,241,0.4)", color: "#a5b4fc" }}
        >
          ⬇ MP3
        </button>
        <button
          onClick={() => {
            const text = "🎙️ Voix générée par l'IA Touba Visuel !\n👉 touba-visuel.vercel.app/generateur-voix";
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
          }}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border transition-all hover:bg-green-500/10"
          style={{ borderColor: "rgba(34,197,94,0.35)", color: "#4ade80" }}
        >
          📱 WA
        </button>
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────── */
export default function GenerateurVoixPage() {
  const [texte, setTexte]         = useState("");
  const [voixId, setVoixId]       = useState("Lea");
  const [vitesse, setVitesse]     = useState(1);
  const [loading, setLoading]     = useState(false);
  const [audioSrc, setAudioSrc]   = useState("");
  const [erreur, setErreur]       = useState("");
  const [genCount, setGenCount]   = useState(0);
  const [activeModele, setActiveModele] = useState<string | null>(null);
  const [catActive, setCatActive] = useState<string>("Tous");

  const voix = VOIX.find((v) => v.id === voixId) ?? VOIX[0];
  const MAX = 600;

  async function generer() {
    if (!texte.trim() || texte.length > MAX) return;
    setLoading(true);
    setErreur("");
    setAudioSrc("");

    try {
      const res = await fetch("/api/generate-voix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: texte.trim(), voix: voixId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Erreur ${res.status}`);
      }

      const blob = await res.blob();
      setAudioSrc(URL.createObjectURL(blob));
      setGenCount((n) => n + 1);
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : "Génération échouée. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function appliquerModele(m: Modele) {
    setTexte(m.texte);
    setActiveModele(m.label);
    setAudioSrc("");
    setErreur("");
  }

  const categories = ["Tous", ...new Set(MODELES.map((m) => m.categorie))];
  const modelesFiltres = catActive === "Tous" ? MODELES : MODELES.filter((m) => m.categorie === catActive);
  const pct = Math.round((texte.length / MAX) * 100);

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%), #030712" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            IA Vocale · Amazon Polly Neural · Touba Visuel
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            Générateur de voix<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              IA professionnelle
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transformez votre texte en voix humaine professionnelle en 1 clic.
            Parfait pour vos <strong className="text-white">spots pub, annonces WhatsApp, présentations et voiceovers</strong>.
          </p>

          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount} audio{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── FORMULAIRE ───────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Choix voix */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Choisir une voix
              </label>
              <div className="space-y-2">
                {VOIX.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoixId(v.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                    style={{
                      background: voixId === v.id ? `${v.couleur}18` : "#16162e",
                      borderColor: voixId === v.id ? v.couleur : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                      style={{ background: v.couleur }}
                    >
                      {v.genre === "Femme" ? "♀" : "♂"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{v.drapeau} {v.nom}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${v.couleur}25`, color: v.couleur }}>
                          {v.langue}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#6b7280" }}>{v.description}</p>
                    </div>
                    {voixId === v.id && (
                      <span className="text-lg flex-shrink-0" style={{ color: v.couleur }}>●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Vitesse */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Vitesse de lecture
              </label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={vitesse}
                onChange={(e) => setVitesse(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "#6b7280" }}>
                <span>Lent</span>
                <span className="font-bold" style={{ color: "#a5b4fc" }}>×{vitesse.toFixed(1)}</span>
                <span>Rapide</span>
              </div>
            </div>

            {/* Cas d'usage */}
            <div className="rounded-2xl p-5 border border-white/6 space-y-2" style={{ background: "#0d0d20" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#a5b4fc" }}>Utilisations</p>
              {[
                { emoji: "📻", label: "Spot radio / pub audio" },
                { emoji: "📱", label: "Message WhatsApp professionnel" },
                { emoji: "📞", label: "Répondeur téléphonique" },
                { emoji: "🎬", label: "Voiceover vidéo / TikTok" },
                { emoji: "📣", label: "Annonce événement / conférence" },
                { emoji: "🛒", label: "Promotion produit en boutique" },
              ].map((u) => (
                <div key={u.label} className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
                  <span>{u.emoji}</span><span>{u.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ZONE PRINCIPALE ──────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Zone texte */}
            <div className="rounded-2xl border border-white/6" style={{ background: "#0d0d20" }}>
              <div className="p-5 border-b border-white/5">
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                  Votre texte à lire *
                </label>
                <textarea
                  value={texte}
                  onChange={(e) => { if (e.target.value.length <= MAX) setTexte(e.target.value); }}
                  placeholder="Tapez ou collez votre texte ici… Ex: Bonjour, bienvenue chez Agence Touba Visuel ! Nous sommes ravis de vous accompagner dans votre communication."
                  rows={7}
                  className="w-full px-4 py-3 rounded-xl text-sm border transition-colors resize-none focus:outline-none"
                  style={{ ...INPUT_STYLE, lineHeight: "1.8" }}
                />
                {/* Compteur */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex-1 h-1.5 rounded-full mr-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "linear-gradient(90deg, #6366f1, #a855f7)",
                      }}
                    />
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: pct > 90 ? "#ef4444" : "#6b7280" }}>
                    {texte.length} / {MAX}
                  </span>
                </div>
              </div>

              {/* Voix active + bouton */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border" style={{ background: `${voix.couleur}10`, borderColor: `${voix.couleur}30` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: voix.couleur }}>
                    {voix.genre === "Femme" ? "♀" : "♂"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{voix.drapeau} Voix : {voix.nom} · {voix.langue}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{voix.description}</p>
                  </div>
                </div>

                <button
                  onClick={generer}
                  disabled={!texte.trim() || texte.length > MAX || loading}
                  className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: texte.trim() ? "0 0 40px rgba(99,102,241,0.4)" : "none" }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Synthèse vocale IA en cours…
                      </span>
                    : "🎙️ Générer la voix IA"}
                </button>

                {!texte.trim() && (
                  <p className="text-center text-xs mt-2" style={{ color: "#f59e0b80" }}>
                    Tapez votre texte ou choisissez un modèle ci-dessous
                  </p>
                )}
              </div>
            </div>

            {/* Erreur */}
            {erreur && !loading && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
                <p className="text-red-400 font-bold text-sm mb-2">⚠️ {erreur}</p>
                <button onClick={generer} className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  ↻ Réessayer
                </button>
              </div>
            )}

            {/* Player audio */}
            {audioSrc && !loading && (
              <AudioPlayer src={audioSrc} onReset={() => setAudioSrc("")} />
            )}

            {/* Astuce */}
            {!audioSrc && !loading && !erreur && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.15)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6366f1" }}>💡 Conseils pour un résultat optimal</p>
                <ul className="space-y-1.5 text-xs" style={{ color: "#6b7280" }}>
                  <li>• Évitez les abréviations — écrivez les chiffres en toutes lettres</li>
                  <li>• Ajoutez des virgules et points pour des pauses naturelles</li>
                  <li>• La voix <strong style={{ color: "#a5b4fc" }}>Léa</strong> est idéale pour le Français sénégalais</li>
                  <li>• Ponctuation = rythme de lecture plus naturel</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* MODÈLES */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-black mb-2">Modèles prêts à utiliser</h2>
            <p className="text-gray-500 text-sm">Cliquez sur un modèle, personnalisez si besoin, puis générez.</p>
          </div>

          {/* Filtres catégorie */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatActive(cat)}
                className="px-4 py-2 rounded-full text-sm font-bold border transition-all"
                style={{
                  background: catActive === cat ? "rgba(99,102,241,0.2)" : "#0d0d20",
                  borderColor: catActive === cat ? "#6366f1" : "rgba(255,255,255,0.07)",
                  color: catActive === cat ? "#a5b4fc" : "#6b7280",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelesFiltres.map((m) => (
              <button
                key={m.label}
                onClick={() => appliquerModele(m)}
                className="text-left p-5 rounded-2xl border transition-all hover:scale-[1.01]"
                style={{
                  background: activeModele === m.label ? "rgba(99,102,241,0.12)" : "#0d0d20",
                  borderColor: activeModele === m.label ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{m.label}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                      {m.categorie}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: activeModele === m.label ? "#9ca3af" : "#6b7280" }}>
                  {m.texte}
                </p>
                {activeModele === m.label && (
                  <p className="text-xs font-bold mt-2" style={{ color: "#6366f1" }}>✓ Appliqué — cliquez Générer</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: "6",      label: "Voix disponibles",    sub: "FR · EN · ES",          couleur: "#6366f1" },
            { val: "Neural", label: "Technologie IA",      sub: "Amazon Polly",           couleur: "#a855f7" },
            { val: "100%",   label: "Gratuit",             sub: "Sans inscription",       couleur: "#22c55e" },
            { val: "<5s",    label: "Génération",          sub: "Audio prêt en secondes", couleur: "#ffc800" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 border text-center" style={{ background: "#0d0d20", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-3xl font-black mb-1" style={{ color: s.couleur }}>{s.val}</div>
              <p className="text-white font-bold text-sm">{s.label}</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl p-8 border text-center"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))", borderColor: "rgba(99,102,241,0.25)" }}>
          <h3 className="text-white text-2xl font-black mb-3">Besoin de voix pro pour vos pubs ?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Touba Visuel produit vos spots audio complets — script, voix IA, musique, montage — livrés en MP3 et WAV.
          </p>
          <a href="https://wa.me/221768001717?text=Je veux un spot audio professionnel avec voix IA"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-gray-900 text-sm hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
            🎙️ Commander un spot audio pro
          </a>
        </div>
      </div>
    </main>
  );
}
