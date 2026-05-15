"use client";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

/* ── Bande fine en haut du site ─────────────────────────────── */
const ADS = [
  {
    bg: "linear-gradient(90deg, #07402b 0%, #0a6342 40%, #1d9c68 100%)",
    logo: "ATV",
    logoColor: "#ffc800",
    headline: "IMPRESSION EXPRESS",
    sub: "Flyers · Affiches · Banderoles",
    cta: "À PARTIR DE 4 999 F",
    ctaBg: "#ffc800",
    ctaColor: "#111",
    href: "/catalogue/impression-papier",
  },
  {
    bg: "linear-gradient(90deg, #111 0%, #1a1a1a 40%, #222 100%)",
    logo: "ATV",
    logoColor: "#ff7a2a",
    headline: "SITES WEB PROFESSIONNELS",
    sub: "Vitrine · E-commerce · Portfolio",
    cta: "DÈS 99 999 F CLÉ EN MAIN",
    ctaBg: "#ff7a2a",
    ctaColor: "#fff",
    href: "/catalogue/creation-site-web",
  },
  {
    bg: "linear-gradient(90deg, #7c1d00 0%, #c0390a 40%, #e84a10 100%)",
    logo: "ATV",
    logoColor: "#fff",
    headline: "ENSEIGNE LUMINEUSE LED",
    sub: "Fabriquée & installée à Touba",
    cta: "DEVIS GRATUIT",
    ctaBg: "#ffc800",
    ctaColor: "#111",
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
      <a
        href={ad.href}
        className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 md:py-5 gap-6 cursor-pointer"
        style={{ textDecoration: "none" }}
      >
        <div
          className="flex-shrink-0 font-black text-2xl md:text-3xl tracking-tight px-4 py-1.5 rounded-xl border-[3px]"
          style={{ color: ad.logoColor, borderColor: ad.logoColor }}
        >
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
        <div
          className="flex-shrink-0 font-black text-sm md:text-lg px-5 py-2.5 rounded-xl whitespace-nowrap shadow-xl"
          style={{ background: ad.ctaBg, color: ad.ctaColor }}
        >
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

/* ── Grande bannière publicitaire style "Ville Verte" ────────── */
const GRANDES_PUBS = [
  {
    bg: "#07402b",
    image: "/images/atv-vitrine.jpg",
    tag: "Impression & Communication",
    titre1: "DONNEZ UNE AUTRE",
    titre2: "DIMENSION À VOTRE",
    titre3: "MARQUE",
    cta: "COMMANDEZ DÈS MAINTENANT",
    ctaBg: "#ffc800",
    ctaColor: "#111",
    href: "/catalogue",
  },
  {
    bg: "#0a0a0a",
    image: "/images/atv-studio.jpg",
    tag: "Shooting & Production",
    titre1: "VOTRE STUDIO PHOTO",
    titre2: "À TOUBA",
    titre3: "— DISPONIBLE 7J/7",
    cta: "RÉSERVER UN CRÉNEAU",
    ctaBg: "#ff7a2a",
    ctaColor: "#fff",
    href: "https://wa.me/221778001717?text=Bonjour%20ATV%2C%20je%20voudrais%20réserver%20le%20studio.",
  },
];

export function BannierePromoGrande() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);
  const pub = GRANDES_PUBS[idx];

  if (!visible) return null;

  return (
    <div className="w-full px-4 py-4 max-w-7xl mx-auto">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ minHeight: 220 }}
      >
        {/* Image droite */}
        <div className="absolute inset-0">
          <Image
            src={pub.image}
            alt={pub.titre1}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay dégradé gauche */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${pub.bg} 0%, ${pub.bg}ee 38%, ${pub.bg}99 60%, transparent 100%)`,
            }}
          />
        </div>

        {/* Contenu gauche */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 py-8 md:py-10 max-w-xl">
          {/* Tag */}
          <span
            className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-80"
            style={{ color: pub.ctaBg }}
          >
            {pub.tag}
          </span>

          {/* Titre */}
          <h2 className="text-white font-black leading-tight mb-1"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            {pub.titre1}
            <br />
            {pub.titre2}
            <br />
            <span style={{ color: pub.ctaBg }}>{pub.titre3}</span>
          </h2>

          {/* CTA */}
          <a
            href={pub.href}
            className="inline-flex items-center mt-5 font-black text-sm px-6 py-3 rounded-xl shadow-xl transition-all hover:opacity-90 hover:scale-[1.02] self-start"
            style={{ background: pub.ctaBg, color: pub.ctaColor }}
          >
            {pub.cta}
          </a>
        </div>

        {/* Points navigation */}
        <div className="absolute bottom-4 left-8 md:left-14 flex gap-2">
          {GRANDES_PUBS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: i === idx ? "#fff" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>

        {/* Fermer */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
          aria-label="Fermer"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
