"use client";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

/* ── Lightbox ── */
function Lightbox({
  realisations,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  realisations: Realisation[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const real = realisations[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Fermer"
      >
        <X size={22} className="text-white" />
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
        {index + 1} / {realisations.length}
      </div>

      {/* Flèche gauche */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Précédent"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      {/* Image principale */}
      <div
        className="relative mx-16 md:mx-24 max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: "80vh" }}>
          {real.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={real.imageUrl}
              alt={real.titre}
              className="w-full h-auto max-h-[80vh] object-contain bg-gray-950"
            />
          )}
        </div>

        {/* Infos sous l'image */}
        <div className="mt-4 text-center px-4">
          <p className="text-vert-400 text-xs font-bold uppercase tracking-widest mb-1">
            {real.categorie}
          </p>
          <p className="text-white font-bold text-base md:text-lg leading-snug">
            {real.titre}
          </p>
          {real.lienUrl && (
            <a
              href={real.lienUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 bg-vert-700 hover:bg-vert-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              Voir le projet
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Flèche droite */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Suivant"
      >
        <ChevronRight size={24} className="text-white" />
      </button>
    </div>
  );
}

/* ── Video Card ── */
function VideoCard({ real }: { real: Realisation }) {
  const thumbnail = `https://img.youtube.com/vi/${real.youtubeId}/hqdefault.jpg`;

  return (
    <a
      href={real.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-900"
    >
      <div className="relative w-full aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={real.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 group-hover:bg-red-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 group-hover:scale-110">
            <Play size={22} className="text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          YouTube
        </div>
      </div>
      <div className="p-3 bg-white">
        <p className="text-[10px] text-or-600 font-semibold uppercase tracking-wider mb-0.5">
          {real.categorie}
        </p>
        <p className="text-gray-800 font-semibold text-sm leading-snug">{real.titre}</p>
      </div>
    </a>
  );
}

/* ── Image Card ── */
function ImageCard({
  real,
  onClick,
}: {
  real: Realisation;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100 w-full text-left cursor-zoom-in"
    >
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
        {/* Overlay zoom au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            Agrandir
          </div>
        </div>
      </div>
      <div className="p-3 bg-white">
        <p className="text-[10px] text-vert-600 font-semibold uppercase tracking-wider mb-0.5">
          {real.categorie}
        </p>
        <p className="text-gray-800 font-semibold text-sm leading-snug">{real.titre}</p>
      </div>
    </button>
  );
}

/* ── Section principale ── */
export default function Realisations() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Seulement les réalisations image pour la navigation lightbox
  const imageReals = REALISATIONS.filter((r) => r.type === "image");

  const openLightbox = useCallback((globalIndex: number) => {
    // Convertir l'index global en index dans imageReals
    const imageIndex = imageReals.findIndex(
      (r) => r.id === REALISATIONS[globalIndex].id
    );
    if (imageIndex !== -1) setLightboxIndex(imageIndex);
  }, [imageReals]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + imageReals.length) % imageReals.length : null
    );
  }, [imageReals.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % imageReals.length : null
    );
  }, [imageReals.length]);

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          realisations={imageReals}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

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
            {REALISATIONS.map((real, index) =>
              real.type === "video" ? (
                <VideoCard key={real.id} real={real} />
              ) : (
                <ImageCard
                  key={real.id}
                  real={real}
                  onClick={() => openLightbox(index)}
                />
              )
            )}
          </div>

          {/* Boutons bas */}
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
    </>
  );
}
