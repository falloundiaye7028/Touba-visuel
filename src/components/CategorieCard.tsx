import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Categorie } from "@/lib/supports";

interface Props {
  categorie: Categorie;
}

export default function CategorieCard({ categorie }: Props) {
  return (
    <Link
      href={`/catalogue/${categorie.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-vert-300 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{categorie.emoji}</div>
        <ArrowRight
          size={20}
          className="text-gray-300 group-hover:text-vert-600 group-hover:translate-x-1 transition-all duration-200"
        />
      </div>
      <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-vert-700 transition-colors">
        {categorie.nom}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
        {categorie.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="bg-vert-50 text-vert-700 text-xs font-semibold px-3 py-1 rounded-full">
          {categorie.supports.length} supports
        </span>
        <span className="text-vert-600 text-xs font-medium group-hover:underline">
          Voir tout
        </span>
      </div>
    </Link>
  );
}
