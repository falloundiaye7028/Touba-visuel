import Link from "next/link";
import type { Article } from "@/lib/blog";
import { COULEURS_CATEGORIES } from "@/lib/blog";

interface BlogCardProps {
  article: Article;
}

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Emoji header */}
      <div className="flex items-center justify-center h-32 bg-gradient-to-br from-gray-50 to-gray-100 text-6xl select-none">
        {article.emoji}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Badge catégorie */}
        <span
          className={`inline-block self-start px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${COULEURS_CATEGORIES[article.categorie]}`}
        >
          {article.categorie}
        </span>

        {/* Titre */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-vert-700 transition-colors line-clamp-2">
          {article.titre}
        </h3>

        {/* Extrait */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          {article.extrait}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
          <span className="font-medium text-gray-600">{article.auteur}</span>
          <div className="flex items-center gap-3">
            <span>{article.datePublication}</span>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {article.tempsLecture}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
