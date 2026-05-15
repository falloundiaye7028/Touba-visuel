"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Camera, ArrowRight,
  Pause, Play, Maximize2, X
} from "lucide-react";

const PHOTOS = [
  ...Array.from({ length: 37 }, (_, i) => ({
    id: 100 + i,
    src: `/images/album/orange-zenith-${String(i + 1).padStart(2, "0")}.jpg`,
    titre: "Campagne Zénith Touba — Orange Money",
    categorie: "Orange Money × ATV",
  })),
  { id: 1,  src: "/images/album/shooting-1.jpg",  titre: "Transport Sécurisé — MASAE",          categorie: "Campagne Institutionnelle" },
  { id: 2,  src: "/images/album/shooting-2.jpg",  titre: "Bonne Alimentation Animale — MASAE",  categorie: "Campagne Institutionnelle" },
  { id: 3,  src: "/images/album/shooting-3.jpg",  titre: "Prévenir c'est Protéger — MASAE",     categorie: "Campagne Institutionnelle" },
  { id: 4,  src: "/images/album/shooting-4.jpg",  titre: "Marchés Propres Tabaski — MASAE",     categorie: "Campagne Institutionnelle" },
  { id: 5,  src: "/images/album/shooting-5.jpg",  titre: "Campagne Nationale Élevage — MASAE",  categorie: "Campagne Institutionnelle" },
  { id: 6,  src: "/images/album/shooting-6.jpg",  titre: "Communication Terrain — MASAE",       categorie: "Campagne Institutionnelle" },
  { id: 7,  src: "/images/album/shooting-7.jpg",  titre: "MASAE Accompagne les Éleveurs",       categorie: "Campagne Institutionnelle" },
  { id: 8,  src: "/images/album/shooting-8.jpg",  titre: "Santé Animale sur le Terrain",        categorie: "Campagne Institutionnelle" },
  { id: 9,  src: "/images/album/shooting-9.jpg",  titre: "Mobilisation Nationale Tabaski",      categorie: "Campagne Institutionnelle" },
  { id: 10, src: "/images/album/shooting-10.jpg", titre: "MASAE Mobilisé sur le Terrain",       categorie: "Campagne Institutionnelle" },
];

const CATEGORIES = ["Tous", "Orange Money × ATV", "Campagne Institutionnelle"];
const INTERVAL = 4000;

export default function AlbumShooting() {
  const [filtre, setFiltre]       = useState("Tous");
  const [index, setIndex]         = useState(0);
  const [playing, setPlaying]     = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress]   = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thumbsRef   = useRef<HTMLDivElement>(null);

  const filtered = filtre === "Tous" ? PHOTOS : PHOTOS.filter((p) => p.categorie === filtre);

  const goTo = useCallback((i: number) => {
    setIndex(((i % filtered.length) + filtered.length) % filtered.length);
    setProgress(0);
  }, [filtered.length]);

  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    if (!playing) return;

    setProgress(0);
    const step = 100 / (INTERVAL / 50);
    progressRef.current = setInterval(() => setProgress((p) => Math.min(p + step, 100)), 50);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % filtered.length);
      setProgress(0);
    }, INTERVAL);

    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(progressRef.current!);
    };
  }, [playing, filtered.length, index]);

  // Reset index when filter changes
  useEffect(() => { setIndex(0); setProgress(0); }, [filtre]);

  // Keyboard
  useEffect(() => {
    if (!fullscreen) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setFullscreen(false);
      if (e.key === " ")          setPlaying((p) => !p);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [fullscreen, prev, next]);

  // Scroll thumbnail into view
  useEffect(() => {
    const el = thumbsRef.current?.querySelector(`[data-idx="${index}"]`) as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const photo = filtered[index];
  if (!photo) return null;

  const SlideShow = ({ isFullscreen }: { isFullscreen: boolean }) => (
    <div className={`relative ${isFullscreen ? "w-full h-full" : "w-full"} flex flex-col`}>

      {/* Image principale */}
      <div className={`relative overflow-hidden bg-black ${isFullscreen ? "flex-1" : "aspect-[16/9] rounded-2xl"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.titre}
          className="w-full h-full object-contain animate-fade-in"
          style={{ maxHeight: isFullscreen ? "calc(100vh - 180px)" : undefined }}
        />

        {/* Gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Barre de progression */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full transition-none"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ffc800, #ff7a2a)" }}
          />
        </div>

        {/* Info photo */}
        <div className="absolute bottom-4 left-5 right-16">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 inline-block"
            style={{ background: "rgba(255,180,0,0.3)", color: "#ffc800", border: "1px solid rgba(255,180,0,0.4)" }}>
            {photo.categorie}
          </span>
          <p className="text-white font-bold text-sm md:text-base leading-tight">{photo.titre}</p>
          <p className="text-white/40 text-xs mt-0.5">{index + 1} / {filtered.length}</p>
        </div>

        {/* Flèches */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Boutons Play / Fullscreen */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={() => setPlaying((p) => !p)}
            className="w-8 h-8 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
            {playing
              ? <Pause size={14} className="text-white" />
              : <Play  size={14} className="text-white fill-white" />}
          </button>
          {!isFullscreen && (
            <button onClick={() => { setFullscreen(true); setPlaying(false); }}
              className="w-8 h-8 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
              <Maximize2 size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Vignettes */}
      <div ref={isFullscreen ? undefined : thumbsRef}
        className="flex gap-2 overflow-x-auto py-3 px-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}>
        {filtered.map((p, i) => (
          <button
            key={p.id}
            data-idx={i}
            onClick={() => { goTo(i); setPlaying(false); }}
            className="flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200"
            style={{
              width: 64, height: 42,
              outline: i === index ? "2px solid #ffc800" : "2px solid transparent",
              opacity: i === index ? 1 : 0.5,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-white font-bold text-sm">📸 Album — {filtered.length} photos</p>
            <div className="flex gap-3">
              <button onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors">
                {playing ? <><Pause size={13} /> Pause</> : <><Play size={13} className="fill-current" /> Lecture</>}
              </button>
              <button onClick={() => { setFullscreen(false); setPlaying(true); }}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-2 overflow-hidden">
            <div className="w-full max-w-5xl">
              <SlideShow isFullscreen />
              <div ref={thumbsRef}
                className="flex gap-2 overflow-x-auto py-2 mt-2"
                style={{ scrollbarWidth: "none" }}>
                {filtered.map((p, i) => (
                  <button key={p.id} data-idx={i}
                    onClick={() => { goTo(i); setPlaying(false); }}
                    className="flex-shrink-0 rounded-md overflow-hidden transition-all"
                    style={{ width: 56, height: 38, outline: i === index ? "2px solid #ffc800" : "2px solid transparent", opacity: i === index ? 1 : 0.45 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: "rgba(255,120,0,0.07)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: "rgba(10,99,66,0.10)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">

          {/* En-tête */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera size={15} style={{ color: "#ffc800" }} />
                <p className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: "#ffc800" }}>
                  Portfolio Shooting
                </p>
              </div>
              <h2 className="text-white font-black text-3xl md:text-4xl mb-1">Notre Album Photo</h2>
              <p className="text-gray-400 text-sm">
                Orange Money × Touba · MASAE · Campagnes &amp; reportages — {PHOTOS.length} photos
              </p>
            </div>
            <a href="https://wa.me/221778001717?text=Bonjour%20ATV%2C%20je%20voudrais%20commander%20un%20shooting%20photo."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 whitespace-nowrap flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)", color: "#111" }}>
              📱 Commander un shooting
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFiltre(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={filtre === cat
                  ? { background: "linear-gradient(135deg, #ffc800, #ff7a2a)", color: "#111" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {cat} {cat !== "Tous" && `(${PHOTOS.filter(p => p.categorie === cat).length})`}
              </button>
            ))}
          </div>

          {/* Diaporama */}
          <SlideShow isFullscreen={false} />

          {/* Lien Facebook bas */}
          <div className="mt-6 flex justify-center">
            <a href="https://web.facebook.com/Shootingphotodor/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold border rounded-xl px-5 py-2.5 transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(255,200,0,0.3)", color: "rgba(255,255,255,0.6)" }}>
              📸 Voir tous nos reportages Facebook
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
