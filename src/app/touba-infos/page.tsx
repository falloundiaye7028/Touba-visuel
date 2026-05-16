import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Clock, Globe, ChevronRight } from "lucide-react";
import {
  ARTICLES_INFO,
  CATEGORIES_INFO,
  COULEURS_CATEGORIES,
  getArticlesInfoByCategorie,
} from "@/lib/touba-infos";
import type { CategorieInfo } from "@/lib/touba-infos";

export const metadata: Metadata = {
  title: "Touba Infos — Le meilleur de l'actualité nationale, internationale et du Mouridisme",
  description:
    "Touba Infos : votre source premium d'actualité sur Touba, le Mouridisme, le Sénégal, l'Afrique et l'International. Information rigoureuse, design world-class.",
  openGraph: {
    title: "Touba Infos — Actualité nationale, internationale & Mouridisme",
    description:
      "Le meilleur des blogs d'information : Mouridisme, Touba, Sénégal, Afrique, International, Économie, Sport et Culture.",
    type: "website",
  },
};

const BREAKING_ARTICLES = ARTICLES_INFO.filter((a) => a.breaking);
const UNE_ARTICLE = ARTICLES_INFO.find((a) => a.alaUne)!;
const AUTRES = ARTICLES_INFO.filter((a) => !a.alaUne).slice(0, 8);

export default async function ToubaInfosPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const resolved = await searchParams;
  const categorieActive = resolved.categorie as CategorieInfo | undefined;

  const articlesFiltres = categorieActive
    ? getArticlesInfoByCategorie(categorieActive)
    : null;

  return (
    <div className="bg-[#0a0f0d] min-h-screen text-white">
      {/* ── BREAKING NEWS TICKER ── */}
      {BREAKING_ARTICLES.length > 0 && (
        <div className="bg-red-600 text-white text-sm font-bold overflow-hidden">
          <div className="flex items-center">
            <span className="flex-shrink-0 bg-red-800 px-4 py-2 flex items-center gap-2 uppercase tracking-widest text-xs">
              <Flame size={14} className="animate-pulse" />
              Breaking
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex animate-marquee whitespace-nowrap py-2 px-4 gap-16">
                {[...BREAKING_ARTICLES, ...BREAKING_ARTICLES].map((a, i) => (
                  <Link
                    key={`${a.id}-${i}`}
                    href={`/touba-infos/${a.slug}`}
                    className="hover:text-red-200 transition-colors flex-shrink-0"
                  >
                    ● {a.titre}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MASTHEAD ── */}
      <header className="bg-gradient-to-b from-[#07402b] via-[#0a0f0d] to-[#0a0f0d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-amber-400 text-xs mb-6 transition-colors tracking-widest uppercase">
            ← Agence Touba Visuel
          </Link>

          {/* Logo / Titre */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-5xl select-none">🕌</span>
              <div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-white to-emerald-300 bg-clip-text text-transparent leading-none">
                  TOUBA INFOS
                </h1>
                <p className="text-emerald-400 text-sm font-light tracking-[0.4em] uppercase mt-1">
                  Le meilleur des blogs du monde
                </p>
              </div>
            </div>
          </div>

          {/* Date + stats */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/40 tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <Globe size={12} />
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span>•</span>
            <span>{ARTICLES_INFO.length} articles</span>
            <span>•</span>
            <span>8 rubriques</span>
          </div>
        </div>
      </header>

      {/* ── NAV CATÉGORIES ── */}
      <nav className="sticky top-0 z-50 bg-[#0d1411]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            <Link
              href="/touba-infos"
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                !categorieActive
                  ? "bg-amber-400 text-black"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Tout
            </Link>
            {CATEGORIES_INFO.map((cat) => (
              <Link
                key={cat}
                href={`/touba-infos?categorie=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  categorieActive === cat
                    ? "bg-amber-400 text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* ── VUE FILTRÉE ── */}
        {categorieActive && articlesFiltres ? (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-8 bg-amber-400 rounded-full" />
              <h2 className="text-2xl font-black text-white">{categorieActive}</h2>
              <span className="text-white/30 text-sm">— {articlesFiltres.length} article{articlesFiltres.length > 1 ? "s" : ""}</span>
            </div>
            {articlesFiltres.length === 0 ? (
              <div className="text-center py-24 text-white/30">
                <div className="text-6xl mb-4">🔍</div>
                <p>Aucun article dans cette rubrique pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesFiltres.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── À LA UNE ── */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-6 bg-amber-400 rounded-full" />
                <span className="text-amber-400 text-xs font-black uppercase tracking-widest">À la Une</span>
              </div>

              <Link
                href={`/touba-infos/${UNE_ARTICLE.slug}`}
                className="group block relative rounded-3xl overflow-hidden"
              >
                {/* Fond gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${UNE_ARTICLE.imageGradient} opacity-90`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Emoji décoratif */}
                <div className="absolute top-8 right-8 text-9xl opacity-20 select-none group-hover:opacity-30 transition-opacity">
                  {UNE_ARTICLE.imageEmoji}
                </div>

                <div className="relative p-8 md:p-12 min-h-[420px] flex flex-col justify-end">
                  {/* Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-xs font-black uppercase px-3 py-1.5 rounded-full">
                      ⭐ À la Une
                    </span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {UNE_ARTICLE.categorie}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 group-hover:text-amber-200 transition-colors max-w-4xl">
                    {UNE_ARTICLE.titre}
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-3xl">
                    {UNE_ARTICLE.sousTitre}
                  </p>
                  <div className="flex items-center gap-5 text-white/50 text-sm">
                    <span className="font-semibold text-white/70">{UNE_ARTICLE.auteur}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} />{UNE_ARTICLE.tempsLecture}</span>
                    <span>{UNE_ARTICLE.datePublication}</span>
                    <span className="ml-auto flex items-center gap-1.5 text-amber-400 font-bold text-sm group-hover:gap-3 transition-all">
                      Lire l&apos;article <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </section>

            {/* ── GRILLE PRINCIPALE ── */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 bg-emerald-400 rounded-full" />
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Dernières nouvelles</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Carte grande (2 colonnes) */}
                {AUTRES.slice(0, 1).map((article) => (
                  <Link
                    key={article.id}
                    href={`/touba-infos/${article.slug}`}
                    className="group md:col-span-2 block relative rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${article.imageGradient} opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="absolute right-6 top-6 text-7xl opacity-20 select-none group-hover:opacity-30 transition-opacity">
                      {article.imageEmoji}
                    </div>
                    <div className="relative p-8 min-h-[260px] flex flex-col justify-end">
                      {article.breaking && (
                        <span className="self-start inline-flex items-center gap-1 bg-red-500 text-white text-xs font-black px-2 py-1 rounded mb-3 uppercase">
                          <Flame size={11} />Breaking
                        </span>
                      )}
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">{article.categorie}</span>
                      <h3 className="text-2xl font-black text-white leading-tight mb-3 group-hover:text-amber-200 transition-colors">
                        {article.titre}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">{article.extrait}</p>
                      <div className="flex items-center gap-4 text-white/40 text-xs">
                        <span>{article.auteur}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{article.tempsLecture}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Carte normale */}
                {AUTRES.slice(1, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}

                {/* 3 cartes normales */}
                {AUTRES.slice(2, 5).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}

                {/* Carte grande (2 colonnes) */}
                {AUTRES.slice(5, 6).map((article) => (
                  <Link
                    key={article.id}
                    href={`/touba-infos/${article.slug}`}
                    className="group md:col-span-2 block relative rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${article.imageGradient} opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
                    <div className="absolute left-6 top-6 text-7xl opacity-20 select-none">
                      {article.imageEmoji}
                    </div>
                    <div className="relative p-8 min-h-[260px] flex flex-col justify-end">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">{article.categorie}</span>
                      <h3 className="text-2xl font-black text-white leading-tight mb-3 group-hover:text-emerald-300 transition-colors">
                        {article.titre}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">{article.extrait}</p>
                      <div className="flex items-center gap-4 text-white/40 text-xs">
                        <span>{article.auteur}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{article.tempsLecture}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Reste */}
                {AUTRES.slice(6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* ── RUBRIQUES ── */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-1 h-6 bg-amber-400 rounded-full" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Explorer par rubrique</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CATEGORIES_INFO.map((cat) => {
                  const count = ARTICLES_INFO.filter((a) => a.categorie === cat).length;
                  const emoji = {
                    Mouridisme: "🌙",
                    Touba: "🕌",
                    Sénégal: "🇸🇳",
                    Afrique: "🌍",
                    International: "🌐",
                    Économie: "📈",
                    Sport: "🏆",
                    Culture: "🎭",
                  }[cat];
                  return (
                    <Link
                      key={cat}
                      href={`/touba-infos?categorie=${encodeURIComponent(cat)}`}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-300"
                    >
                      <div>
                        <div className="text-2xl mb-2">{emoji}</div>
                        <div className="text-white font-bold text-sm">{cat}</div>
                        <div className="text-white/30 text-xs">{count} article{count > 1 ? "s" : ""}</div>
                      </div>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ── CITATION SERIGNE TOUBA ── */}
            <section className="mb-16">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07402b] via-[#0a5535] to-[#042c1d] border border-emerald-800/50 p-10 md:p-16 text-center">
                <div className="absolute inset-0 opacity-5">
                  <div className="text-[20rem] text-white font-arabic select-none leading-none flex items-center justify-center h-full">
                    ﷺ
                  </div>
                </div>
                <div className="relative">
                  <div className="text-5xl mb-6 select-none">🌙</div>
                  <blockquote className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed mb-6 italic max-w-3xl mx-auto">
                    &ldquo;Le travail est une forme d&apos;adoration d&apos;Allah.&rdquo;
                  </blockquote>
                  <cite className="text-amber-400 font-bold text-sm uppercase tracking-widest">
                    Cheikh Ahmadou Bamba Mbacké — Khadimoul Rassoul
                  </cite>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── NEWSLETTER CTA ── */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-900/40 to-emerald-900/40 border border-amber-700/30 p-10 text-center">
          <div className="text-4xl mb-4">📨</div>
          <h2 className="text-2xl font-black text-white mb-3">
            Restez informé avec Touba Infos
          </h2>
          <p className="text-white/50 mb-6 max-w-xl mx-auto">
            Toute l&apos;actualité du Mouridisme, de Touba, du Sénégal et du monde —
            rigoureusement sélectionnée, professionnellement présentée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/221768001717"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Suivre sur WhatsApp
            </a>
            <Link
              href="/commande"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Agence Touba Visuel
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER TOUBA INFOS ── */}
      <footer className="border-t border-white/10 mt-16 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-3xl font-black bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            TOUBA INFOS
          </div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">
            Le meilleur des blogs du monde · Mouridisme · Touba · Sénégal · International
          </p>
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Touba Infos — Propulsé par{" "}
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Agence Touba Visuel
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ArticleCard({ article }: { article: import("@/lib/touba-infos").ArticleInfo }) {
  return (
    <Link
      href={`/touba-infos/${article.slug}`}
      className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 bg-white/5 hover:bg-white/10"
    >
      {/* Visual header */}
      <div className={`relative h-44 bg-gradient-to-br ${article.imageGradient}`}>
        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30 select-none group-hover:opacity-40 transition-opacity">
          {article.imageEmoji}
        </div>
        {article.breaking && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-black px-2 py-1 rounded uppercase">
              <Flame size={10} className="animate-pulse" />
              Breaking
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${COULEURS_CATEGORIES[article.categorie]}`}>
            {article.categorie}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-black text-white leading-snug mb-2 line-clamp-2 group-hover:text-amber-200 transition-colors">
          {article.titre}
        </h3>
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4">
          {article.extrait}
        </p>
        <div className="flex items-center justify-between text-white/30 text-xs">
          <span className="font-medium text-white/50 truncate max-w-[60%]">{article.auteur}</span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock size={11} />
            {article.tempsLecture}
          </span>
        </div>
      </div>
    </Link>
  );
}
