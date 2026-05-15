import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BrandingSection() {
  return (
    <section className="py-20 bg-gray-950 overflow-hidden relative">
      {/* Orbes décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-vert-800/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-vert-900/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Titre section */}
        <div className="text-center mb-14">
          <p className="text-vert-400 text-xs font-bold uppercase tracking-[0.4em] mb-3">Notre Identité</p>
          <h2 className="text-white font-black text-4xl md:text-5xl leading-tight mb-4">
            Agence Touba Visuel
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Image &amp; Communication — Une agence de référence au Sénégal
          </p>
        </div>

        {/* Grille images */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">

          {/* Logo 3D — image principale */}
          <div className="relative rounded-3xl overflow-hidden group shadow-2xl">
            <div className="relative aspect-video w-full">
              <Image
                src="/images/atv-vitrine.jpg"
                alt="Façade Agence Touba Visuel"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="bg-vert-600/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Notre Agence
                </span>
              </div>
            </div>
          </div>

          {/* Studio ATV */}
          <div className="relative rounded-3xl overflow-hidden group shadow-2xl">
            <div className="relative aspect-video w-full">
              <Image
                src="/images/atv-studio.jpg"
                alt="Studio Agence Touba Visuel"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Notre Studio
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bandeau services vitrine */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "🎨", titre: "Conception Graphique", desc: "Visuels publicitaires & institutionnels haut de gamme" },
            { icon: "🖨️", titre: "Impression Tous Formats", desc: "Flyers, bâches, banderoles, roll-up, enseignes" },
            { icon: "🌐", titre: "Sites Web Pro", desc: "Création complète de A à Z, rapide et moderne" },
          ].map((item) => (
            <div key={item.titre}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-vert-600/30 transition-all duration-300 group">
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-vert-300 transition-colors">
                {item.titre}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/catalogue"
              className="group inline-flex items-center gap-2 bg-vert-600 hover:bg-vert-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-vert-600/30">
              Découvrir nos services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://wa.me/221778001717" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-vert-500 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-sm">
              📱 Nous contacter
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-5 tracking-widest uppercase font-medium">
            IMAGE &amp; COMMUNICATION — TOUBA VISUEL
          </p>
        </div>
      </div>
    </section>
  );
}
