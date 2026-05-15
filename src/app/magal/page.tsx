"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// ── Countdown ──────────────────────────────────────────────────────────────

const TARGET = new Date("2026-08-24T00:00:00");

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

const packs = [
  {
    nom: "Essentiel",
    prix: "49 999 F",
    couleur: "#0a6342",
    items: [
      "Flyers A5 — 500 exemplaires",
      "Roll-up 1 m",
      "Livraison à Touba",
    ],
  },
  {
    nom: "Pro",
    prix: "99 999 F",
    couleur: "#1d9c68",
    star: true,
    items: [
      "Flyers — 1 000 exemplaires",
      "Banderole 3 m",
      "50 t-shirts personnalisés",
      "Création graphique incluse",
      "Livraison à Touba",
    ],
  },
  {
    nom: "Premium",
    prix: "199 999 F",
    couleur: "#07402b",
    items: [
      "Tout le Pack Pro × 2",
      "Enseignes lumineuses",
      "Campagne réseaux sociaux",
      "Photos & vidéo terrain",
      "Livraison prioritaire à Touba",
    ],
  },
];

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
      "Le Magal 2026 est prévu le 18 Safar 1448, estimé au 24 août 2026. Les pèlerins arrivent progressivement les jours précédents. Préparez votre communication au moins 2 à 4 semaines avant l'événement.",
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
              href="https://wa.me/221778001717?text=Je veux un devis pour le Magal de Touba 2026"
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
            18 Safar 1448 · Août 2026
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
            href="https://wa.me/221778001717?text=Je veux commander pour le Magal de Touba 2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-gray-900 text-base shadow-xl transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)" }}
          >
            Réserver maintenant →
          </a>
        </div>
      </section>

      {/* ── C. Packs Magal ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Packs Magal 2026</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Tout ce qu'il faut pour une présence forte pendant le Grand Magal de Touba.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <div
                key={pack.nom}
                className={`relative flex flex-col rounded-3xl border ${
                  pack.star
                    ? "border-yellow-400 shadow-2xl scale-105"
                    : "border-gray-200 shadow-md"
                } bg-white overflow-hidden`}
              >
                {pack.star && (
                  <div
                    className="text-center text-xs font-black uppercase tracking-widest py-2 text-gray-900"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
                  >
                    ⭐ Le plus populaire
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <div
                    className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4 self-start"
                    style={{ backgroundColor: pack.couleur }}
                  >
                    Pack {pack.nom}
                  </div>

                  <p
                    className="text-4xl font-black mb-1 leading-none"
                    style={{ color: pack.couleur }}
                  >
                    {pack.prix}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">TTC · livraison incluse</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pack.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/221778001717?text=Je veux le Pack ${pack.nom} pour le Magal 2026`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full font-bold py-3.5 rounded-xl text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                    style={{ backgroundColor: pack.couleur }}
                  >
                    Commander ce pack
                  </a>
                </div>
              </div>
            ))}
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
              href="https://wa.me/221778001717?text=Je veux réserver un espace publicitaire pour le Magal 2026"
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
