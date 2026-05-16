"use client";

import { useEffect, useRef, useState } from "react";

// ── Constantes ─────────────────────────────────────────────────────────────
const TEL = "774104945";
const WA_LINK = `https://wa.me/221${TEL}`;
const TEL_DISPLAY = "77 410 49 45";

const SERVICES = [
  {
    icon: <RingIcon />,
    titre: "Achat d'Or",
    desc: "Nous rachetions vos bijoux, lingots et pièces en or au meilleur cours du marché, en toute transparence.",
    couleur: "#c9a84c",
  },
  {
    icon: <NecklaceIcon />,
    titre: "Vente de Bijoux",
    desc: "Une sélection de pièces d'or de haute qualité : colliers, bracelets, bagues, boucles d'oreilles et pendentifs.",
    couleur: "#e8d09e",
  },
  {
    icon: <ExchangeIcon />,
    titre: "Échange",
    desc: "Échangez vos anciens bijoux contre de nouvelles pièces. Service rapide, estimation juste et honnête.",
    couleur: "#d4af37",
  },
  {
    icon: <HammerIcon />,
    titre: "Sur Commande",
    desc: "Créez le bijou de vos rêves. Nous façonnons sur mesure chaque pièce selon vos désirs, avec savoir-faire artisanal.",
    couleur: "#c9a84c",
  },
];

const COLLECTIONS = [
  { nom: "Colliers & Chaînes", icon: <NecklaceIcon size={64} />, desc: "Or 18 & 24 carats" },
  { nom: "Bagues & Solitaires", icon: <RingIcon size={64} />, desc: "Or jaune, blanc, rosé" },
  { nom: "Bracelets", icon: <BraceletIcon size={64} />, desc: "Jonc, chaîne, manchette" },
  { nom: "Boucles d'Oreilles", icon: <EarringIcon size={64} />, desc: "Créoles, puces, pendants" },
  { nom: "Pendentifs", icon: <PendantIcon size={64} />, desc: "Avec pierres & sans" },
  { nom: "Sur Commande", icon: <StarIcon size={64} />, desc: "Vos créations uniques" },
];

const ATOUTS = [
  { emoji: "⚖️", titre: "Pesée certifiée", desc: "Balance de précision, pesée devant vous en toute transparence." },
  { emoji: "🏆", titre: "30 ans d'expérience", desc: "Un savoir-faire reconnu au cœur du Marché Tilène, Dakar." },
  { emoji: "🔒", titre: "Confiance garantie", desc: "Estimation honnête, prix du marché, aucune surprise." },
  { emoji: "⚡", titre: "Service immédiat", desc: "Achat, vente ou échange en quelques minutes sur place." },
];

// ── SVG Bijoux ─────────────────────────────────────────────────────────────

function RingIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="30%" stopColor="#c9a84c" />
          <stop offset="60%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8d4f5" />
          <stop offset="50%" stopColor="#e8f4ff" />
          <stop offset="100%" stopColor="#6aabde" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="52" rx="26" ry="10" stroke="url(#goldRing)" strokeWidth="6" fill="none" />
      <ellipse cx="40" cy="44" rx="26" ry="10" stroke="url(#goldRing)" strokeWidth="6" fill="none" />
      <line x1="14" y1="44" x2="14" y2="52" stroke="url(#goldRing)" strokeWidth="6" />
      <line x1="66" y1="44" x2="66" y2="52" stroke="url(#goldRing)" strokeWidth="6" />
      <polygon points="40,18 48,30 40,26 32,30" fill="url(#gemGrad)" />
      <polygon points="40,26 48,30 40,36 32,30" fill="url(#gemGrad)" opacity="0.6" />
      <circle cx="40" cy="28" r="2" fill="white" opacity="0.8" />
    </svg>
  );
}

function NecklaceIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldN" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <path d="M14 18 Q14 10 22 10 Q30 10 34 22 Q37 30 40 32 Q43 30 46 22 Q50 10 58 10 Q66 10 66 18" stroke="url(#goldN)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="42" rx="10" ry="14" stroke="url(#goldN)" strokeWidth="3.5" fill="rgba(201,168,76,0.1)" />
      <ellipse cx="40" cy="40" rx="5" ry="7" fill="url(#goldN)" opacity="0.5" />
      <circle cx="40" cy="36" r="2.5" fill="#e8d09e" />
      <circle cx="40" cy="36" r="1" fill="white" opacity="0.9" />
    </svg>
  );
}

function BraceletIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="40" rx="28" ry="16" stroke="url(#goldB)" strokeWidth="7" fill="none" />
      <ellipse cx="40" cy="40" rx="20" ry="9" stroke="rgba(232,208,158,0.2)" strokeWidth="2" fill="none" />
      <circle cx="40" cy="24" r="4" fill="url(#goldB)" />
      <circle cx="40" cy="24" r="2" fill="white" opacity="0.7" />
    </svg>
  );
}

function EarringIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldE" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      {/* Gauche */}
      <circle cx="24" cy="16" r="5" stroke="url(#goldE)" strokeWidth="3" fill="none" />
      <line x1="24" y1="21" x2="24" y2="32" stroke="url(#goldE)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="24" cy="46" rx="7" ry="10" stroke="url(#goldE)" strokeWidth="3" fill="rgba(201,168,76,0.15)" />
      <circle cx="24" cy="42" r="2" fill="#e8d09e" />
      {/* Droite */}
      <circle cx="56" cy="16" r="5" stroke="url(#goldE)" strokeWidth="3" fill="none" />
      <line x1="56" y1="21" x2="56" y2="32" stroke="url(#goldE)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="56" cy="46" rx="7" ry="10" stroke="url(#goldE)" strokeWidth="3" fill="rgba(201,168,76,0.15)" />
      <circle cx="56" cy="42" r="2" fill="#e8d09e" />
    </svg>
  );
}

function PendantIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldP" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <path d="M20 12 Q40 8 60 12" stroke="url(#goldP)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="10" x2="40" y2="24" stroke="url(#goldP)" strokeWidth="3" />
      <circle cx="40" cy="26" r="4" fill="url(#goldP)" />
      <polygon points="40,30 52,48 40,44 28,48" fill="url(#goldP)" opacity="0.8" />
      <polygon points="40,44 52,48 40,62 28,48" fill="url(#goldP)" opacity="0.5" />
      <circle cx="40" cy="44" r="3" fill="#e8d09e" />
      <circle cx="40" cy="44" r="1.2" fill="white" opacity="0.9" />
    </svg>
  );
}

function StarIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldS" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <polygon points="40,8 47,28 68,28 52,42 58,62 40,50 22,62 28,42 12,28 33,28" fill="url(#goldS)" opacity="0.9" />
      <polygon points="40,18 44,30 57,30 47,38 51,50 40,42 29,50 33,38 23,30 36,30" fill="#e8d09e" opacity="0.4" />
      <circle cx="40" cy="34" r="5" fill="white" opacity="0.7" />
    </svg>
  );
}

function ExchangeIcon() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldX" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <path d="M14 30 H60 L50 20" stroke="url(#goldX)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M66 50 H20 L30 60" stroke="url(#goldX)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function HammerIcon() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldH" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d2f" />
          <stop offset="50%" stopColor="#e8d09e" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="36" height="22" rx="5" fill="url(#goldH)" />
      <rect x="38" y="20" width="12" height="10" rx="2" fill="#e8d09e" opacity="0.6" />
      <line x1="30" y1="36" x2="18" y2="64" stroke="url(#goldH)" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

// ── Composants ─────────────────────────────────────────────────────────────

function Sparkle({ x, y, size, delay }: { x: string; y: string; size: number; delay: string }) {
  return (
    <div
      className="sparkle"
      style={{ left: x, top: y, width: size, height: size, animationDelay: delay }}
    />
  );
}

function WhatsAppButton({ label = "Commander sur WhatsApp", large = false }: { label?: string; large?: boolean }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-2xl font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        large
          ? "px-10 py-5 text-lg"
          : "px-7 py-4 text-base"
      }`}
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        color: "#fff",
        boxShadow: "0 8px 40px rgba(37,211,102,0.35)",
      }}
    >
      <svg width={large ? 26 : 22} height={large ? 26 : 22} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L0 24l6.335-1.648A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.49-5.17-1.348l-.37-.22-3.762.977.998-3.652-.24-.38A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
      {label}
    </a>
  );
}

// ── Hook scroll reveal ─────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Page principale ────────────────────────────────────────────────────────

export default function HomePage() {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Refs reveal
  const refServices = useReveal();
  const refCollection = useReveal();
  const refAtouts = useReveal();
  const refContact = useReveal();

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh" }}>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navSolid ? "nav-glass" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black"
              style={{
                background: "linear-gradient(135deg, #8a6d2f, #c9a84c, #e8d09e)",
                color: "#0a0907",
                letterSpacing: "-0.5px",
              }}
            >
              AAT
            </div>
            <div className="hidden sm:block">
              <div className="text-gold font-bold text-base tracking-wide leading-tight">Alpha Amadou Thiam</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "#8a6d2f" }}>Bijoux en Or · Dakar</div>
            </div>
          </a>

          {/* Nav desktop */}
          <div className="hidden md:flex items-center gap-8">
            {["Services", "Collections", "À propos", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace("à ", "").replace(" ", "")}`}
                className="text-sm tracking-widest uppercase transition-colors duration-200 hover:text-yellow-400"
                style={{ color: "#a89070" }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:+221${TEL}`}
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{ borderColor: "#c9a84c", color: "#c9a84c" }}
            >
              📞 {TEL_DISPLAY}
            </a>
          </div>

          {/* Burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            {[0,1,2].map((i) => (
              <span
                key={i}
                className="block h-0.5 rounded transition-all duration-300"
                style={{
                  background: "#c9a84c",
                  width: i === 1 ? (menuOpen ? "20px" : "24px") : "24px",
                }}
              />
            ))}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-6 py-6 flex flex-col gap-5"
            style={{ background: "rgba(10,9,7,0.97)", borderColor: "#2a2215" }}
          >
            {["Services", "Collections", "À propos", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace("à ", "").replace(" ", "")}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase"
                style={{ color: "#c9a84c" }}
              >
                {item}
              </a>
            ))}
            <a href={`tel:+221${TEL}`} className="btn-gold px-5 py-3 rounded-xl text-center text-sm">
              📞 {TEL_DISPLAY}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ paddingTop: 100, paddingBottom: 80 }}
      >
        {/* Fond radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(201,168,76,0.08) 0%, rgba(10,9,7,0) 70%), #0a0907",
          }}
        />

        {/* Halos */}
        <div className="halo" style={{ width: 600, height: 600, top: "10%", left: "50%", transform: "translateX(-50%)", background: "rgba(201,168,76,0.05)" }} />
        <div className="halo" style={{ width: 300, height: 300, top: "5%", right: "5%", background: "rgba(201,168,76,0.07)" }} />
        <div className="halo" style={{ width: 250, height: 250, bottom: "10%", left: "5%", background: "rgba(201,168,76,0.06)" }} />

        {/* Sparkles */}
        <Sparkle x="12%" y="20%" size={8} delay="0s" />
        <Sparkle x="85%" y="15%" size={6} delay="0.8s" />
        <Sparkle x="5%"  y="65%" size={5} delay="1.5s" />
        <Sparkle x="92%" y="60%" size={7} delay="0.4s" />
        <Sparkle x="50%" y="8%"  size={5} delay="2s" />
        <Sparkle x="30%" y="85%" size={6} delay="1.1s" />
        <Sparkle x="70%" y="80%" size={4} delay="0.7s" />

        {/* Ligne décorative */}
        <div className="relative z-10 mb-8 flex items-center gap-4">
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #c9a84c)" }} />
          <div
            className="px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-bold"
            style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            ✦ Marché Tilène · Dakar · Sénégal ✦
          </div>
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
        </div>

        {/* Icône centrale animée */}
        <div className="relative z-10 mb-8" style={{ animation: "floatUp 5s ease-in-out infinite" }}>
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(138,109,47,0.2), rgba(201,168,76,0.15))",
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 0 60px rgba(201,168,76,0.2), inset 0 0 30px rgba(201,168,76,0.05)",
            }}
          >
            <RingIcon size={72} />
          </div>
        </div>

        {/* Nom */}
        <p className="relative z-10 text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "#8a6d2f" }}>
          Alpha Amadou Thiam
        </p>

        {/* Titre principal */}
        <h1 className="relative z-10 font-serif leading-none mb-6" style={{ letterSpacing: "-1px" }}>
          <span
            className="block text-6xl md:text-8xl lg:text-9xl font-black text-gold"
            style={{ lineHeight: 0.95 }}
          >
            BIJOUX
          </span>
          <span
            className="block text-5xl md:text-7xl lg:text-8xl font-black mt-2"
            style={{ color: "#f5f0e8", lineHeight: 0.95 }}
          >
            EN OR
          </span>
        </h1>

        {/* Sous-titre */}
        <p
          className="relative z-10 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#a89070" }}
        >
          Achat · Vente · Échange · Travail sur Commande<br />
          <span style={{ color: "#6b5218", fontSize: "0.9em" }}>
            Expertise reconnue depuis plus de 30 ans au cœur de Dakar
          </span>
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center">
          <WhatsAppButton label="Contacter sur WhatsApp" large />
          <a
            href="#collections"
            className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(201,168,76,0.08)",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            Voir la Vitrine ↓
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#8a6d2f" }}>Défiler</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, #c9a84c, transparent)" }} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={refServices} className="reveal">
            {/* Titre section */}
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#8a6d2f" }}>Nos Expertises</p>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-gold mb-4">Nos Services</h2>
              <div className="divider-gold w-24 mx-auto" />
            </div>

            {/* Grid services */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((s) => (
                <div key={s.titre} className="card-bijou rounded-3xl p-8 flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `radial-gradient(circle, ${s.couleur}18 0%, rgba(10,9,7,0) 70%)`,
                      border: `1px solid ${s.couleur}30`,
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3" style={{ color: s.couleur }}>
                    {s.titre}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7a6a55" }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ── VITRINE / COLLECTIONS ── */}
      <section id="collections" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={refCollection} className="reveal">
            {/* Titre */}
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#8a6d2f" }}>Notre Vitrine</p>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-gold mb-4">Collections</h2>
              <p className="max-w-lg mx-auto text-base" style={{ color: "#7a6a55" }}>
                Des pièces d&apos;exception en or 18 et 24 carats, disponibles en boutique et sur commande.
              </p>
              <div className="divider-gold w-24 mx-auto mt-4" />
            </div>

            {/* Grid collections */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COLLECTIONS.map((col) => (
                <div
                  key={col.nom}
                  className="card-bijou rounded-3xl overflow-hidden group cursor-pointer"
                  onClick={() => window.open(WA_LINK, "_blank")}
                >
                  {/* Visuel */}
                  <div
                    className="relative h-52 flex items-center justify-center overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #111009 0%, #1e160a 100%)",
                    }}
                  >
                    {/* Halo derrière l'icône */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 65%)",
                      }}
                    />
                    <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                      {col.icon}
                    </div>
                    {/* Sparkles */}
                    <div className="sparkle absolute" style={{ width: 6, height: 6, top: "20%", left: "20%", animationDelay: "0.3s" }} />
                    <div className="sparkle absolute" style={{ width: 5, height: 5, top: "25%", right: "22%", animationDelay: "1.1s" }} />
                    <div className="sparkle absolute" style={{ width: 4, height: 4, bottom: "20%", left: "30%", animationDelay: "0.7s" }} />
                  </div>

                  {/* Texte */}
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-1" style={{ color: "#e8d09e" }}>
                        {col.nom}
                      </h3>
                      <p className="text-xs tracking-widest uppercase" style={{ color: "#6b5218" }}>
                        {col.desc}
                      </p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}
                    >
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-14">
              <WhatsAppButton label="Demander un devis sur WhatsApp" large />
              <p className="mt-4 text-sm" style={{ color: "#6b5218" }}>
                Toutes les pièces sont disponibles à la bijouterie ou livrables sur commande
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ── À PROPOS ── */}
      <section
        id="apropos"
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0b07 0%, #0a0907 100%)" }}
      >
        <div className="halo" style={{ width: 400, height: 400, top: "50%", right: "-10%", transform: "translateY(-50%)", background: "rgba(201,168,76,0.06)" }} />

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Colonne gauche — Ornement */}
            <div className="flex justify-center">
              <div
                className="relative w-72 h-72 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(138,109,47,0.15), rgba(201,168,76,0.08))",
                  border: "1px solid rgba(201,168,76,0.2)",
                  boxShadow: "0 0 80px rgba(201,168,76,0.1), inset 0 0 40px rgba(201,168,76,0.05)",
                }}
              >
                {/* Anneaux concentriques */}
                <div
                  className="absolute w-full h-full rounded-full"
                  style={{ border: "1px solid rgba(201,168,76,0.12)", transform: "scale(1.1)" }}
                />
                <div
                  className="absolute w-full h-full rounded-full"
                  style={{ border: "1px solid rgba(201,168,76,0.08)", transform: "scale(1.22)" }}
                />

                <div className="text-center z-10">
                  <div
                    className="text-8xl font-black font-serif text-gold leading-none"
                    style={{ letterSpacing: "-4px" }}
                  >
                    AAT
                  </div>
                  <div className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: "#8a6d2f" }}>
                    Master Bijoutier
                  </div>
                </div>

                {/* Sparkles autour */}
                {[
                  { top: "5%", left: "50%" }, { top: "50%", left: "3%" },
                  { top: "50%", right: "3%" }, { bottom: "5%", left: "50%" },
                ].map((pos, i) => (
                  <div key={i} className="sparkle absolute" style={{ ...pos, width: 8, height: 8, animationDelay: `${i * 0.6}s` }} />
                ))}
              </div>
            </div>

            {/* Colonne droite — Texte */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#8a6d2f" }}>À Propos</p>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-gold mb-6 leading-tight">
                Alpha Amadou Thiam
              </h2>

              <p className="text-base leading-relaxed mb-5" style={{ color: "#a89070" }}>
                Maître bijoutier installé au cœur du <strong style={{ color: "#c9a84c" }}>Marché Tilène</strong>,
                Alpha Amadou Thiam est une référence reconnue dans le négoce et la création de bijoux en or
                à Dakar depuis plus de 30 ans.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#7a6a55" }}>
                Qu&apos;il s&apos;agisse d&apos;acheter, de vendre, d&apos;échanger ou de faire façonner une pièce
                unique sur commande, son expertise garantit transparence, qualité et juste prix.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { v: "30+", l: "Ans d'expérience" },
                  { v: "100%", l: "Or certifié" },
                  { v: "⭐⭐⭐", l: "Confiance clients" },
                ].map(({ v, l }) => (
                  <div
                    key={l}
                    className="rounded-2xl p-4 text-center"
                    style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}
                  >
                    <div className="text-xl font-black text-gold">{v}</div>
                    <div className="text-xs mt-1" style={{ color: "#6b5218" }}>{l}</div>
                  </div>
                ))}
              </div>

              <WhatsAppButton label="Prendre contact" />
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ── ATOUTS ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={refAtouts} className="reveal">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#8a6d2f" }}>Pourquoi Nous</p>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-gold mb-4">Nos Engagements</h2>
              <div className="divider-gold w-24 mx-auto" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ATOUTS.map((a) => (
                <div key={a.titre} className="card-bijou rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-5">{a.emoji}</div>
                  <h3 className="font-serif text-lg font-bold mb-3" style={{ color: "#e8d09e" }}>
                    {a.titre}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7a6a55" }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0b07 0%, #0a0907 100%)" }}
      >
        <div className="halo" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(201,168,76,0.05)" }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div ref={refContact} className="reveal">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#8a6d2f" }}>Contact</p>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-gold mb-6">
              Parlons Or
            </h2>
            <p className="text-base leading-relaxed mb-12" style={{ color: "#a89070" }}>
              Besoin d&apos;une estimation, d&apos;un bijou sur commande ou d&apos;une vente ?<br />
              Contactez-nous directement — réponse immédiate.
            </p>

            {/* Carte contact */}
            <div
              className="rounded-3xl p-10 md:p-14 mb-10"
              style={{
                background: "linear-gradient(145deg, #111009, #1a1508)",
                border: "1px solid rgba(201,168,76,0.25)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.06)",
              }}
            >
              {/* Téléphone */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#6b5218" }}>Téléphone</p>
                <a
                  href={`tel:+221${TEL}`}
                  className="text-4xl md:text-5xl font-black text-gold transition-opacity hover:opacity-80 font-serif"
                >
                  {TEL_DISPLAY}
                </a>
                <p className="text-sm mt-2" style={{ color: "#6b5218" }}>Appel & WhatsApp disponibles</p>
              </div>

              <div className="divider-gold mb-8" />

              {/* Adresse */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#6b5218" }}>Adresse</p>
                <p className="text-xl font-bold" style={{ color: "#e8d09e" }}>Marché Tilène</p>
                <p className="text-base" style={{ color: "#8a6d2f" }}>Dakar, Sénégal</p>
              </div>

              <div className="divider-gold mb-8" />

              {/* Services */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {["Achat", "Vente", "Échange", "Sur Commande"].map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 rounded-full text-sm font-bold tracking-wide"
                    style={{
                      background: "rgba(201,168,76,0.1)",
                      color: "#c9a84c",
                      border: "1px solid rgba(201,168,76,0.25)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WhatsAppButton label="WhatsApp" large />
                <a
                  href={`tel:+221${TEL}`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-lg font-bold tracking-wide transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    color: "#c9a84c",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  📞 Appeler
                </a>
              </div>
            </div>

            {/* Horaires */}
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm"
              style={{
                background: "rgba(201,168,76,0.07)",
                color: "#8a6d2f",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              🕐 Ouvert tous les jours — Marché Tilène, Dakar
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050402", borderTop: "1px solid #1a1408" }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Top */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="text-center md:text-left">
              <div className="text-3xl font-black text-gold font-serif mb-1">Alpha Amadou Thiam</div>
              <div className="text-sm tracking-widest uppercase" style={{ color: "#6b5218" }}>
                Bijoux en Or · Marché Tilène · Dakar
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.25)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L0 24l6.335-1.648A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.49-5.17-1.348l-.37-.22-3.762.977.998-3.652-.24-.38A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
              <a
                href={`tel:+221${TEL}`}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 text-xl"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                📞
              </a>
            </div>
          </div>

          <div className="divider-gold mb-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "#4a380f" }}>
            <p>© {new Date().getFullYear()} Alpha Amadou Thiam · Tous droits réservés</p>
            <p className="tracking-widest uppercase">Bijoux en Or · Marché Tilène · Dakar · Sénégal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
