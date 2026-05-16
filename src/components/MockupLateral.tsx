"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const SLIDES_LEFT = [
  {
    bg: "linear-gradient(180deg, #07402b 0%, #0a6342 100%)",
    image: "/images/atv-vitrine.jpg",
    tag: "AGENCE",
    titre: "TOUBA VISUEL",
    sub: "Image & Communication",
    cta: "Voir nos services",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue",
  },
  {
    bg: "linear-gradient(180deg, #111 0%, #1a1a1a 100%)",
    image: "/images/atv-studio.jpg",
    tag: "STUDIO",
    titre: "SHOOTING PRO",
    sub: "Disponible 7j/7 à Touba",
    cta: "Réserver",
    ctaBg: "#ff7a2a", ctaColor: "#fff",
    href: "https://wa.me/221768001717?text=Studio",
  },
  {
    bg: "linear-gradient(180deg, #0a0033 0%, #1a0066 100%)",
    image: "/images/real-atv-mockup.jpg",
    tag: "BRANDING",
    titre: "LOGO & IDENTITÉ",
    sub: "Charte graphique complète",
    cta: "Devis gratuit",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/communication-digitale",
  },
];

const SLIDES_RIGHT = [
  {
    bg: "linear-gradient(180deg, #1a0800 0%, #c0390a 100%)",
    image: "/images/real-atv-enseignes.jpg",
    tag: "SIGNALÉTIQUE",
    titre: "ENSEIGNES LED",
    sub: "Installation Touba & Dakar",
    cta: "Devis gratuit",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/signaletique-grand-format",
  },
  {
    bg: "linear-gradient(180deg, #07402b 0%, #0a5235 100%)",
    image: "/images/real-atv-panneaux.jpg",
    tag: "IMPRESSION",
    titre: "TOUS FORMATS",
    sub: "Flyers · Affiches · Roll-up",
    cta: "À partir de 4 999 F",
    ctaBg: "#ffc800", ctaColor: "#111",
    href: "/catalogue/impression-papier",
  },
  {
    bg: "linear-gradient(180deg, #111 0%, #222 100%)",
    image: "/images/atv-tiktok-cover.jpg",
    tag: "DIGITAL",
    titre: "SITES WEB",
    sub: "Vitrine · E-commerce",
    cta: "Dès 99 999 F",
    ctaBg: "#ff7a2a", ctaColor: "#fff",
    href: "/catalogue/creation-site-web",
  },
];

const INTERVAL = 4000;

function BanniereVerticale({
  slides, side,
}: {
  slides: typeof SLIDES_LEFT;
  side: "left" | "right";
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[idx];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-20 hidden 2xl:flex flex-col
        ${side === "left" ? "left-2" : "right-2"}`}
      style={{ width: 140 }}
    >
      <a
        href={s.href}
        target={s.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-300"
        style={{ background: s.bg, height: 420 }}
      >
        {/* Image */}
        <div className="relative w-full" style={{ height: 160 }}>
          <Image
            key={s.image}
            src={s.image}
            alt={s.titre}
            fill
            className="object-cover object-center"
            sizes="140px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          {/* Tag */}
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <span
              className="text-[9px] font-black tracking-[0.3em] px-2 py-0.5 rounded-full"
              style={{ background: s.ctaBg, color: s.ctaColor }}
            >
              {s.tag}
            </span>
          </div>
        </div>

        {/* Logo ATV */}
        <div className="flex justify-center mt-3 mb-2">
          <div className="w-14 h-14 relative rounded-xl overflow-hidden shadow-lg border-2 border-white/10">
            <Image src="/images/atv-logo-3d.jpg" alt="ATV" fill className="object-cover" sizes="56px" />
          </div>
        </div>

        {/* Texte */}
        <div className="px-3 text-center">
          <p className="text-white font-black text-sm leading-tight tracking-wide">
            {s.titre}
          </p>
          <p className="text-white/60 text-[10px] mt-1 leading-snug font-medium">
            {s.sub}
          </p>
        </div>

        {/* CTA */}
        <div className="px-3 mt-4">
          <div
            className="w-full text-center font-black text-[11px] py-2.5 rounded-xl shadow-lg"
            style={{ background: s.ctaBg, color: s.ctaColor }}
          >
            {s.cta}
          </div>
        </div>

        {/* Points navigation */}
        <div className="flex justify-center gap-1.5 mt-4">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 16 : 5, height: 5,
                background: i === idx ? s.ctaBg : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Footer ATV */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <p className="text-white/25 text-[8px] font-bold tracking-[0.3em] uppercase">
            touba-visuel.vercel.app
          </p>
        </div>
      </a>
    </div>
  );
}

export default function MockupLateral() {
  return (
    <>
      <BanniereVerticale slides={SLIDES_LEFT} side="left" />
      <BanniereVerticale slides={SLIDES_RIGHT} side="right" />
    </>
  );
}
