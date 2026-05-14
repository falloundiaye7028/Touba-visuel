import { ArrowRight, Play } from "lucide-react";

const TIKTOK_VIDEOS = [
  { id: "t1", titre: "Nos créations visuelles", vues: "" },
  { id: "t2", titre: "Reportage & Couverture", vues: "" },
  { id: "t3", titre: "Impressions & Design", vues: "" },
  { id: "t4", titre: "Événements à Touba", vues: "" },
  { id: "t5", titre: "Textile personnalisé", vues: "" },
  { id: "t6", titre: "Spots publicitaires", vues: "" },
];

export default function TikTokSection() {
  return (
    <section className="py-16 bg-gray-950 overflow-hidden relative">
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            {/* Logo TikTok SVG */}
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-2xl tracking-tight">TikTok</p>
                <p className="text-gray-400 text-sm">@yoonu_murid_digital</p>
              </div>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
              Suivez-nous sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">TikTok</span>
            </h2>
            <p className="text-gray-400 text-base max-w-lg">
              Coulisses de nos créations, reportages, impressions, événements — toute l&apos;actualité d&apos;Agence Touba Visuel en vidéo courte.
            </p>
          </div>

          {/* CTA bouton */}
          <a
            href="https://www.tiktok.com/@yoonu_murid_digital"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-3 bg-white text-gray-950 font-bold text-base px-7 py-4 rounded-2xl hover:bg-gray-100 transition-colors shadow-xl group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
            </svg>
            Voir notre page TikTok
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grille de vidéos factices — effet portfolio TikTok */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {TIKTOK_VIDEOS.map((v, i) => (
            <a
              key={v.id}
              href="https://www.tiktok.com/@yoonu_murid_digital"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden bg-gray-800 aspect-[9/16] flex items-end hover:ring-2 hover:ring-pink-500 transition-all duration-300"
            >
              {/* Fond dégradé coloré par carte */}
              <div
                className="absolute inset-0"
                style={{
                  background: [
                    "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
                    "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
                    "linear-gradient(135deg, #1a1a1a 0%, #4a0072 100%)",
                    "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                    "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
                  ][i % 6],
                }}
              />
              {/* Icône ATV au centre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gray-950/60 border border-or-500/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-or-400 font-black text-sm"
                    style={{ textShadow: "0 0 8px #ffffff" }}>
                    ATV
                  </span>
                </div>
              </div>
              {/* Bouton play hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play size={18} className="text-gray-950 fill-gray-950 ml-1" />
                </div>
              </div>
              {/* Titre bas */}
              <div className="relative p-2 bg-gradient-to-t from-black/80 to-transparent w-full">
                <p className="text-white text-[10px] font-semibold leading-tight">{v.titre}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Bannière abonnement */}
        <div className="bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-pink-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg mb-1">
              🎬 Des nouvelles créations chaque semaine
            </p>
            <p className="text-gray-400 text-sm">
              Abonnez-vous pour ne rater aucune vidéo — impressions, reportages, événements et bien plus.
            </p>
          </div>
          <a
            href="https://www.tiktok.com/@yoonu_murid_digital"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
            </svg>
            S&apos;abonner sur TikTok
          </a>
        </div>
      </div>
    </section>
  );
}
