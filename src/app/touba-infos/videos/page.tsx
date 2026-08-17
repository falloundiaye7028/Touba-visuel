import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, Radio } from "lucide-react";
import { VIDEOS_INFO } from "@/lib/touba-infos";
import { CardVideo } from "../_components/ui";

export const metadata: Metadata = {
  title: "Touba Infos TV — Vidéos, reportages et interviews",
  description:
    "Reportages, interviews, émissions et déclarations en vidéo sur Touba Infos TV : Magal, religion, économie, culture et sport.",
};

export default function VideosPage() {
  const [featured, ...rest] = VIDEOS_INFO;

  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PlayCircle size={30} className="text-green-500" />
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Touba Infos TV
              </h1>
              <p className="text-sm text-neutral-400">
                Reportages · Interviews · Émissions · Déclarations
              </p>
            </div>
          </div>
          <Link
            href="/touba-infos/direct"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            <Radio size={16} /> Regarder le direct
          </Link>
        </div>

        {/* Vidéo à la une */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${featured.imageGradient}`}>
              <span className="absolute text-8xl opacity-30">{featured.imageEmoji}</span>
              <PlayCircle size={72} className="relative text-white/90 drop-shadow" />
              <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-bold">
                {featured.duree}
              </span>
            </div>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-green-400">
              {featured.categorie}
            </span>
            <h2 className="mt-1 text-2xl font-black leading-tight">{featured.titre}</h2>
            <p className="mt-2 text-neutral-400">{featured.description}</p>
          </div>

          {/* Playlist */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              À suivre
            </p>
            {rest.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-center gap-3">
                <div className={`relative flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${v.imageGradient}`}>
                  <PlayCircle size={22} className="text-white/90" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase text-green-400">{v.categorie}</span>
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2">{v.titre}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grille complète */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-5 text-lg font-black uppercase tracking-tight">
            Toutes les vidéos
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS_INFO.map((v) => (
              <div key={v.id} className="[&_a]:border-white/10 [&_a]:bg-white/5 [&_h3]:text-white">
                <CardVideo video={v} />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-neutral-500">
            Contenus vidéo de démonstration — l&apos;intégration YouTube,
            Facebook et TikTok se branche ici.
          </p>
        </div>
      </div>
    </div>
  );
}
