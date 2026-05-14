import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { formatPrix } from "@/lib/utils";
import type { SupportItem } from "@/lib/supports";

interface Props {
  support: SupportItem;
  categorieSlug?: string;
}

export default function SupportCard({ support, categorieSlug }: Props) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-vert-200 transition-all duration-300 flex flex-col">
      {/* Bannière visuelle */}
      <div className="bg-gradient-to-br from-vert-50 to-vert-100 h-32 flex items-center justify-center relative">
        <span className="text-6xl">{support.emoji}</span>
        {support.populaire && (
          <span className="absolute top-2 right-2 bg-or-500 text-vert-950 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={10} className="fill-vert-950" />
            Populaire
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-vert-700 transition-colors">
          {support.nom}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
          {support.description}
        </p>

        {/* Formats disponibles */}
        {support.formats && support.formats.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {support.formats.slice(0, 3).map((f) => (
              <span key={f} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
                {f}
              </span>
            ))}
            {support.formats.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
                +{support.formats.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Prix et CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-vert-700 font-bold text-base">
              {formatPrix(support.prixBase)}
            </p>
            <p className="text-gray-400 text-[10px]">{support.unite}</p>
          </div>
          <Link
            href={`/commande?support=${support.slug}${categorieSlug ? `&categorie=${categorieSlug}` : ""}`}
            className="flex items-center gap-1.5 bg-vert-700 hover:bg-vert-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <ShoppingBag size={13} />
            Commander
          </Link>
        </div>
      </div>
    </div>
  );
}
