"use client";

import { useEffect, useRef, useState } from "react";
import type { ArticleInfo } from "@/lib/touba-infos";
import { editorialImageSrc, focalPosition } from "@/lib/touba-infos-image";

type ImageMode = "card" | "detail";

/** Photo éditoriale : les cartes recadrent modérément autour du point focal ;
 * l'article affiche toujours le fichier complet dans un fond neutre. */
export default function EditorialImage({
  article,
  className = "",
  emojiSize = "text-6xl",
  mode = "card",
  priority = false,
}: {
  article: Pick<ArticleInfo, "imageGradient" | "imageEmoji" | "imageUrl" | "imageFocalX" | "imageFocalY" | "titre">;
  className?: string;
  emojiSize?: string;
  mode?: ImageMode;
  priority?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBroken(true);
  }, [article.imageUrl]);

  const src = editorialImageSrc(article.imageUrl);
  const focal = focalPosition(article.imageFocalX, article.imageFocalY);
  if (src && !broken) {
    return (
      // Native img keeps Blob delivery untouched and accepts arbitrary existing image hosts.
      // eslint-disable-next-line @next/next/no-img-element
      <img ref={ref} src={src} alt={article.titre} loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined} decoding="async" onError={() => setBroken(true)}
        style={{ objectPosition: focal, aspectRatio: mode === "detail" ? "auto 16 / 10" : undefined }}
        className={mode === "detail" ? `max-h-[min(70vh,720px)] w-auto max-w-full object-contain ${className}` : `h-full w-full object-cover ${className}`} />
    );
  }
  return <div className={`flex ${mode === "detail" ? "min-h-52 w-full" : "h-full w-full"} items-center justify-center bg-gradient-to-br ${article.imageGradient} ${className}`}><span className={`select-none opacity-40 ${emojiSize}`}>{article.imageEmoji}</span></div>;
}
