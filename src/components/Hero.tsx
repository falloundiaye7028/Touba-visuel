import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const services = [
  { icon: "🎨", label: "Visuels publicitaires & institutionnels" },
  { icon: "🖨️", label: "Impression grand format & événementiel" },
  { icon: "✦",  label: "Logos & identité visuelle" },
  { icon: "🌐", label: "Sites web modernes & professionnels" },
  { icon: "📱", label: "Branding réseaux sociaux & digital" },
  { icon: "📋", label: "Flyers, bâches, roll-up, enseignes" },
  { icon: "🎬", label: "Vidéo promotionnelle & communication" },
];

const stats = [
  { chiffre: "500+", label: "Clients satisfaits" },
  { chiffre: "8",    label: "Catégories de services" },
  { chiffre: "48h",  label: "Délai express" },
  { chiffre: "4.9★", label: "Note moyenne" },
];

export default function Hero() {
  return (
    <section className="relative gradient-animated min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Orbes décoratifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/25 blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-or-400/15 blur-[120px] animate-pulse-slow delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-vert-800/10 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-32 w-full">

        {/* Badge top */}
        <div className="flex justify-center mb-10 animate-fade-up">
          <div className="glass rounded-full px-5 py-2.5 flex items-center gap-2.5">
            <Sparkles size={14} className="text-or-400" />
            <span className="text-white/90 text-sm font-medium tracking-widest uppercase">
              Agence Touba Visuel — ATV
            </span>
            <Sparkles size={14} className="text-orange-400" />
          </div>
        </div>

        {/* TOUBA VISUEL — Typographie massive */}
        <div className="text-center mb-8 animate-fade-up delay-100">
          <h1 className="font-black leading-[0.85] tracking-tight">
            <span className="block text-white"
              style={{ fontSize: "clamp(4rem, 14vw, 12rem)" }}>
              TOUBA
            </span>
            <span className="block"
              style={{
                fontSize: "clamp(4rem, 14vw, 12rem)",
                WebkitTextStroke: "clamp(1px, 0.15vw, 2px) rgba(255,255,255,0.7)",
                color: "transparent",
              }}>
              VISUEL
            </span>
          </h1>

          {/* Ligne décorative */}
          <div className="flex items-center justify-center gap-6 my-8">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-white/40" />
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-white/40" />
          </div>

          {/* Tagline */}
          <p className="text-white font-extrabold uppercase tracking-widest mb-6 animate-fade-up delay-200"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.75rem)" }}>
            L&apos;image qui donne de la puissance à votre marque
          </p>

          {/* Sous-titre */}
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-300"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
            Conception graphique haut de gamme, impression tous formats et création de sites web
            professionnels de A à Z. Nous transformons vos idées en supports visuels modernes et impactants.
          </p>
        </div>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up delay-400">
          <Link href="/catalogue"
            className="group inline-flex items-center justify-center gap-3 bg-white text-vert-950 font-bold px-9 py-4 rounded-2xl hover:bg-vert-50 transition-all duration-300 shadow-2xl text-base hover:scale-[1.02]">
            Voir le catalogue
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://wa.me/221768001717" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 glass text-white font-semibold px-9 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300 text-base border border-white/20">
            WhatsApp — Devis gratuit
          </a>
        </div>

        {/* Stats bar */}
        <div className="glass-dark rounded-2xl px-6 py-5 mb-16 animate-fade-up delay-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-black text-2xl md:text-3xl mb-1"
                  style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {s.chiffre}
                </p>
                <p className="text-white/50 text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grille Services + CTA */}
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 glass-dark rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg, #ffc800, #ff7a2a)" }} />
              <h2 className="text-white font-black text-lg uppercase tracking-widest">Nos Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s, i) => (
                <div key={i}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-xl px-4 py-3 transition-all duration-200 group cursor-default">
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <p className="text-white/80 group-hover:text-white text-sm font-medium transition-colors leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass rounded-3xl p-7 flex-1">
              <p className="text-white font-black text-base uppercase tracking-wide mb-3 leading-snug">
                Donnez une autre dimension à votre communication
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Chaque design est pensé pour attirer, convaincre et marquer les esprits — du flyer à la présence digitale complète.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7">
              <p className="text-vert-950 font-black text-base uppercase tracking-wide mb-1">Démarrez maintenant</p>
              <p className="text-gray-500 text-xs mb-5">Devis gratuit sous 24h</p>
              <div className="space-y-2.5">
                <a href="https://wa.me/221768001717" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 w-full hover:scale-[1.02] hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0a6342, #1d9c68)" }}>
                  📱 WhatsApp
                </a>
                <Link href="/devis"
                  className="flex items-center justify-center gap-2 text-gray-900 font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 w-full hover:scale-[1.02] hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
                  Devis en ligne →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center mt-14">
          <p className="text-white/30 text-xs tracking-[0.5em] uppercase font-medium">
            Créativité &nbsp;•&nbsp; Innovation &nbsp;•&nbsp; Impact
          </p>
        </div>
      </div>

      {/* Vague bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1320 75 1200 5 1080 40C960 75 840 5 720 40C600 75 480 5 360 40C240 75 120 5 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
