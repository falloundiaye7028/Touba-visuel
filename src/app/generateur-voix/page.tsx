"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ── Types ───────────────────────────── */
interface Voix {
  id: string; nom: string; genre: string; langue: string;
  langCode: string; drapeau: string; description: string; couleur: string;
}
interface Modele { label: string; texte: string; categorie: string; emoji: string }

/* ── Voix ────────────────────────────── */
const VOIX: Voix[] = [
  { id: "Lea",     nom: "Léa",     genre: "Femme", langue: "Français",  langCode: "fr-FR", drapeau: "🇫🇷", description: "Voix féminine neuronale, naturelle et douce",      couleur: "#6366f1" },
  { id: "Celine",  nom: "Céline",  genre: "Femme", langue: "Français",  langCode: "fr-FR", drapeau: "🇫🇷", description: "Voix féminine claire, idéale pour les annonces", couleur: "#a855f7" },
  { id: "Mathieu", nom: "Mathieu", genre: "Homme", langue: "Français",  langCode: "fr-FR", drapeau: "🇫🇷", description: "Voix masculine grave et professionnelle",          couleur: "#3b82f6" },
  { id: "Joanna",  nom: "Joanna",  genre: "Femme", langue: "Anglais",   langCode: "en-US", drapeau: "🇺🇸", description: "Voix féminine neuronale américaine",              couleur: "#ec4899" },
  { id: "Matthew", nom: "Matthew", genre: "Homme", langue: "Anglais",   langCode: "en-US", drapeau: "🇺🇸", description: "Voix masculine professionnelle américaine",       couleur: "#0ea5e9" },
  { id: "Amy",     nom: "Amy",     genre: "Femme", langue: "Anglais",   langCode: "en-GB", drapeau: "🇬🇧", description: "Voix féminine britannique élégante",             couleur: "#f97316" },
];

/* ── Modèles ─────────────────────────── */
const MODELES: Modele[] = [
  { emoji: "📢", categorie: "Publicité",  label: "Spot publicitaire",     texte: "Agence Touba Visuel, votre partenaire communication au Sénégal. Flyers, banderoles, t-shirts, sites web et marketing digital. Qualité premium, livraison rapide à Touba et Dakar. Contactez-nous dès aujourd'hui !" },
  { emoji: "🛍️", categorie: "Publicité", label: "Promotion produit",     texte: "Grande promotion ! Profitez de réductions exceptionnelles sur tous nos produits. Stocks limités, ne manquez pas cette opportunité unique. Commandez maintenant via WhatsApp au soixante-seize huit cents dix-sept dix-sept." },
  { emoji: "📞", categorie: "Pro",        label: "Répondeur téléphonique",texte: "Vous êtes bien contacté l'Agence Touba Visuel. Nos équipes ne sont pas disponibles pour le moment. Veuillez laisser votre message ou rappeler durant nos heures d'ouverture. Merci de votre appel." },
  { emoji: "🤝", categorie: "Pro",        label: "Message de bienvenue",  texte: "Bienvenue ! Nous sommes ravis de vous accueillir. Notre équipe met tout en œuvre pour vous offrir la meilleure expérience possible. N'hésitez pas à nous contacter pour toute question." },
  { emoji: "🎉", categorie: "Événement", label: "Annonce événement",     texte: "Nous avons le plaisir de vous annoncer notre grande journée portes ouvertes. Venez découvrir nos services, profitez d'offres exceptionnelles et rencontrez notre équipe. Vous êtes tous les bienvenus !" },
  { emoji: "🎓", categorie: "Formation", label: "Introduction cours",     texte: "Bonjour à tous et bienvenue dans cette formation. Aujourd'hui, nous allons aborder les fondamentaux du marketing digital adapté au marché sénégalais. Installez-vous confortablement, la session peut commencer." },
  { emoji: "🏢", categorie: "Pro",        label: "Présentation entreprise",texte: "Agence Touba Visuel est une entreprise sénégalaise spécialisée dans la communication visuelle et le marketing digital. Nous accompagnons les entreprises dans leur développement et leur visibilité depuis notre création." },
  { emoji: "🌙", categorie: "Religieux", label: "Vœux Tabaski",          texte: "À l'occasion de la fête de Tabaski, toute l'équipe de Touba Visuel vous présente ses meilleurs vœux. Que cette journée bénie vous apporte bonheur, santé et prospérité. Tabaski Moubarak à vous et à vos familles." },
  { emoji: "🕌", categorie: "Religieux", label: "Vœux Magal",            texte: "À l'occasion du Grand Magal de Touba, nous vous adressons nos sincères prières. Que Cheikh Ahmadou Bamba intercède en notre faveur et que ce pèlerinage béni soit source de bénédictions pour tous." },
  { emoji: "📱", categorie: "Pro",        label: "Message WhatsApp pro",  texte: "Bonjour ! Je vous contacte de la part de Touba Visuel. Nous proposons des solutions de communication complètes pour votre entreprise. Seriez-vous disponible pour échanger quelques minutes sur vos besoins ?" },
];

const INPUT_STYLE: React.CSSProperties = { background: "#12122a", color: "#f3f4f6", borderColor: "rgba(255,255,255,0.1)", outline: "none" };
const MAX = 600;

/* ── Nettoyer texte collé ────────────── */
function nettoyer(t: string) {
  return t.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

/* ── Player audio ────────────────────── */
function AudioPlayer({ src, onReset }: { src: string; onReset: () => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function fmt(s: number) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`; }

  function toggle() {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { a.play(); setPlaying(true); }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = ref.current; if (!a || !a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  }

  function download() {
    const a = document.createElement("a"); a.href = src;
    a.download = `voix-ia-atv-${Date.now()}.mp3`; a.click();
  }

  return (
    <div className="rounded-3xl p-6 border" style={{ background: "#0a0a1e", borderColor: "rgba(99,102,241,0.4)", boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}>
      <audio ref={ref} src={src}
        onTimeUpdate={() => { const a = ref.current; if (a?.duration) setProgress((a.currentTime / a.duration) * 100); }}
        onLoadedMetadata={() => { if (ref.current) setDuration(ref.current.duration); }}
        onEnded={() => setPlaying(false)} />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}>🎙️</div>
        <div>
          <p className="text-white font-black text-base">Voix IA générée</p>
          <p className="text-xs font-medium" style={{ color: "#6366f1" }}>Google TTS · Voix IA · Touba Visuel</p>
        </div>
        <button onClick={onReset} className="ml-auto text-gray-600 hover:text-gray-400 text-lg">✕</button>
      </div>

      <div className="w-full h-2 rounded-full mb-1 cursor-pointer overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }} onClick={seek}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#a855f7)" }} />
      </div>
      <div className="flex justify-between text-xs mb-5" style={{ color: "#6b7280" }}>
        <span>{fmt(duration * progress / 100)}</span><span>{fmt(duration)}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={toggle}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 0 25px rgba(99,102,241,0.3)" }}>
          {playing ? <><span>⏸</span>Pause</> : <><span>▶</span>Écouter</>}
        </button>
        <button onClick={download}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm border transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(99,102,241,0.4)", color: "#a5b4fc" }}>
          ⬇ MP3
        </button>
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────── */
export default function GenerateurVoixPage() {
  const [texte, setTexte]       = useState("");
  const [voixId, setVoixId]     = useState("Lea");
  const [vitesse, setVitesse]   = useState(1);
  const [loading, setLoading]   = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [erreur, setErreur]     = useState("");
  const [genCount, setGenCount] = useState(0);
  const [activeModele, setActiveModele] = useState<string | null>(null);
  const [catActive, setCatActive] = useState("Tous");
  const [mode, setMode]         = useState<"api" | "navigateur">("api");

  // Voix navigateur disponibles
  const [voixNav, setVoixNav] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;
    const charger = () => setVoixNav(window.speechSynthesis.getVoices());
    charger();
    window.speechSynthesis.onvoiceschanged = charger;
  }, []);

  const voix = VOIX.find((v) => v.id === voixId) ?? VOIX[0];
  const pct  = Math.round((texte.length / MAX) * 100);

  /* ── Génération via API (ttsmp3 → Amazon Polly) ── */
  async function genererAPI() {
    setLoading(true); setErreur(""); setAudioSrc("");
    try {
      const res = await fetch("/api/generate-voix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: nettoyer(texte), voix: voixId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `Erreur ${res.status}`);
      }
      const blob = await res.blob();
      if (!blob.type.includes("audio")) throw new Error("Réponse invalide — essayez le mode navigateur.");
      setAudioSrc(URL.createObjectURL(blob));
      setGenCount((n) => n + 1);
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Génération via Web Speech API ────── */
  const genererNavigateur = useCallback(() => {
    if (!synthRef.current) { setErreur("Web Speech API non supporté par ce navigateur."); return; }
    synthRef.current.cancel();

    const txt = nettoyer(texte);
    if (!txt) return;

    // Trouver la meilleure voix pour la langue choisie
    const langCode = voix.langCode;
    const voicesDispos = voixNav.filter((v) =>
      v.lang.startsWith(langCode.split("-")[0])
    );
    const voiceChoisie = voicesDispos.find((v) => v.lang === langCode) ?? voicesDispos[0];

    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang  = langCode;
    utterance.rate  = vitesse;
    utterance.pitch = 1;
    if (voiceChoisie) utterance.voice = voiceChoisie;

    utterance.onstart = () => setLoading(false);
    utterance.onerror = () => { setLoading(false); setErreur("Lecture échouée. Vérifiez que le son est activé."); };
    utterance.onend   = () => setGenCount((n) => n + 1);

    setLoading(true);
    setErreur("");
    setAudioSrc("");
    synthRef.current.speak(utterance);
  }, [texte, voixNav, voix.langCode, vitesse]);

  function generer() {
    if (!texte.trim()) return;
    if (mode === "navigateur") { genererNavigateur(); }
    else { genererAPI(); }
  }

  function arreter() {
    synthRef.current?.cancel();
    setLoading(false);
  }

  function appliquerModele(m: Modele) {
    setTexte(m.texte); setActiveModele(m.label);
    setAudioSrc(""); setErreur("");
    synthRef.current?.cancel();
  }

  const categories = ["Tous", ...new Set(MODELES.map((m) => m.categorie))];
  const modelesFiltres = catActive === "Tous" ? MODELES : MODELES.filter((m) => m.categorie === catActive);

  return (
    <main className="min-h-screen px-4 py-12"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%), #030712" }}>
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            IA Vocale · Google TTS · Voix IA · Touba Visuel
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            Générateur de voix<br />
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              IA professionnelle
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Collez ou tapez votre texte — notre IA génère une vraie voix humaine professionnelle en quelques secondes.
          </p>
          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount} audio{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── CONTRÔLES ────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Mode */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>Mode de génération</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "api" as const,        label: "🎙️ Amazon Polly",  desc: "Voix IA haute qualité (MP3)" },
                  { id: "navigateur" as const, label: "🔊 Navigateur",    desc: "Lecture instantanée, tout texte" },
                ].map((m) => (
                  <button key={m.id} onClick={() => { setMode(m.id); setAudioSrc(""); setErreur(""); synthRef.current?.cancel(); }}
                    className="flex flex-col items-center p-3 rounded-xl border text-center transition-all"
                    style={{
                      background: mode === m.id ? "rgba(99,102,241,0.2)" : "#16162e",
                      borderColor: mode === m.id ? "#6366f1" : "rgba(255,255,255,0.07)",
                    }}>
                    <span className="text-sm font-black" style={{ color: mode === m.id ? "#a5b4fc" : "#9ca3af" }}>{m.label}</span>
                    <span className="text-xs mt-0.5" style={{ color: mode === m.id ? "#6b7280" : "#4b5563" }}>{m.desc}</span>
                  </button>
                ))}
              </div>
              {mode === "api" && (
                <p className="text-xs mt-2 text-center" style={{ color: "#4b5563" }}>
                  Pour textes longs ou voix locales → mode <strong style={{ color: "#a5b4fc" }}>Navigateur</strong>
                </p>
              )}
            </div>

            {/* Voix */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>Voix</label>
              <div className="space-y-2">
                {VOIX.map((v) => (
                  <button key={v.id} onClick={() => setVoixId(v.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left"
                    style={{
                      background: voixId === v.id ? `${v.couleur}18` : "#16162e",
                      borderColor: voixId === v.id ? v.couleur : "rgba(255,255,255,0.07)",
                    }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                      style={{ background: v.couleur }}>
                      {v.genre === "Femme" ? "♀" : "♂"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{v.drapeau} {v.nom}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${v.couleur}25`, color: v.couleur }}>{v.langue}</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: "#6b7280" }}>{v.description}</p>
                    </div>
                    {voixId === v.id && <span style={{ color: v.couleur }}>●</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Vitesse */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d20" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Vitesse — ×{vitesse.toFixed(1)}
              </label>
              <input type="range" min={0.5} max={2} step={0.1} value={vitesse}
                onChange={(e) => setVitesse(Number(e.target.value))}
                className="w-full accent-indigo-500" />
              <div className="flex justify-between text-xs mt-1" style={{ color: "#4b5563" }}>
                <span>Lent</span><span>Normal</span><span>Rapide</span>
              </div>
            </div>
          </div>

          {/* ── ZONE TEXTE + RÉSULTAT ─────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Zone texte */}
            <div className="rounded-2xl border border-white/6" style={{ background: "#0d0d20" }}>
              <div className="p-5">
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                  Votre texte *
                  <span className="ml-2 normal-case font-medium" style={{ color: "#4b5563" }}>
                    (tapez ou collez — sauts de ligne acceptés)
                  </span>
                </label>
                <textarea
                  value={texte}
                  onChange={(e) => setTexte(e.target.value.slice(0, MAX))}
                  onPaste={(e) => {
                    // Intercepter le collage pour nettoyer immédiatement
                    e.preventDefault();
                    const colle = e.clipboardData.getData("text");
                    const propre = nettoyer(colle).slice(0, MAX);
                    setTexte(propre);
                  }}
                  placeholder="Collez ou tapez votre texte ici…&#10;&#10;Ex: Bonjour, bienvenue chez Agence Touba Visuel ! Nous sommes ravis de vous accompagner dans votre communication professionnelle."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl text-sm border transition-colors resize-none focus:outline-none"
                  style={{ ...INPUT_STYLE, lineHeight: "1.8" }}
                />
                {/* Compteur */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "linear-gradient(90deg,#6366f1,#a855f7)" }} />
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: pct > 90 ? "#ef4444" : "#6b7280" }}>
                    {texte.length}/{MAX}
                  </span>
                </div>
              </div>

              {/* Voix sélectionnée */}
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ background: `${voix.couleur}10`, borderColor: `${voix.couleur}30` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: voix.couleur }}>
                    {voix.genre === "Femme" ? "♀" : "♂"}
                  </div>
                  <span className="text-white text-sm font-bold">{voix.drapeau} {voix.nom} — {voix.langue}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                    {mode === "api" ? "Amazon Polly" : "Navigateur"}
                  </span>
                </div>
              </div>

              {/* Bouton */}
              <div className="px-5 pb-5 flex gap-3">
                <button onClick={generer}
                  disabled={!texte.trim() || loading}
                  className="flex-1 py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: texte.trim() ? "0 0 35px rgba(99,102,241,0.4)" : "none" }}>
                  {loading
                    ? <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {mode === "navigateur" ? "Lecture en cours…" : "Génération vocale IA…"}
                      </span>
                    : "🎙️ Générer la voix"}
                </button>
                {mode === "navigateur" && loading && (
                  <button onClick={arreter}
                    className="px-5 py-2 rounded-2xl font-bold text-sm border transition-all"
                    style={{ borderColor: "rgba(239,68,68,0.4)", color: "#f87171", background: "rgba(239,68,68,0.08)" }}>
                    ⏹ Stop
                  </button>
                )}
              </div>
            </div>

            {/* Erreur + suggestion switch mode */}
            {erreur && !loading && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
                <p className="text-red-400 font-bold text-sm mb-3">⚠️ {erreur}</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={generer} className="px-4 py-2 rounded-xl font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>↻ Réessayer</button>
                  {mode === "api" && (
                    <button onClick={() => { setMode("navigateur"); setTimeout(genererNavigateur, 100); }}
                      className="px-4 py-2 rounded-xl font-bold text-sm border"
                      style={{ borderColor: "rgba(34,197,94,0.4)", color: "#4ade80", background: "rgba(34,197,94,0.08)" }}>
                      🔊 Passer en mode navigateur
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Player */}
            {audioSrc && !loading && (
              <AudioPlayer src={audioSrc} onReset={() => setAudioSrc("")} />
            )}

            {/* Mode navigateur actif */}
            {mode === "navigateur" && !loading && !erreur && !audioSrc && texte.trim() && (
              <div className="rounded-2xl p-4 border" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)" }}>
                <p className="text-green-400 text-sm font-bold mb-1">🔊 Mode navigateur actif</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>
                  La voix sera lue directement dans votre navigateur. Assurez-vous que le son est activé sur votre appareil.
                </p>
              </div>
            )}

            {/* Conseils */}
            {!audioSrc && !loading && !erreur && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(99,102,241,0.04)", borderColor: "rgba(99,102,241,0.12)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6366f1" }}>💡 Conseils pour un résultat optimal</p>
                <ul className="space-y-1.5 text-xs" style={{ color: "#6b7280" }}>
                  <li>• Écrivez les chiffres en toutes lettres (<em>soixante-seize</em> au lieu de <em>76</em>)</li>
                  <li>• Ajoutez des virgules et points pour créer des pauses naturelles</li>
                  <li>• La voix <strong style={{ color: "#a5b4fc" }}>Léa</strong> donne le meilleur résultat en Français</li>
                  <li>• Si le mode Amazon Polly échoue → utilisez le mode <strong style={{ color: "#4ade80" }}>Navigateur</strong></li>
                  <li>• Vous pouvez coller du texte directement — les sauts de ligne sont nettoyés automatiquement</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* MODÈLES */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-black mb-2">Modèles prêts à utiliser</h2>
            <p className="text-gray-500 text-sm">Cliquez pour appliquer, personnalisez si besoin, puis générez.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCatActive(cat)}
                className="px-4 py-2 rounded-full text-sm font-bold border transition-all"
                style={{
                  background: catActive === cat ? "rgba(99,102,241,0.2)" : "#0d0d20",
                  borderColor: catActive === cat ? "#6366f1" : "rgba(255,255,255,0.07)",
                  color: catActive === cat ? "#a5b4fc" : "#6b7280",
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelesFiltres.map((m) => (
              <button key={m.label} onClick={() => appliquerModele(m)}
                className="text-left p-5 rounded-2xl border transition-all hover:scale-[1.01]"
                style={{
                  background: activeModele === m.label ? "rgba(99,102,241,0.12)" : "#0d0d20",
                  borderColor: activeModele === m.label ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)",
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{m.label}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>{m.categorie}</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: activeModele === m.label ? "#9ca3af" : "#6b7280" }}>{m.texte}</p>
                {activeModele === m.label && <p className="text-xs font-bold mt-2" style={{ color: "#6366f1" }}>✓ Appliqué — cliquez Générer</p>}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl p-8 border text-center"
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.05))", borderColor: "rgba(99,102,241,0.25)" }}>
          <h3 className="text-white text-2xl font-black mb-3">Besoin d&apos;un spot audio professionnel complet ?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Touba Visuel produit vos spots audio — script IA, voix, musique de fond, montage — livrés en MP3 haute qualité.
          </p>
          <a href="https://wa.me/221768001717?text=Je veux un spot audio professionnel avec voix IA"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-gray-900 text-sm hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#ffc800,#ff7a2a)" }}>
            🎙️ Commander un spot audio pro →
          </a>
        </div>
      </div>
    </main>
  );
}
