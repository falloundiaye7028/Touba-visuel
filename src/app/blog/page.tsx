import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { ARTICLES, CATEGORIES, COULEURS_CATEGORIES } from "@/lib/blog";
import type { CategorieArticle } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Agence Touba Visuel — Conseils Marketing Digital & Communication",
  description:
    "Découvrez les conseils d'Agence Touba Visuel sur le marketing digital, les réseaux sociaux, l'identité visuelle et la communication au Sénégal. Articles rédigés par des experts basés à Touba.",
  openGraph: {
    title: "Blog ATV — Marketing Digital & Communication au Sénégal",
    description:
      "Conseils pratiques pour développer votre business grâce au digital et à la communication terrain. Par l'équipe d'Agence Touba Visuel.",
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categorieActive = resolvedParams.categorie as CategorieArticle | undefined;

  const articleVedette = ARTICLES.find((a) => a.populaire);
  const articlesFiltres = categorieActive
    ? ARTICLES.filter((a) => a.categorie === categorieActive)
    : ARTICLES;

  const autresArticles = articlesFiltres.filter(
    (a) => a.id !== articleVedette?.id
  );

  return (
    <>
      {/* Header du blog */}
      <section className="bg-gradient-to-br from-vert-900 via-vert-800 to-vert-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-vert-300 hover:text-or-400 text-sm mb-6 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
          <div className="inline-flex items-center gap-2 bg-or-500/20 text-or-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-or-500/30">
            📝 Blog ATV
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Marketing Digital &amp; Communication
          </h1>
          <p className="text-vert-200 text-lg max-w-2xl mx-auto">
            Conseils pratiques, études de cas et stratégies pour développer
            votre business au Sénégal. Par l&apos;équipe d&apos;Agence Touba Visuel.
          </p>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Link
              href="/blog"
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !categorieActive
                  ? "bg-vert-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tous
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog?categorie=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  categorieActive === cat
                    ? "bg-vert-700 text-white"
                    : `${COULEURS_CATEGORIES[cat]} hover:opacity-80`
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Article vedette (uniquement si pas de filtre actif) */}
        {!categorieActive && articleVedette && (
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-vert-600 mb-4">
              ⭐ Article vedette
            </p>
            <Link
              href={`/blog/${articleVedette.slug}`}
              className="group flex flex-col md:flex-row bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="md:w-80 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-vert-50 to-or-50 text-8xl py-12 px-8 select-none">
                {articleVedette.emoji}
              </div>
              <div className="flex flex-col justify-center p-8">
                <span
                  className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 ${COULEURS_CATEGORIES[articleVedette.categorie]}`}
                >
                  {articleVedette.categorie}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-vert-700 transition-colors">
                  {articleVedette.titre}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-2xl">
                  {articleVedette.extrait}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 flex items-center gap-4">
                    <span className="font-medium text-gray-600">{articleVedette.auteur}</span>
                    <span>{articleVedette.datePublication}</span>
                    <span>{articleVedette.tempsLecture} de lecture</span>
                  </div>
                  <span className="flex items-center gap-2 text-vert-700 font-semibold text-sm group-hover:gap-3 transition-all">
                    Lire l&apos;article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grille d'articles */}
        {autresArticles.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {categorieActive ? `Articles — ${categorieActive}` : "Tous les articles"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {autresArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">Aucun article dans cette catégorie pour le moment.</p>
            <Link href="/blog" className="mt-4 inline-block text-vert-700 font-semibold hover:underline">
              Voir tous les articles
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-vert-900 to-vert-800 text-white p-10 text-center">
          <div className="text-5xl mb-4">📞</div>
          <h2 className="text-2xl font-bold mb-3">
            Besoin d&apos;aide pour votre communication ?
          </h2>
          <p className="text-vert-200 mb-6 max-w-xl mx-auto">
            Nos experts à Touba sont disponibles pour vous accompagner dans votre stratégie
            digitale et communication terrain.
          </p>
          <Link
            href="/commande"
            className="inline-flex items-center gap-2 bg-or-500 hover:bg-or-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Contactez-nous
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
