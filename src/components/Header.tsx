"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Phone, MapPin, ChevronDown, Store } from "lucide-react";

/* ── Menus déroulants ──────────────────────── */
const DROPDOWNS = [
  {
    label: "🤖 IA Marketing",
    links: [
      { href: "/services-ia",        label: "Marketing IA",       desc: "Services automatisés complets" },
      { href: "/generateur-ia",      label: "Générateur de posts", desc: "Posts réseaux sociaux en 1 clic" },
      { href: "/generateur-visuels", label: "Visuels IA",          desc: "Images marketing par IA" },
      { href: "/generateur-voix",    label: "🎙️ Voix IA",         desc: "Spots audio & voiceover pro" },
    ],
  },
  {
    label: "✨ Événements",
    links: [
      { href: "/magal",       label: "⏳ Magal 2026",   desc: "Pack communication Magal de Touba" },
      { href: "/tabaski",     label: "🌙 Tabaski",       desc: "Carte de vœux gratuite" },
      { href: "/touba-infos", label: "📰 Touba Infos",   desc: "Actualités mourides & locales" },
    ],
  },
];

const NAV_SIMPLE = [
  { href: "/",         label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/blog",     label: "Blog" },
  { href: "/suivi",    label: "Suivi" },
];

/* ── Composant Dropdown ────────────────────── */
function Dropdown({ item }: { item: typeof DROPDOWNS[0] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-black px-3 py-1.5 rounded-full text-gray-900 hover:opacity-90 transition-all"
        style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 rounded-2xl overflow-hidden border shadow-2xl z-50"
          style={{ background: "#0e1f15", borderColor: "rgba(255,255,255,0.1)" }}
        >
          {item.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <p className="text-white font-semibold text-sm">{link.label}</p>
              <p className="text-vert-400 text-xs mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Header principal ──────────────────────── */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-vert-900 shadow-lg">

      {/* Barre supérieure */}
      <div className="bg-vert-950 text-or-300 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              +221 76 800 17 17
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              Touba, Sénégal
            </span>
          </div>
          <span>Livraison Touba &bull; Dakar &bull; Partout au Sénégal &bull; International</span>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 bg-gray-950 border border-or-500/60 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <span className="text-or-400 font-black text-sm tracking-tight"
                style={{ textShadow: "0 0 8px #ffffff, 0 0 16px #ffffff" }}>
                ATV
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-or-400 font-black text-lg tracking-wide leading-none"
                style={{ textShadow: "0 0 6px rgba(255,255,255,0.5)" }}>
                AGENCE
              </div>
              <div className="text-white font-bold text-base tracking-widest leading-none">
                TOUBA VISUEL
              </div>
            </div>
          </Link>

          {/* Nav desktop — liens simples */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_SIMPLE.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-vert-200 hover:text-or-400 text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdowns */}
            {DROPDOWNS.map((d) => (
              <Dropdown key={d.label} item={d} />
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/marche-ocass"
              className="flex items-center gap-2 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0e7d52, #1d9c68)", border: "1px solid rgba(255,200,0,0.3)" }}
            >
              <Store size={15} />
              MARCHÉ OCASS
            </Link>
            <Link
              href="/commande"
              className="flex items-center gap-2 bg-or-500 hover:bg-or-400 text-vert-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <ShoppingBag size={16} />
              Commander
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-vert-900 border-t border-vert-700 px-4 py-4">
          <nav className="flex flex-col gap-1">

            {/* Liens simples */}
            {NAV_SIMPLE.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-vert-100 hover:text-or-400 text-base font-medium py-2.5 border-b border-vert-800 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Sections dépliables */}
            {DROPDOWNS.map((d) => (
              <div key={d.label} className="border-b border-vert-800">
                <button
                  onClick={() => setMobileSection(mobileSection === d.label ? null : d.label)}
                  className="w-full flex items-center justify-between text-vert-100 text-base font-bold py-2.5 transition-colors"
                >
                  <span>{d.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileSection === d.label ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileSection === d.label && (
                  <div className="pb-2 pl-3 space-y-1">
                    {d.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-2 text-vert-300 hover:text-or-400 text-sm transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                        <span className="text-vert-600 text-xs ml-2">{link.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* CTA Marché */}
            <Link
              href="/marche-ocass"
              className="mt-3 flex items-center justify-center gap-2 text-white font-bold text-base px-4 py-3 rounded-lg"
              style={{ background: "linear-gradient(135deg, #0e7d52, #1d9c68)" }}
              onClick={() => setMenuOpen(false)}
            >
              <Store size={18} />
              MARCHÉ OCASS
            </Link>
            {/* CTA */}
            <Link
              href="/commande"
              className="mt-2 flex items-center justify-center gap-2 bg-or-500 text-vert-950 font-bold text-base px-4 py-3 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingBag size={18} />
              Passer une commande
            </Link>
          </nav>

          <div className="mt-4 pt-3 border-t border-vert-700 text-vert-400 text-xs space-y-1">
            <p className="flex items-center gap-1"><Phone size={12} /> +221 76 800 17 17</p>
            <p className="flex items-center gap-1"><MapPin size={12} /> Touba, Sénégal</p>
          </div>
        </div>
      )}
    </header>
  );
}
