"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight, ZoomIn } from "lucide-react";

const PHOTOS = [
  // ── Orange Money — Campagne Zénith Touba (Décembre 2025) ──
  ...Array.from({ length: 37 }, (_, i) => ({
    id: 100 + i,
    src: `/images/album/orange-zenith-${String(i + 1).padStart(2, "0")}.jpg`,
    titre: `Campagne Zénith Touba — Orange Money`,
    categorie: "Orange Money × ATV",
  })),
  // ── MASAE — Campagnes Institutionnelles ──
  {
    id: 1,
    src: "/images/album/shooting-1.jpg",
    titre: "Campagne Transport Sécurisé — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 2,
    src: "/images/album/shooting-2.jpg",
    titre: "Bonne Alimentation Animale — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 3,
    src: "/images/album/shooting-3.jpg",
    titre: "Prévenir c'est Protéger — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 4,
    src: "/images/album/shooting-4.jpg",
    titre: "Marchés Propres Tabaski — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 5,
    src: "/images/album/shooting-5.jpg",
    titre: "Campagne Nationale Élevage — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 6,
    src: "/images/album/shooting-6.jpg",
    titre: "Communication Terrain — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 7,
    src: "/images/album/shooting-7.jpg",
    titre: "MASAE Accompagne les Éleveurs",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 8,
    src: "/images/album/shooting-8.jpg",
    titre: "Santé Animale sur le Terrain",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 9,
    src: "/images/album/shooting-9.jpg",
    titre: "Mobilisation Nationale Tabaski — MASAE",
    categorie: "Campagne Institutionnelle",
  },
  {
    id: 10,
    src: "/images/album/shooting-10.jpg",
    titre: "MASAE Mobilisé sur le Terrain",
    categorie: "Campagne Institutionnelle",
  },
];

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: typeof PHOTOS;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <button onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10">
        <X size={22} className="text-white" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-4 py-1.5 rounded-full bg-white/10">
        {index + 1} / {photos.length}
      </div>

      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10">
        <ChevronLeft size={24} className="text-white" />
      </button>

      <div className="relative mx-16 md:mx-24 max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: "80vh" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.titre}
            className="w-full h-auto max-h-[80vh] object-contain bg-gray-950"
          />
        </div>
        <div className="mt-4 text-center px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#ffc800" }}>
            {photo.categorie}
          </p>
          <p className="text-white font-bold text-base md:text-lg leading-snug">{photo.titre}</p>
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10">
        <ChevronRight size={24} className="text-white" />
      </button>
    </div>
  );
}

export default function AlbumShooting() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filtre, setFiltre] = useState("Tous");

  const categories = ["Tous", ...Array.from(new Set(PHOTOS.map((p) => p.categorie)))];
  const filtered = filtre === "Tous" ? PHOTOS : PHOTOS.filter((p) => p.categorie === filtre);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() =>
    setLightboxIndex((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null),
    [filtered.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIndex((i) => i !== null ? (i + 1) % filtered.length : null),
    [filtered.length]);

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <section className="py-16 bg-gray-950 relative overflow-hidden">
        {/* Orbes déco */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: "rgba(255,180,0,0.06)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: "rgba(10,99,66,0.10)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">

          {/* En-tête */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera size={16} style={{ color: "#ffc800" }} />
                <p className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: "#ffc800" }}>
                  Portfolio Shooting
                </p>
              </div>
              <h2 className="text-white font-black text-3xl md:text-4xl mb-2">
                Notre Album Photo
              </h2>
              <p className="text-gray-400 text-base">
                Orange Money × Touba · MASAE · Campagnes institutionnelles &amp; reportages terrain
              </p>
            </div>
            <a
              href="https://wa.me/221778001717?text=Bonjour%20ATV%2C%20je%20voudrais%20commander%20un%20shooting%20photo."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)", color: "#111" }}>
              📱 Commander un shooting
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFiltre(cat); setLightboxIndex(null); }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={
                  filtre === cat
                    ? { background: "linear-gradient(135deg, #ffc800, #ff7a2a)", color: "#111" }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-800 cursor-zoom-in hover:ring-2 transition-all duration-300"
                style={{ ["--tw-ring-color" as string]: "#ffc800" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.titre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2">
                    <ZoomIn size={24} className="text-white" />
                  </div>
                </div>
                {/* Titre bas */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-[10px] font-semibold leading-tight">{photo.titre}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: "#ffc800" }}>{photo.categorie}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Stats + CTA bas */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex gap-6">
              {[
                { val: "47+", label: "Photos" },
                { val: "Orange Money", label: "Campagne Zénith Touba" },
                { val: "100%", label: "Qualité pro" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-black text-lg"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {s.val}
                  </p>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
            <a href="https://web.facebook.com/Shootingphotodor/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold border rounded-xl px-5 py-2.5 transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(255,200,0,0.3)", color: "rgba(255,255,255,0.7)" }}>
              📸 Voir tous nos reportages
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
