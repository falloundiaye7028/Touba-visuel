"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Bande fine en haut du site ─────────────────────────────── */
const ADS = [
  {
    bg: "linear-gradient(90deg, #07402b 0%, #0a6342 40%, #1d9c68 100%)",
    logo: "ATV", logoColor: "#ffc800",
    headline: "IMPRESSION EXPRESS",
    sub: "Flyers · Affiches · Banderoles",
    cta: "À PARTIR DE 4 999 F", ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/impression-papier",
  },
  {
    bg: "linear-gradient(90deg, #111 0%, #1a1a1a 40%, #222 100%)",
    logo: "ATV", logoColor: "#ff7a2a",
    headline: "SITES WEB PROFESSIONNELS",
    sub: "Vitrine · E-commerce · Portfolio",
    cta: "DÈS 99 999 F CLÉ EN MAIN", ctaBg: "#ff7a2a", ctaColor: "#fff",
    href: "/catalogue/creation-site-web",
  },
  {
    bg: "linear-gradient(90deg, #7c1d00 0%, #c0390a 40%, #e84a10 100%)",
    logo: "ATV", logoColor: "#fff",
    headline: "ENSEIGNE LUMINEUSE LED",
    sub: "Fabriquée & installée à Touba",
    cta: "DEVIS GRATUIT", ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/signaletique-grand-format",
  },
];

export default function BannierePromo() {
  const [visible, setVisible] = useState(true);
  const [adIdx, setAdIdx] = useState(0);
  const ad = ADS[adIdx];

  if (!visible) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ background: ad.bg }}>
      <a href={ad.href}
        className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 md:py-5 gap-6 cursor-pointer"
        style={{ textDecoration: "none" }}>
        <div className="flex-shrink-0 font-black text-2xl md:text-3xl tracking-tight px-4 py-1.5 rounded-xl border-[3px]"
          style={{ color: ad.logoColor, borderColor: ad.logoColor }}>
          {ad.logo}
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0">
          <p className="font-black text-white text-xl md:text-3xl leading-tight tracking-wide">
            {ad.headline}
          </p>
          <p className="text-white/75 text-sm md:text-base font-semibold hidden sm:block whitespace-nowrap">
            {ad.sub}
          </p>
        </div>
        <div className="flex-shrink-0 font-black text-sm md:text-lg px-5 py-2.5 rounded-xl whitespace-nowrap shadow-xl"
          style={{ background: ad.ctaBg, color: ad.ctaColor }}>
          {ad.cta}
        </div>
      </a>
      <div className="absolute right-3 top-2 flex items-center gap-1.5">
        {ADS.map((_, i) => (
          <button key={i} onClick={(e) => { e.preventDefault(); setAdIdx(i); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === adIdx ? "#fff" : "rgba(255,255,255,0.35)" }} />
        ))}
        <button onClick={() => setVisible(false)}
          className="ml-1 text-white/60 hover:text-white transition-colors p-1" aria-label="Fermer">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Grande bannière publicitaire auto-défilante ─────────────── */
const SLIDES = [
  {
    bg: "#07402b",
    image: "/images/atv-vitrine.jpg",
    tag: "Agence Touba Visuel — ATV",
    titre1: "DONNEZ UNE AUTRE",
    titre2: "DIMENSION À VOTRE",
    accent: "MARQUE",
    cta: "VOIR NOS SERVICES",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue",
  },
  {
    bg: "#0a0a0a",
    image: "/images/atv-studio.jpg",
    tag: "Shooting & Production",
    titre1: "VOTRE STUDIO PHOTO",
    titre2: "PROFESSIONNEL",
    accent: "À TOUBA — 7J/7",
    cta: "RÉSERVER LE STUDIO",
    ctaBg: "#ff7a2a", ctaColor: "#fff",
    href: "https://wa.me/221768001717?text=Bonjour%20ATV%2C%20je%20voudrais%20réserver%20le%20studio.",
  },
  {
    bg: "#1a0a00",
    image: "/images/atv-tiktok-cover.jpg",
    tag: "Impression tous formats",
    titre1: "FLYERS · AFFICHES",
    titre2: "BANDEROLES · ROLL-UP",
    accent: "LIVRAISON EXPRESS TOUBA",
    cta: "COMMANDER — DÈS 4 999 F",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/impression-papier",
  },
  {
    bg: "#07402b",
    image: "/images/orange-tabaski.jpg",
    tag: "Campagnes & Événements",
    titre1: "ANIMATION TERRAIN",
    titre2: "STRATÉGIE & IMPACT",
    accent: "POUR VOS GRANDES MARQUES",
    cta: "DÉMARRER UNE CAMPAGNE",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "https://wa.me/221768001717?text=Bonjour%20ATV%2C%20je%20souhaite%20discuter%20d%27une%20campagne.",
  },
  {
    bg: "#0a0033",
    image: "/images/real-atv-mockup.jpg",
    tag: "Identité Visuelle & Branding",
    titre1: "LOGO · CHARTE",
    titre2: "GRAPHIQUE COMPLÈTE",
    accent: "VOTRE MARQUE MÉRITE LE MEILLEUR",
    cta: "CRÉER MON IDENTITÉ",
    ctaBg: "#ff7a2a", ctaColor: "#fff",
    href: "/catalogue/communication-digitale",
  },
  {
    bg: "#111",
    image: "/images/real-atv-enseignes.jpg",
    tag: "Signalétique Grand Format",
    titre1: "ENSEIGNES · PANNEAUX",
    titre2: "TOTEMS LUMINEUX",
    accent: "INSTALLATION À TOUBA & DAKAR",
    cta: "DEVIS GRATUIT",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/signaletique-grand-format",
  },
];

const INTERVAL = 5000;

export function BannierePromoGrande() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => { setIdx(i); startTimer(); };
  const prev = () => goTo((idx - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((idx + 1) % SLIDES.length);

  const pub = SLIDES[idx];

  return (
    <div className="w-full px-4 py-4 max-w-7xl mx-auto">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: 240 }}>

        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            key={pub.image}
            src={pub.image}
            alt={pub.titre1}
            fill
            className="object-cover object-center"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${pub.bg} 0%, ${pub.bg}ee 40%, ${pub.bg}88 65%, transparent 100%)`,
            }}
          />
        </div>

        {/* Contenu gauche */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 py-10 md:py-12 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] mb-3 opacity-75"
            style={{ color: pub.ctaBg }}>
            {pub.tag}
          </span>
          <h2 className="text-white font-black leading-tight mb-1"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            {pub.titre1}
            <br />{pub.titre2}
          </h2>
          <p className="font-black mt-1 mb-5"
            style={{ color: pub.ctaBg, fontSize: "clamp(0.85rem, 2vw, 1.2rem)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            {pub.accent}
          </p>
          <a href={pub.href}
            className="inline-flex items-center self-start font-black text-sm md:text-base px-6 py-3 rounded-xl shadow-xl transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: pub.ctaBg, color: pub.ctaColor }}>
            {pub.cta}
          </a>
        </div>

        {/* Flèches */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
          <ChevronRight size={18} className="text-white" />
        </button>

        {/* Points de navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 24 : 8, height: 8,
                background: i === idx ? pub.ctaBg : "rgba(255,255,255,0.4)",
              }} />
          ))}
        </div>

        {/* Compteur */}
        <div className="absolute top-4 right-4 text-white/50 text-xs font-bold">
          {idx + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  );
}
