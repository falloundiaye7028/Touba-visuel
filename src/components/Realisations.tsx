import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

type Realisation = {
  id: string;
  titre: string;
  categorie: string;
  type: "image" | "video";
  imageUrl?: string;
  youtubeUrl?: string;
  youtubeId?: string;
};

/* ── Ajoutez / modifiez vos réalisations ici ── */
export const REALISATIONS: Realisation[] = [
  {
    id: "r1",
    titre: "Réalisation ATV",
    categorie: "Vidéo",
    type: "video",
    youtubeId: "6jAZzTTjTIQ",
    youtubeUrl: "https://youtu.be/6jAZzTTjTIQ",
  },
  {
    id: "r2",
    titre: "Réalisation ATV",
    categorie: "Vidéo",
    type: "video",
    youtubeId: "QZmLPrdw-VU",
    youtubeUrl: "https://youtu.be/QZmLPrdw-VU",
  },
  {
    id: "r3",
    titre: "Réalisation ATV",
    categorie: "Vidéo",
    type: "video",
    youtubeId: "1Mb3X9dRcWw",
    youtubeUrl: "https://youtu.be/1Mb3X9dRcWw",
  },
  {
    id: "r4",
    titre: "Réalisation ATV",
    categorie: "Vidéo",
    type: "video",
    youtubeId: "Cjb4J3JHCrM",
    youtubeUrl: "https://youtu.be/Cjb4J3JHCrM",
  },
];

function VideoCard({ real }: { real: Realisation }) {
  const thumbnail = `https://img.youtube.com/vi/${real.youtubeId}/hqdefault.jpg`;

  return (
    <a
      href={real.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-900"
    >
      {/* Thumbnail YouTube */}
      <div className="relative w-full aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={real.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        {/* Bouton play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 group-hover:bg-red-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 group-hover:scale-110">
            <Play size={22} className="text-white fill-white ml-1" />
          </div>
        </div>
        {/* Badge YouTube */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          YouTube
        </div>
      </div>
      {/* Infos */}
      <div className="p-3 bg-white">
        <p className="text-[10px] text-or-600 font-semibold uppercase tracking-wider mb-0.5">
          {real.categorie}
        </p>
        <p className="text-gray-800 font-semibold text-sm leading-snug">{real.titre}</p>
      </div>
    </a>
  );
}

function ImageCard({ real }: { real: Realisation }) {
  return (
    <div className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100">
      <div className="relative w-full aspect-video">
        {real.imageUrl ? (
          <Image
            src={real.imageUrl}
            alt={real.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vert-900 to-vert-700">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="p-3 bg-white">
        <p className="text-[10px] text-vert-600 font-semibold uppercase tracking-wider mb-0.5">
          {real.categorie}
        </p>
        <p className="text-gray-800 font-semibold text-sm leading-snug">{real.titre}</p>
      </div>
    </div>
  );
}

export default function Realisations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-or-600 font-semibold uppercase tracking-widest mb-2">
              Portfolio
            </p>
            <h2 className="section-title mb-2">Nos Réalisations</h2>
            <p className="section-subtitle">Visuels, sites web, vidéos et couvertures médiatiques</p>
          </div>
          <a
            href="https://www.youtube.com/@toubavisuel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-500 font-semibold text-sm border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors"
          >
            <Play size={14} className="fill-red-600" />
            Notre chaîne YouTube
          </a>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REALISATIONS.map((real) =>
            real.type === "video" ? (
              <VideoCard key={real.id} real={real} />
            ) : (
              <ImageCard key={real.id} real={real} />
            )
          )}
        </div>

        {/* Bouton voir plus — mobile + lien YouTube */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.youtube.com/@toubavisuel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            <Play size={16} className="fill-white" />
            Voir toutes nos vidéos sur YouTube
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 text-vert-700 hover:text-vert-600 font-semibold text-sm"
          >
            Commander une réalisation
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
