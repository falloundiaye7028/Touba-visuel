import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Calendar, User, ArrowLeft } from "lucide-react";
import { ARTICLES, getArticleBySlug, getArticlesSimilaires, COULEURS_CATEGORIES } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };

  return {
    title: `${article.titre} | Blog ATV`,
    description: article.extrait,
    openGraph: {
      title: article.titre,
      description: article.extrait,
      type: "article",
      publishedTime: article.datePublication,
      authors: [article.auteur],
      siteName: "Agence Touba Visuel",
    },
    twitter: {
      card: "summary_large_image",
      title: article.titre,
      description: article.extrait,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const similaires = getArticlesSimilaires(article);

  const urlPartage = encodeURIComponent(
    `https://touba-visuel.vercel.app/blog/${article.slug}`
  );
  const textePartage = encodeURIComponent(
    `${article.titre} — par Agence Touba Visuel`
  );

  return (
    <>
      {/* Header article */}
      <section className="bg-gradient-to-br from-vert-900 via-vert-800 to-vert-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-vert-300 hover:text-or-400 text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au blog
          </Link>

          {/* Badge catégorie */}
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${COULEURS_CATEGORIES[article.categorie]}`}
            >
              {article.categorie}
            </span>
          </div>

          {/* Emoji */}
          <div className="text-7xl mb-6 select-none">{article.emoji}</div>

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.titre}
          </h1>

          {/* Extrait */}
          <p className="text-vert-200 text-lg leading-relaxed mb-8 max-w-2xl">
            {article.extrait}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-vert-300">
            <span className="flex items-center gap-2">
              <User size={15} />
              <span className="font-semibold text-white">{article.auteur}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} />
              {article.datePublication}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={15} />
              {article.tempsLecture} de lecture
            </span>
          </div>
        </div>
      </section>

      {/* Corps de l'article */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <article
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
              prose-ul:my-4 prose-li:text-gray-700 prose-li:mb-2
              prose-strong:text-gray-900
              prose-a:text-vert-700 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.contenu }}
          />

          {/* Boutons de partage */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
              Partager cet article
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${textePartage}%20${urlPartage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${urlPartage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Articles similaires */}
      {similaires.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Articles similaires
              </h2>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-vert-700 hover:text-vert-600 text-sm font-semibold transition-colors"
              >
                Voir tous les articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similaires.map((art) => (
                <BlogCard key={art.id} article={art} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA ATV */}
      <section className="py-16 bg-gradient-to-r from-vert-900 to-vert-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Besoin d&apos;aide pour votre communication ?
          </h2>
          <p className="text-vert-200 text-lg mb-8 max-w-xl mx-auto">
            Agence Touba Visuel accompagne les entreprises sénégalaises dans leur
            stratégie digitale, communication terrain, et identité visuelle.
            Basés à Touba, disponibles partout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 bg-or-500 hover:bg-or-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Passer une commande
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/221768001717"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Écrire sur WhatsApp
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
