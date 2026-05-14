import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Bannière principale */}
      <div className="relative w-full" style={{ aspectRatio: "1500/530" }}>
        <Image
          src="/images/atv-banner.jpg"
          alt="Agence Touba Visuel — Image & Communication"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Overlay gradient bas pour accrocher les boutons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Boutons CTA par-dessus la bannière */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 bg-white text-vert-950 font-bold text-sm px-7 py-3 rounded-xl hover:bg-vert-50 transition-all duration-200 shadow-2xl"
          >
            Voir le catalogue
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://wa.me/221778001717"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-vert-700/90 hover:bg-vert-600 backdrop-blur-sm text-white font-bold text-sm px-7 py-3 rounded-xl transition-all duration-200 shadow-xl border border-vert-500/30"
          >
            📱 WhatsApp — Devis gratuit
          </a>
        </div>
      </div>

      {/* Barre de stats sous la bannière */}
      <div className="bg-gray-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { chiffre: "500+", label: "Clients satisfaits" },
              { chiffre: "8",    label: "Catégories de services" },
              { chiffre: "48h",  label: "Délai express" },
              { chiffre: "4.9★", label: "Note moyenne" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-black text-xl md:text-2xl">{s.chiffre}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vague de séparation */}
      <div className="absolute bottom-[56px] left-0 right-0 pointer-events-none hidden md:block">
        <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-20">
          <path d="M0 30L1440 30L1440 15C1320 28 1200 2 1080 15C960 28 840 2 720 15C600 28 480 2 360 15C240 28 120 2 0 15L0 30Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
