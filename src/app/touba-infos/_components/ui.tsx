import Link from "next/link";
import { Clock, PlayCircle, ArrowRight, Zap } from "lucide-react";
import {
  type ArticleInfo,
  type VideoInfo,
  COULEURS_CATEGORIES,
  slugCategorie,
  formatDateFr,
} from "@/lib/touba-infos";

/* ── Chip catégorie ── */
export function CategorieChip({
  categorie,
  className = "",
}: {
  categorie: ArticleInfo["categorie"];
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${COULEURS_CATEGORIES[categorie]} ${className}`}
    >
      {categorie}
    </span>
  );
}

/* ── Image / tuile éditoriale ── */
export function EditorialImage({
  article,
  className = "",
  emojiSize = "text-6xl",
}: {
  article: Pick<ArticleInfo, "imageGradient" | "imageEmoji" | "imageUrl" | "titre">;
  className?: string;
  emojiSize?: string;
}) {
  if (article.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.imageUrl}
        alt={article.titre}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${article.imageGradient} ${className}`}
    >
      <span className={`select-none opacity-40 ${emojiSize}`}>
        {article.imageEmoji}
      </span>
    </div>
  );
}

/* ── En-tête de section ── */
export function SectionHeading({
  titre,
  href,
  hrefLabel = "Tout voir",
  accent = "green",
}: {
  titre: string;
  href?: string;
  hrefLabel?: string;
  accent?: "green" | "red" | "neutral";
}) {
  const bar =
    accent === "red"
      ? "bg-red-600"
      : accent === "neutral"
        ? "bg-neutral-800"
        : "bg-green-600";
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
      <h2 className="flex items-center gap-2.5 text-lg font-black uppercase tracking-tight text-neutral-900 sm:text-xl">
        <span className={`h-5 w-1.5 rounded-full ${bar}`} />
        {titre}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex flex-shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wide text-green-700 hover:text-green-800"
        >
          {hrefLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ── Métadonnées article ── */
function Meta({ article, className = "" }: { article: ArticleInfo; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-xs text-neutral-500 ${className}`}>
      <span className="truncate font-medium text-neutral-600">{article.auteur}</span>
      <span className="flex flex-shrink-0 items-center gap-1">
        <Clock size={12} />
        {article.tempsLecture}
      </span>
    </div>
  );
}

function BreakingBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
      <Zap size={10} className="fill-current" /> Urgent
    </span>
  );
}

/* ── Carte standard (grille) ── */
export function CardStandard({ article }: { article: ArticleInfo }) {
  return (
    <Link
      href={`/touba-infos/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <EditorialImage article={article} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <CategorieChip categorie={article.categorie} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {article.breaking && (
          <div className="mb-2">
            <BreakingBadge />
          </div>
        )}
        <h3 className="font-bold leading-snug text-neutral-900 line-clamp-3 group-hover:text-green-700">
          {article.titre}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-2">
          {article.extrait}
        </p>
        <Meta article={article} className="mt-3 border-t border-neutral-100 pt-3" />
      </div>
    </Link>
  );
}

/* ── Carte horizontale (listes / sidebars) ── */
export function CardHorizontal({
  article,
  index,
}: {
  article: ArticleInfo;
  index?: number;
}) {
  return (
    <Link
      href={`/touba-infos/${article.slug}`}
      className="group flex items-start gap-3 py-3"
    >
      {typeof index === "number" && (
        <span className="mt-0.5 text-2xl font-black leading-none text-neutral-200 group-hover:text-green-600">
          {index}
        </span>
      )}
      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <EditorialImage article={article} emojiSize="text-2xl" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
          {article.categorie}
        </span>
        <h4 className="text-sm font-semibold leading-snug text-neutral-900 line-clamp-2 group-hover:text-green-700">
          {article.titre}
        </h4>
      </div>
    </Link>
  );
}

/* ── Carte compacte (fil / plus lus sans image) ── */
export function CardCompact({
  article,
  index,
}: {
  article: ArticleInfo;
  index?: number;
}) {
  return (
    <Link
      href={`/touba-infos/${article.slug}`}
      className="group flex items-start gap-3 border-b border-neutral-100 py-3 last:border-0"
    >
      {typeof index === "number" && (
        <span className="text-lg font-black leading-none text-green-600">
          {index}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-snug text-neutral-900 line-clamp-2 group-hover:text-green-700">
          {article.titre}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
          <span className="font-semibold uppercase tracking-wide text-green-700">
            {article.categorie}
          </span>
          <span>•</span>
          <span>{formatDateFr(article.date)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Carte vidéo ── */
export function CardVideo({ video }: { video: VideoInfo }) {
  return (
    <Link
      href="/touba-infos/videos"
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className={`relative aspect-video bg-gradient-to-br ${video.imageGradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none text-5xl opacity-30">{video.imageEmoji}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle
            size={52}
            className="text-white/90 drop-shadow transition-transform group-hover:scale-110"
          />
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-white">
          {video.duree}
        </span>
      </div>
      <div className="p-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
          {video.categorie}
        </span>
        <h3 className="mt-1 text-sm font-bold leading-snug text-neutral-900 line-clamp-2 group-hover:text-green-700">
          {video.titre}
        </h3>
      </div>
    </Link>
  );
}

/* ── Emplacement publicitaire ── */
export function AdSlot({
  format = "banner",
  label = "Publicité",
}: {
  format?: "banner" | "rectangle" | "leaderboard";
  label?: string;
}) {
  const h =
    format === "rectangle"
      ? "h-64"
      : format === "leaderboard"
        ? "h-24 md:h-28"
        : "h-20 md:h-24";
  return (
    <div
      className={`flex ${h} w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{label}</span>
      <span className="mt-1 text-xs">Espace disponible —
        <Link href="/touba-infos/publicite" className="ml-1 font-semibold text-green-700 hover:underline">
          communiquez sur Touba Infos
        </Link>
      </span>
    </div>
  );
}
