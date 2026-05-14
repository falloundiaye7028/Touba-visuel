import Link from "next/link";
import { ArrowRight, Star, Package, Clock } from "lucide-react";
import { TOTAL_SUPPORTS, TOTAL_CATEGORIES } from "@/lib/supports";

export default function Hero() {
  return (
    <section className="relative bg-gradient-touba min-h-[88vh] flex items-center overflow-hidden">
      {/* Motif décoratif géométrique */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 border-4 border-or-400 rounded-full" />
        <div className="absolute top-20 right-20 w-48 h-48 border-2 border-or-300 rounded-full" />
        <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-or-400 rotate-45" />
        <div className="absolute bottom-10 left-5 w-20 h-20 border-2 border-vert-300 rotate-45" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-or-400 rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-or-300 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Contenu gauche */}
        <div className="text-white">
          {/* Badge ATV */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="bg-gray-950 border border-or-500/70 rounded-xl px-3 py-1.5 shadow-[0_0_12px_rgba(212,175,55,0.5)]">
              <span className="text-or-400 font-black text-base tracking-tight"
                style={{ textShadow: "0 0 10px #d4af37, 0 0 20px #d4af37" }}>
                ATV
              </span>
            </div>
            <div className="flex items-center gap-2 bg-or-500/20 border border-or-500/40 rounded-full px-4 py-1.5">
              <Star size={14} className="text-or-400 fill-or-400" />
              <span className="text-or-300 text-sm font-medium">
                Agence Touba Visuel — N°1 à Touba
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Tous vos{" "}
            <span className="text-or-400">supports visuels</span>{" "}
            en un seul endroit
          </h1>

          <p className="text-vert-200 text-lg leading-relaxed mb-8 max-w-lg">
            De l&apos;impression papier aux enseignes lumineuses, du textile aux visuels digitaux —
            commandez en ligne, payez facilement, recevez rapidement.
          </p>

          {/* Statistiques rapides */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-or-400" />
              <div>
                <p className="text-white font-bold text-xl">{TOTAL_SUPPORTS}+</p>
                <p className="text-vert-400 text-xs">Supports disponibles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-or-400" />
              <div>
                <p className="text-white font-bold text-xl">48h</p>
                <p className="text-vert-400 text-xs">Délai express</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-or-400 fill-or-400" />
              <div>
                <p className="text-white font-bold text-xl">4.9/5</p>
                <p className="text-vert-400 text-xs">Satisfaction clients</p>
              </div>
            </div>
          </div>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 bg-or-500 hover:bg-or-400 text-vert-950 font-bold text-base px-6 py-3.5 rounded-xl transition-colors duration-200 shadow-lg"
            >
              Voir le catalogue
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors duration-200"
            >
              Commander maintenant
            </Link>
          </div>
        </div>

        {/* Grille de catégories à droite */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {[
            { emoji: "🖨️", label: "Impression & Papier", nb: "19 produits" },
            { emoji: "🏗️", label: "Signalétique & Grand Format", nb: "14 produits" },
            { emoji: "👕", label: "Textile & Objets", nb: "17 produits" },
            { emoji: "💻", label: "Numérique & Digital", nb: "14 produits" },
            { emoji: "🎉", label: "Événementiel", nb: "10 produits" },
            { emoji: "📦", label: "Emballage", nb: "5 produits" },
            { emoji: "🏢", label: "Corporate", nb: "5 produits" },
            { emoji: "📰", label: "Presse & Médias", nb: "4 produits" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href="/catalogue"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 hover:border-or-400/50 transition-all duration-200 group"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-white text-sm font-semibold group-hover:text-or-300 transition-colors leading-tight">
                {cat.label}
              </p>
              <p className="text-vert-400 text-xs mt-1">{cat.nb}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Vague de séparation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 30C1320 60 1200 0 1080 30C960 60 840 0 720 30C600 60 480 0 360 30C240 60 120 0 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
