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
  lienUrl?: string;
};

/* ── Ajoutez / modifiez vos réalisations ici ── */
export const REALISATIONS: Realisation[] = [
  {
    id: "r1",
    titre: "Covering Véhicule — Van ATV Agence Touba Visuel",
    categorie: "Signalétique & Covering",
    type: "image",
    imageUrl: "/images/real-atv-van.jpg",
  },
  {
    id: "r2",
    titre: "Panneaux Publicitaires Grand Format — ATV",
    categorie: "Affichage & Communication",
    type: "image",
    imageUrl: "/images/real-atv-panneaux.jpg",
  },
  {
    id: "r3",
    titre: "Cartes de Visite Premium — Mamadou Falilou Ndiaye",
    categorie: "Impression & Design",
    type: "image",
    imageUrl: "/images/real-atv-cartes.jpg",
  },
  {
    id: "r4",
    titre: "Dossier de Présentation — ATV Image & Communication",
    categorie: "Corporate & Branding",
    type: "image",
    imageUrl: "/images/real-atv-dossier.jpg",
  },
  {
    id: "r5",
    titre: "Coffret Packaging & Identité Visuelle — ATV",
    categorie: "Packaging & Branding",
    type: "image",
    imageUrl: "/images/real-atv-packaging.jpg",
  },
  {
    id: "r6",
    titre: "Identité Visuelle & Objets Publicitaires — ATV",
    categorie: "Branding & Corporate",
    type: "image",
    imageUrl: "/images/real-atv-mockup.jpg",
  },
  {
    id: "r8",
    titre: "Logo FETT — Fondation Éducation Pour Tous à Touba",
    categorie: "Identité Visuelle",
    type: "image",
    imageUrl: "/images/real-fett-logo.jpg",
    lienUrl: "https://web.facebook.com/profile.php?id=61567266940837",
  },
  {
    id: "r9",
    titre: "Enseignes Lumineuses ATV — Enseigne Extérieure, Réception, Drapeau, Acrylique",
    categorie: "Signalétique & Enseignes",
    type: "image",
    imageUrl: "/images/real-atv-enseignes.jpg",
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
  const content = (
    <div className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100">
      <div className="relative w-full aspect-video">
        {real.imageUrl ? (
          <Image
            src={real.imageUrl}
            alt={real.titre}
            fill
            className="object-contain bg-white group-hover:scale-105 transition-transform duration-500"
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

  if (real.lienUrl) {
    return (
      <a href={real.lienUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
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
            href="https://www.youtube.com/@toubainfostv183"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-500 font-semibold text-sm border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors"
          >
            <Play size={14} className="fill-red-600" />
            Notre chaîne YouTube
          </a>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            href="https://www.youtube.com/@toubainfostv183"
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
