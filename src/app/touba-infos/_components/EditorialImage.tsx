"use client";

import { useEffect, useRef, useState } from "react";
import type { ArticleInfo } from "@/lib/touba-infos";
import { editorialImageSrc } from "@/lib/touba-infos-image";

/**
 * Visuel d'article : photographie réelle (`imageUrl`) si disponible, sinon
 * tuile éditoriale (dégradé + emoji). En cas d'échec de chargement de la
 * photo, repli automatique et gracieux sur la tuile — le média ne montre
 * jamais d'image cassée.
 */
export default function EditorialImage({
  article,
  className = "",
  emojiSize = "text-6xl",
}: {
  article: Pick<
    ArticleInfo,
    "imageGradient" | "imageEmoji" | "imageUrl" | "titre"
  >;
  className?: string;
  emojiSize?: string;
}) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBroken(true);
  }, []);

  const src = editorialImageSrc(article.imageUrl);

  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={src}
        alt={article.titre}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
        className={`h-full w-full object-cover ${className}`}
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
