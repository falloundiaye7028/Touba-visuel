import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  "Conception de visuels publicitaires & institutionnels",
  "Impression grand format & supports événementiels",
  "Création de logos & identité visuelle",
  "Sites web modernes, rapides et professionnels",
  "Branding réseaux sociaux & contenus digitaux",
  "Flyers, panneaux, bâches, roll-up, packaging, enseignes",
  "Vidéo promotionnelle & communication digitale",
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-touba overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/20 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px)"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">

        {/* Titre principal */}
        <div className="text-center mb-16">
          {/* Badge ATV */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="bg-black border border-white/20 rounded-xl px-4 py-2">
              <span className="text-white font-black text-lg tracking-tight"
                style={{ textShadow: "0 0 10px #ffffff, 0 0 20px #ffffff" }}>
                ATV
              </span>
            </div>
          </div>

          {/* TOUBA VISUEL */}
          <h1 className="font-black text-white leading-none mb-6">
            <span className="block text-5xl md:text-7xl lg:text-8xl tracking-widest">TOUBA</span>
            <span
              className="block text-5xl md:text-7xl lg:text-8xl tracking-widest"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.9)", color: "transparent" }}
            >
              VISUEL
            </span>
          </h1>

          {/* Séparateur */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-white/40" />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="h-px w-24 bg-white/40" />
          </div>

          {/* Tagline */}
          <p className="text-white font-bold text-xl md:text-3xl uppercase tracking-wide mb-6 max-w-4xl mx-auto leading-tight">
            L&apos;IMAGE QUI DONNE DE LA PUISSANCE<br className="hidden md:block" /> À VOTRE MARQUE
          </p>

          {/* Description */}
          <p className="text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            Conception graphique haut de gamme, impression tous formats et création de sites web professionnels de A à Z.
            Nous transformons vos idées en supports visuels modernes, impactants et prêts à faire rayonner votre activité
            sur le digital comme sur le terrain.
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 bg-white text-vert-900 font-bold text-base px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
            >
              Voir le catalogue
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors"
            >
              Commander maintenant
            </Link>
          </div>
        </div>

        {/* NOS SERVICES */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 mb-10">
          <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-widest text-center mb-8">
            NOS SERVICES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                <p className="text-white/90 text-sm md:text-base leading-relaxed">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DONNEZ UNE AUTRE DIMENSION + Contact */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-8">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-4">
              DONNEZ UNE AUTRE DIMENSION À VOTRE COMMUNICATION
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Chez Touba Visuel, chaque design est pensé pour attirer, convaincre et marquer les esprits.
              Du simple flyer à la création complète de votre présence digitale, nous vous accompagnons
              de l&apos;idée jusqu&apos;au résultat final.
            </p>
          </div>

          <div className="bg-white text-vert-950 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="font-black text-xl uppercase tracking-wide mb-2">Démarrez votre projet</p>
              <p className="text-vert-700 text-sm mb-6">Contactez-nous pour un devis gratuit</p>
            </div>
            <div className="space-y-3">
              <a
                href="https://wa.me/221778001717"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-vert-700 hover:bg-vert-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors w-full"
              >
                WhatsApp — +221 77 800 17 17
              </a>
              <Link
                href="/devis"
                className="flex items-center justify-center gap-2 border-2 border-vert-700 text-vert-700 hover:bg-vert-700 hover:text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors w-full"
              >
                Demander un devis en ligne
              </Link>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-16 bg-white/30" />
            <p className="text-white/60 font-semibold text-sm tracking-[0.3em] uppercase">
              Créativité &bull; Innovation &bull; Impact
            </p>
            <div className="h-px w-16 bg-white/30" />
          </div>
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
