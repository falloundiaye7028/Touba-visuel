import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, Share2, ChevronRight } from "lucide-react";
import {
  ARTICLES_INFO,
  getArticleInfoBySlug,
  getArticlesInfoSimilaires,
  COULEURS_CATEGORIES,
} from "@/lib/touba-infos";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ARTICLES_INFO.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleInfoBySlug(slug);
  if (!article) return { title: "Article introuvable — Touba Infos" };

  return {
    title: `${article.titre} | Touba Infos`,
    description: article.extrait,
    openGraph: {
      title: article.titre,
      description: article.extrait,
      type: "article",
      publishedTime: article.datePublication,
      authors: [article.auteur],
      siteName: "Touba Infos",
    },
    twitter: {
      card: "summary_large_image",
      title: article.titre,
      description: article.extrait,
    },
  };
}

export default async function ArticleInfoPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleInfoBySlug(slug);
  if (!article) notFound();

  const similaires = getArticlesInfoSimilaires(article);

  const urlPartage = encodeURIComponent(
    `https://touba-visuel.vercel.app/touba-infos/${article.slug}`
  );
  const textePartage = encodeURIComponent(`${article.titre} — Touba Infos`);

  return (
    <div className="bg-[#0a0f0d] min-h-screen text-white">
      {/* ── HERO ARTICLE ── */}
      <div className={`relative bg-gradient-to-br ${article.imageGradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#0a0f0d]" />

        {/* Emoji décoratif */}
        <div className="absolute right-0 top-0 text-[20rem] opacity-10 select-none leading-none translate-x-1/4 -translate-y-1/4">
          {article.imageEmoji}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-xs mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <Link href="/touba-infos" className="hover:text-amber-400 transition-colors">Touba Infos</Link>
            <ChevronRight size={12} />
            <span className="text-white/30 truncate max-w-xs">{article.categorie}</span>
          </div>

          <Link
            href="/touba-infos"
            className="inline-flex items-center gap-2 text-white/60 hover:text-amber-400 text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour à Touba Infos
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${COULEURS_CATEGORIES[article.categorie]}`}>
              {article.categorie}
            </span>
            {article.breaking && (
              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase">
                🔴 Breaking News
              </span>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white">
            {article.titre}
          </h1>

          {/* Sous-titre */}
          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-3xl">
            {article.sousTitre}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 pb-6">
            <span className="flex items-center gap-2">
              <User size={15} />
              <span className="font-semibold text-white/80">{article.auteur}</span>
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
      </div>

      {/* ── CORPS DE L'ARTICLE ── */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Lead / extrait mis en avant */}
        <div className="border-l-4 border-amber-400 pl-6 mb-10">
          <p className="text-white/80 text-xl leading-relaxed font-light italic">
            {article.extrait}
          </p>
        </div>

        {/* Contenu HTML */}
        <article
          className="
            prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-l-4 prose-h2:border-amber-400 prose-h2:pl-4
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:my-4 prose-li:text-white/70 prose-li:mb-2
            prose-strong:text-white prose-strong:font-bold
            prose-em:text-amber-300/90
            prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />

        {/* ── PARTAGE ── */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <Share2 size={16} className="text-white/40" />
            <p className="text-xs font-black text-white/40 uppercase tracking-widest">
              Partager cet article
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/?text=${textePartage}%20${urlPartage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
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
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${textePartage}&url=${urlPartage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black border border-white/20 hover:border-white/50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X / Twitter
            </a>
          </div>
        </div>

        {/* ── AUTEUR ── */}
        <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-700 to-amber-700 flex items-center justify-center text-2xl flex-shrink-0 select-none">
            ✍️
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Auteur</p>
            <p className="text-white font-black text-lg">{article.auteur}</p>
            <p className="text-white/50 text-sm mt-1">
              Journaliste & rédacteur à Touba Infos — {article.categorie}
            </p>
          </div>
        </div>
      </div>

      {/* ── ARTICLES SIMILAIRES ── */}
      {similaires.length > 0 && (
        <section className="border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 bg-amber-400 rounded-full" />
                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                  Articles similaires
                </h2>
              </div>
              <Link
                href="/touba-infos"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors"
              >
                Tout voir <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similaires.map((art) => (
                <Link
                  key={art.id}
                  href={`/touba-infos/${art.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 bg-white/5 hover:bg-white/10"
                >
                  <div className={`relative h-36 bg-gradient-to-br ${art.imageGradient} flex items-center justify-center`}>
                    <span className="text-6xl opacity-30 select-none">{art.imageEmoji}</span>
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${COULEURS_CATEGORIES[art.categorie]}`}>
                        {art.categorie}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-black text-white leading-snug mb-2 line-clamp-2 group-hover:text-amber-200 transition-colors">
                      {art.titre}
                    </h3>
                    <div className="flex items-center gap-3 text-white/30 text-xs">
                      <span>{art.auteur}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{art.tempsLecture}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ATV ── */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 text-xs font-black px-4 py-2 rounded-full mb-6 border border-amber-400/20 uppercase tracking-widest">
            🎨 Agence Touba Visuel
          </div>
          <h2 className="text-3xl font-black text-white mb-4">
            Besoin d&apos;une présence digitale professionnelle ?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Impression, identité visuelle, sites web, communication terrain —
            l&apos;équipe d&apos;ATV vous accompagne à Touba et partout au Sénégal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black px-7 py-3.5 rounded-xl transition-colors"
            >
              Commander maintenant
              <ChevronRight size={18} />
            </Link>
            <a
              href="https://wa.me/221768001717"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              WhatsApp 76 800 17 17
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
