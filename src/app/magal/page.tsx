"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Countdown ──────────────────────────────────────────────────────────────

const TARGET = new Date("2026-08-02T00:00:00");

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { jours: 0, heures: 0, minutes: 0, secondes: 0 };
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

// ── Données ────────────────────────────────────────────────────────────────

const PACK_ITEMS = [
  "1 Banderole 3 m × 0,80 m",
  "1 Kakémono événementiel",
  "50 Badges personnalisés",
  "50 Tee-shirts personnalisés",
  "1 Visuel MAGAL pour réseaux sociaux",
  "100 Étiquettes bouteilles personnalisées",
];

const CIBLES = ["Dahiras", "Associations", "Groupes d'amis", "Familles", "Organisations", "Commerçants"];

const guide = [
  {
    icon: "🕌",
    titre: "Histoire du Magal",
    texte:
      "Le Grand Magal de Touba commémore le départ en exil de Cheikh Ahmadou Bamba Mbacké, fondateur du mouridisme, ordonné par les autorités coloniales françaises en 1895. Chaque année, des millions de fidèles convergent vers la ville sainte de Touba.",
  },
  {
    icon: "🗓️",
    titre: "Dates importantes",
    texte:
      "Le Magal 2026 est prévu le 18 Safar 1448, le 2 août 2026. Les pèlerins arrivent progressivement les jours précédents. Préparez votre communication au moins 2 à 4 semaines avant l'événement.",
  },
  {
    icon: "🚌",
    titre: "Comment s'y rendre",
    texte:
      "Touba est accessible depuis Dakar via l'autoroute Ila Touba (environ 2 h). Des cars rapides, bus Tata et taxis partagés desservent la ville sainte. Des navettes spéciales sont organisées pendant le Magal depuis les principales villes du Sénégal.",
  },
  {
    icon: "📋",
    titre: "Checklist pèlerin",
    texte:
      "Prévoyez : eau en quantité, vêtements légers et couvrants, prière de voyage, numéros d'urgence, petite monnaie, plan de la ville, hébergement réservé à l'avance. Respectez les règles de la ville sainte.",
  },
];

const offresRegie = [
  {
    nom: "Bronze",
    prix: "50 000 F",
    items: ["Bannière sur le site — 1 semaine"],
    accent: "#cd7f32",
  },
  {
    nom: "Argent",
    prix: "150 000 F",
    items: ["Bannière — 1 mois", "Post réseaux sociaux ATV"],
    accent: "#adb5bd",
  },
  {
    nom: "Or",
    prix: "300 000 F",
    items: [
      "Package complet — mois du Magal",
      "Bannières + articles sponsorisés",
      "Emails à la base clients ATV",
    ],
    accent: "#ffc800",
  },
];

// ── Partage Réseaux Sociaux ────────────────────────────────────────────────

const PAGE_URL = "https://touba-visuel.vercel.app/magal";

function ShareCountdown({ jours }: { jours: number }) {
  const [copie, setCopie] = useState(false);
  const msg = `⏳ Plus que ${jours} jour${jours > 1 ? "s" : ""} avant le Grand Magal de Touba 2026 ! 🕌\n18 Safar 1448 · 2 Août 2026\n\nPréparez votre communication avec Agence Touba Visuel 👇\n${PAGE_URL}`;

  const RESEAUX = [
    {
      nom: "Facebook",
      bg: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PAGE_URL)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      nom: "X / Twitter",
      bg: "#000000",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`⏳ Plus que ${jours} jours avant le Grand Magal de Touba 2026 ! 🕌 18 Safar 1448 · 2 Août 2026\n\n`)}&url=${encodeURIComponent(PAGE_URL)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      nom: "WhatsApp",
      bg: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(msg)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      nom: "Telegram",
      bg: "#0088cc",
      href: `https://t.me/share/url?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(`⏳ Plus que ${jours} jours avant le Grand Magal de Touba 2026 ! 🕌`)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
  ];

  async function copierLien() {
    await navigator.clipboard.writeText(PAGE_URL);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
        Partager le compte à rebours
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {RESEAUX.map((r) => (
          <a
            key={r.nom}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:opacity-90 shadow-lg"
            style={{ background: r.bg }}
          >
            {r.icon}
            {r.nom}
          </a>
        ))}
        <button
          onClick={copierLien}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all"
        >
          {copie ? (
            <><span className="text-green-400">✓</span> Copié !</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copier le lien</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Bouton Partager (pack) ─────────────────────────────────────────────────

function ShareButton() {
  const [copie, setCopie] = useState(false);

  const texte = `🔥 PACK MAGAL TOUBA 2026 🔥\n« Votre communication Magal clé en main. »\n\n✅ 1 Banderole 3m×0,80m\n✅ 1 Kakémono événementiel\n✅ 50 Badges personnalisés\n✅ 50 Tee-shirts personnalisés\n✅ 1 Visuel MAGAL réseaux sociaux\n✅ 100 Étiquettes bouteilles\n\n💰 PACK COMPLET : 199 999 FCFA\n📞 76 800 17 17\n\n👉 Commander : ${PAGE_URL}\n📍 Agence Touba Visuel (ATV) — Touba`;

  const partager = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Pack Magal Touba 2026 — ATV", text: texte, url: PAGE_URL });
    } else {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    }
  };

  return (
    <button
      onClick={partager}
      className="inline-flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-2xl text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all text-gray-700"
    >
      {copie ? (
        <><span className="text-green-600 font-bold">✓</span> Texte copié !</>
      ) : (
        <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg> Partager ce pack</>
      )}
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MagalPage() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocsCountdown = [
    { valeur: time.jours, label: "JOURS" },
    { valeur: time.heures, label: "HEURES" },
    { valeur: time.minutes, label: "MINUTES" },
    { valeur: time.secondes, label: "SECONDES" },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* ── A. Hero ── */}
      <section
        className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-4 py-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #07402b 0%, #0a2e1f 60%, #000000 100%)",
        }}
      >
        {/* Halo décoratif */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-400/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-900/30 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "linear-gradient(135deg, #ffc800, #ff7a2a)",
              color: "#000",
            }}
          >
            Magal 2026
          </span>

          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-6">
            Votre communication<br />pour le Magal de Touba
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed">
            Des millions de pèlerins. Une opportunité unique pour votre marque.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-gray-900 text-base shadow-xl transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)" }}
            >
              Commander maintenant
            </Link>
            <a
              href="https://wa.me/221768001717?text=Je veux un devis pour le Magal de Touba 2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-2xl text-white text-base border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              Devis WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── B. Countdown inline ── */}
      <section
        className="relative w-full py-20 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #07402b 0%, #0a2e1f 50%, #000000 100%)",
        }}
      >
        {/* Motif islamique subtil */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ffc800 0, #ffc800 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #ffc800 0, #ffc800 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 leading-tight">
            ⏳ Compte à rebours — Magal de Touba 2026
          </h2>
          <p
            className="font-semibold text-base md:text-lg mb-12 tracking-wide"
            style={{ color: "#ffc800" }}
          >
            18 Safar 1448 · 2 Août 2026
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            {blocsCountdown.map(({ valeur, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center w-28 h-28 md:w-40 md:h-40 rounded-2xl shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)",
                }}
              >
                <span className="text-4xl md:text-6xl font-black text-gray-900 leading-none">
                  {String(valeur).padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-900 font-bold tracking-widest mt-1 uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/221768001717?text=Je veux commander pour le Magal de Touba 2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-gray-900 text-base shadow-xl transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)" }}
          >
            Réserver maintenant →
          </a>

          <ShareCountdown jours={time.jours} />
        </div>
      </section>

      {/* ── C. Pack Magal Unique ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Titre section */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 text-gray-900"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
              🔥 Offre spéciale Magal 2026
            </span>
            <h2 className="section-title mb-3">Votre communication Magal clé en main</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Préparez votre présence au Magal avec un pack complet, professionnel et prêt à l&apos;emploi.
            </p>
          </div>

          {/* Grande carte pack */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2" style={{ borderColor: "#ffc800" }}>

            {/* Header doré */}
            <div className="text-center py-5 px-6" style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
              <p className="text-gray-900 font-black text-2xl tracking-wide">🔥 PACK MAGAL TOUBA 2026 🔥</p>
              <p className="text-gray-900/70 text-sm font-semibold mt-1">« Votre communication Magal clé en main. »</p>
            </div>

            <div className="bg-white p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-start">

                {/* Colonne gauche — contenu du pack */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-vert-600 mb-5">Ce que vous recevez :</p>
                  <ul className="space-y-4 mb-8">
                    {PACK_ITEMS.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                          style={{ background: "linear-gradient(135deg, #07402b, #0a6342)" }}>✓</span>
                        <span className="font-semibold text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Atouts */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["🎨 Design professionnel", "⚡ Livraison rapide", "📍 Personnalisation complète"].map((a) => (
                      <span key={a} className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">{a}</span>
                    ))}
                  </div>

                  {/* Compatibilité réseaux */}
                  <p className="text-xs text-gray-400 font-semibold">
                    📱 Compatible · <span className="text-blue-600">Facebook</span> · <span className="text-gray-900">TikTok</span> · <span className="text-green-600">WhatsApp</span>
                  </p>
                </div>

                {/* Colonne droite — prix + cibles + CTA */}
                <div className="flex flex-col items-center text-center">

                  {/* Prix */}
                  <div className="mb-6">
                    <p className="text-7xl font-black leading-none" style={{ color: "#07402b" }}>199 999</p>
                    <p className="text-2xl font-black text-gray-700">FCFA</p>
                    <p className="text-xs text-gray-400 mt-1">Pack complet · Tout inclus</p>
                  </div>

                  {/* Idéal pour */}
                  <div className="w-full bg-gray-50 rounded-2xl p-5 mb-6">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Idéal pour :</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {CIBLES.map((c) => (
                        <span key={c} className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                          style={{ background: "linear-gradient(135deg, #07402b, #0a6342)" }}>{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex flex-col gap-3 w-full">
                    <a href="https://wa.me/221768001717?text=Je veux le Pack Magal Touba 2026 — 199 999 FCFA"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full font-black py-4 rounded-2xl text-white text-base shadow-xl hover:opacity-90 transition-all"
                      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L0 24l6.335-1.648A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.49-5.17-1.348l-.37-.22-3.762.977.998-3.652-.24-.38A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                      Commander sur WhatsApp
                    </a>
                    <a href="tel:+221768001717"
                      className="flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-2xl text-gray-700 text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all">
                      📞 76 800 17 17
                    </a>
                    <ShareButton />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer carte */}
            <div className="text-center py-4 px-6 bg-gray-900">
              <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                📍 Agence Touba Visuel — ATV · Touba, Sénégal
              </p>
              <p className="text-yellow-400 text-xs font-black mt-1">
                🔥 Donnez une image forte à votre présence au Magal.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── D. Guide pratique pèlerin ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Guide pratique pour le Magal</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Tout ce que vous devez savoir pour préparer votre voyage à Touba.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guide.map((item) => (
              <div
                key={item.titre}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col"
              >
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className="font-bold text-gray-900 text-base mb-3">{item.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── E. Régie Publicitaire Magal ── */}
      <section
        className="py-20 px-4"
        style={{
          background: "linear-gradient(135deg, #07402b 0%, #0a3a20 50%, #1a1a00 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Votre marque vue par des millions de pèlerins
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Pendant le Grand Magal, le site ATV est visité par des milliers de fidèles qui cherchent
              des services et des produits. Profitez d'une visibilité exceptionnelle grâce à nos espaces
              publicitaires : bannières display, articles sponsorisés et campagnes email vers notre base clients.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {offresRegie.map((offre) => (
              <div
                key={offre.nom}
                className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-7 flex flex-col"
              >
                <div
                  className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4 self-start text-gray-900"
                  style={{ backgroundColor: offre.accent }}
                >
                  {offre.nom}
                </div>
                <p
                  className="text-3xl font-black mb-1 leading-none"
                  style={{ color: offre.accent }}
                >
                  {offre.prix}
                </p>
                <p className="text-white/40 text-xs mb-5">TTC</p>
                <ul className="space-y-2 flex-1">
                  {offre.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/80 text-sm">
                      <span style={{ color: offre.accent }} className="font-bold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://wa.me/221768001717?text=Je veux réserver un espace publicitaire pour le Magal 2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-2xl text-gray-900 text-base shadow-xl transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)" }}
            >
              Réserver votre espace pub →
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
