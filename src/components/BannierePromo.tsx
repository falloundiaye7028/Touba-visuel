"use client";
import { useState } from "react";
import { X } from "lucide-react";

const ADS = [
  {
    bg: "linear-gradient(90deg, #07402b 0%, #0a6342 40%, #1d9c68 100%)",
    accent: "#ffc800",
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
    accent: "#ff7a2a",
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
    accent: "#ffc800",
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
    <div
      className="relative w-full overflow-hidden"
      style={{ background: ad.bg }}
    >
      <a
        href={ad.href}
        className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 md:py-5 gap-6 cursor-pointer"
        style={{ textDecoration: "none" }}
      >
        {/* Logo ATV */}
        <div
          className="flex-shrink-0 font-black text-2xl md:text-3xl tracking-tight px-4 py-1.5 rounded-xl border-[3px]"
          style={{ color: ad.logoColor, borderColor: ad.logoColor }}
        >
          {ad.logo}
        </div>

        {/* Texte principal */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0">
          <p
            className="font-black text-white text-xl md:text-3xl leading-tight tracking-wide"
            style={{ letterSpacing: "0.03em" }}
          >
            {ad.headline}
          </p>
          <p className="text-white/75 text-sm md:text-base font-semibold hidden sm:block whitespace-nowrap">
            {ad.sub}
          </p>
        </div>

        {/* CTA */}
        <div
          className="flex-shrink-0 font-black text-sm md:text-lg px-5 py-2.5 rounded-xl whitespace-nowrap shadow-xl"
          style={{ background: ad.ctaBg, color: ad.ctaColor }}
        >
          {ad.cta}
        </div>
      </a>

      {/* Navigation + fermer */}
      <div className="absolute right-3 top-2 flex items-center gap-1.5">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setAdIdx(i); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === adIdx ? "#fff" : "rgba(255,255,255,0.35)" }}
          />
        ))}
        <button
          onClick={() => setVisible(false)}
          className="ml-1 text-white/60 hover:text-white transition-colors p-1"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
