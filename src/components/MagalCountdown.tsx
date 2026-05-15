"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function MagalCountdown() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocs = [
    { valeur: time.jours, label: "JOURS" },
    { valeur: time.heures, label: "HEURES" },
    { valeur: time.minutes, label: "MINUTES" },
    { valeur: time.secondes, label: "SECONDES" },
  ];

  return (
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
        {/* Titre */}
        <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 leading-tight">
          ⏳ Compte à rebours — Magal de Touba 2026
        </h2>
        <p
          className="font-semibold text-base md:text-lg mb-12 tracking-wide"
          style={{ color: "#ffc800" }}
        >
          18 Safar 1448 · Août 2026
        </p>

        {/* Blocs */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {blocs.map(({ valeur, label }) => (
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

        {/* CTA */}
        <Link
          href="/magal"
          className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-gray-900 text-base shadow-xl transition-all duration-200 hover:scale-105"
          style={{ background: "linear-gradient(135deg, #ffc800 0%, #ff7a2a 100%)" }}
        >
          Commander pour le Magal →
        </Link>
      </div>
    </section>
  );
}
