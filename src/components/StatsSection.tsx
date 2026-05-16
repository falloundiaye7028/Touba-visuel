"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { valeur: 500, suffixe: "+", label: "Clients satisfaits", emoji: "🏆" },
  { valeur: 8,   suffixe: "+", label: "Années d'expérience", emoji: "📅" },
  { valeur: 15,  suffixe: "+", label: "Grandes marques servies", emoji: "🤝" },
  { valeur: 100, suffixe: "%", label: "Satisfaction garantie", emoji: "⭐" },
];

function Counter({ valeur, suffixe }: { valeur: number; suffixe: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = valeur / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= valeur) { setCount(valeur); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [valeur]);

  return <span ref={ref}>{count}{suffixe}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #07402b 0%, #0a6342 50%, #07402b 100%)" }}>
      {/* Motif déco */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full border border-white"
            style={{ width: 80 + i * 40, height: 80 + i * 40, top: "50%", left: "50%",
              transform: "translate(-50%, -50%)" }} />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] mb-3 text-or-400">
            Agence Touba Visuel en chiffres
          </p>
          <h2 className="text-white font-black text-3xl md:text-4xl">
            La confiance de centaines de clients
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label}
              className="card-3d text-center p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="text-4xl mb-3">{s.emoji}</div>
              <p className="font-black text-4xl md:text-5xl mb-2"
                style={{
                  background: "linear-gradient(135deg, #ffc800, #ff7a2a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Syne, sans-serif",
                }}>
                <Counter valeur={s.valeur} suffixe={s.suffixe} />
              </p>
              <p className="text-white/70 text-sm font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
