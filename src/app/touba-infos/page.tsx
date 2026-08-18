import Link from "next/link";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  PlayCircle,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { formatDateFr, formatHeureFr, VIDEOS_INFO, MAGAL, type ArticleInfo } from "@/lib/touba-infos";
import {
  getArticlesTries,
  getUne,
  getPlusLus,
  getArticlesInfoByCategorie,
  getArticlesInfoByGenre,
} from "@/lib/touba-infos-store";

export const revalidate = 20;

export const metadata = {
  title: {
    absolute: "Touba Infos — L'actualité de Touba, du Sénégal et du monde",
  },
  alternates: { canonical: "/" },
};
import {
  CardStandard,
  CardHorizontal,
  CardCompact,
  CardVideo,
  CategorieChip,
  EditorialImage,
  SectionHeading,
  AdSlot,
} from "./_components/ui";
import MagalCountdown from "./_components/MagalCountdown";
import NewsletterForm from "./_components/NewsletterForm";

export default async function ToubaInfosHome() {
  const tries = await getArticlesTries();
  const une = await getUne();
  const rest = tries.filter((a) => a.id !== une.id);

  const heroSide = rest.slice(0, 4);
  const alaUne = rest.slice(4, 8);
  const dernieres = rest.slice(8, 15);
  const plusLus = await getPlusLus(5);
  const filInfo = tries.slice(0, 5);

  const touba = tries.filter((a) => a.tags.includes("Touba"));
  const senegalNat = tries.filter((a) =>
    ["Sénégal", "Politique"].includes(a.categorie),
  );
  const [eco, societe, magal, afrique, international, sport, culture, religion] =
    await Promise.all([
      getArticlesInfoByCategorie("Économie"),
      getArticlesInfoByCategorie("Société"),
      getArticlesInfoByCategorie("Magal"),
      getArticlesInfoByCategorie("Afrique"),
      getArticlesInfoByCategorie("International"),
      getArticlesInfoByCategorie("Sport"),
      getArticlesInfoByCategorie("Culture"),
      getArticlesInfoByCategorie("Religion"),
    ]);
  const [interviews, analyses] = await Promise.all([
    getArticlesInfoByGenre("Interview"),
    getArticlesInfoByGenre("Analyse"),
  ]);

  return (
    <>
      {/* ══════════ HERO — GRANDE UNE ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Une principale */}
          <Link
            href={`/touba-infos/${une.slug}`}
            className="group relative col-span-1 min-h-[380px] overflow-hidden rounded-2xl lg:col-span-2 lg:min-h-[460px]"
          >
            <div className="absolute inset-0">
              <EditorialImage
                article={une}
                emojiSize="text-[11rem]"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-2">
                <CategorieChip categorie={une.categorie} />
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                  À la Une
                </span>
              </div>
              <h1 className="max-w-3xl text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                {une.titre}
              </h1>
              <p className="mt-3 hidden max-w-2xl text-white/80 sm:block">
                {une.sousTitre}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
                <span className="font-semibold text-white/90">{une.auteur}</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {une.tempsLecture}
                </span>
                <span className="ml-auto flex items-center gap-1.5 font-bold text-white transition-all group-hover:gap-3">
                  Lire <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </Link>

          {/* Colonne latérale — infos importantes */}
          <div className="flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white px-4">
            {heroSide.map((a) => (
              <CardHorizontal key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Publicité */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <AdSlot format="leaderboard" />
      </section>

      {/* ══════════ À LA UNE + SIDEBAR ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <SectionHeading titre="À la Une" />
            <div className="grid gap-5 sm:grid-cols-2">
              {alaUne.map((a) => (
                <CardStandard key={a.id} article={a} />
              ))}
            </div>

            <div className="mt-10">
              <SectionHeading titre="Dernières actualités" href="/touba-infos/fil-info" hrefLabel="Fil info" />
              <div className="divide-y divide-neutral-100">
                {dernieres.map((a) => (
                  <CardHorizontal key={a.id} article={a} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Les plus lus */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-neutral-900">
                <TrendingUp size={16} className="text-green-600" /> Les plus lus
              </h3>
              <div>
                {plusLus.map((a, i) => (
                  <CardCompact key={a.id} article={a} index={i + 1} />
                ))}
              </div>
            </div>

            <AdSlot format="rectangle" />

            {/* Fil info */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-neutral-900">
                Fil info
              </h3>
              <ul className="space-y-3">
                {filInfo.map((a) => (
                  <li key={a.id} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 font-mono text-xs font-bold text-green-600">
                      {formatHeureFr(a.date)}
                    </span>
                    <Link
                      href={`/touba-infos/${a.slug}`}
                      className="font-medium leading-snug text-neutral-700 hover:text-green-700"
                    >
                      {a.titre}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/touba-infos/fil-info"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-green-700 hover:text-green-800"
              >
                Tout le fil <ArrowRight size={13} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ══════════ TOUBA ══════════ */}
      <BandeSection bg="neutral">
        <FeatureBlock
          titre="Touba"
          href="/touba-infos/rubrique/touba"
          items={touba}
        />
      </BandeSection>

      {/* ══════════ SÉNÉGAL ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading titre="Sénégal" href="/touba-infos/rubrique/senegal" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {senegalNat.slice(0, 4).map((a) => (
            <CardStandard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* ══════════ GRAND MAGAL ══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                Dossier spécial
              </span>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Grand Magal de Touba
              </h2>
              <p className="mt-2 max-w-md text-white/80">
                Programme, circulation, sécurité, santé, hébergement, histoire et
                économie du Magal. Suivez toute l&apos;actualité de la plus grande
                manifestation religieuse d&apos;Afrique de l&apos;Ouest.
              </p>
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                  {MAGAL.edition} — {MAGAL.dateAffichee}
                </p>
                <MagalCountdown dateISO={MAGAL.dateISO} />
              </div>
              <Link
                href="/touba-infos/magal"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50"
              >
                Accéder au dossier Magal <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {magal.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href={`/touba-infos/${a.slug}`}
                  className="group flex items-center gap-4 rounded-xl bg-white/10 p-3 backdrop-blur transition hover:bg-white/15"
                >
                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <EditorialImage article={a} emojiSize="text-2xl" />
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-green-100">
                    {a.titre}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ÉCONOMIE & SOCIÉTÉ ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <ThemeColumn titre="Économie" href="/touba-infos/rubrique/economie" items={eco} />
          <ThemeColumn titre="Société" href="/touba-infos/rubrique/societe" items={societe} />
        </div>
      </section>

      {/* ══════════ TOUBA INFOS TV ══════════ */}
      <section className="bg-neutral-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-2">
            <h2 className="flex items-center gap-2.5 text-lg font-black uppercase tracking-tight sm:text-xl">
              <PlayCircle size={22} className="text-green-500" /> Touba Infos TV
            </h2>
            <Link
              href="/touba-infos/videos"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-green-400 hover:text-green-300"
            >
              Toutes les vidéos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEOS_INFO.slice(0, 4).map((v) => (
              <CardVideo key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ RELIGION ══════════ */}
      <BandeSection bg="white">
        <FeatureBlock
          titre="Religion"
          href="/touba-infos/rubrique/religion"
          items={religion}
        />
      </BandeSection>

      {/* Publicité */}
      <section className="mx-auto max-w-7xl px-4 pt-4">
        <AdSlot format="leaderboard" />
      </section>

      {/* ══════════ AFRIQUE & INTERNATIONAL ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <ThemeColumn titre="Afrique" href="/touba-infos/rubrique/afrique" items={afrique} />
          <ThemeColumn titre="International" href="/touba-infos/rubrique/international" items={international} />
        </div>
      </section>

      {/* ══════════ SPORT & CULTURE ══════════ */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 md:grid-cols-2">
            <ThemeColumn titre="Sport" href="/touba-infos/rubrique/sport" items={sport} />
            <ThemeColumn titre="Culture" href="/touba-infos/rubrique/culture" items={culture} />
          </div>
        </div>
      </section>

      {/* ══════════ INTERVIEWS & ANALYSES ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <ThemeColumn titre="Interviews" href="/touba-infos/rubrique/interviews" items={interviews} badge="Interview" />
          <ThemeColumn titre="Analyses" href="/touba-infos/rubrique/analyses" items={analyses} badge="Analyse" />
        </div>
      </section>

      {/* ══════════ NEWSLETTER + RÉSEAUX ══════════ */}
      <section className="border-y border-neutral-200 bg-green-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">
              Restez informé avec Touba Infos
            </h2>
            <p className="mt-2 text-neutral-600">
              Recevez l&apos;essentiel de l&apos;actualité de Touba, du Sénégal et
              du monde. Une sélection rigoureuse, chaque jour.
            </p>
            <div className="mt-5 max-w-md">
              <NewsletterForm />
            </div>
          </div>
          <div className="md:pl-8">
            <p className="text-sm font-black uppercase tracking-widest text-green-800">
              Suivez Touba Infos
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <SocialButton label="Facebook" href="https://facebook.com" Icon={Facebook} />
              <SocialButton label="YouTube" href="https://youtube.com" Icon={Youtube} />
              <SocialButton label="Instagram" href="https://instagram.com" Icon={Instagram} />
              <a
                href="https://wa.me/221768001717"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Bande de section (fond blanc / gris) ── */
function BandeSection({
  children,
  bg = "white",
}: {
  children: React.ReactNode;
  bg?: "white" | "neutral";
}) {
  return (
    <section
      className={`py-12 ${
        bg === "neutral"
          ? "border-y border-neutral-100 bg-neutral-50"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}

/* ── Bloc « lead + liste » pour une rubrique ── */
function FeatureBlock({
  titre,
  href,
  items,
}: {
  titre: string;
  href: string;
  items: ArticleInfo[];
}) {
  if (items.length === 0) return null;
  const [lead, ...suite] = items;
  return (
    <>
      <SectionHeading titre={titre} href={href} />
      <div className="grid gap-6 lg:grid-cols-2">
        <FeatureLead article={lead} />
        <div className="divide-y divide-neutral-100">
          {suite.slice(0, 4).map((a) => (
            <CardHorizontal key={a.id} article={a} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Carte « lead » (grande, format vidéo) ── */
function FeatureLead({ article }: { article: ArticleInfo }) {
  return (
    <Link href={`/touba-infos/${article.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <EditorialImage
          article={article}
          emojiSize="text-7xl"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <CategorieChip categorie={article.categorie} />
        </div>
      </div>
      <h3 className="mt-3 text-xl font-black leading-tight text-neutral-900 group-hover:text-green-700">
        {article.titre}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500 line-clamp-2">
        {article.extrait}
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
        <span className="font-medium text-neutral-600">{article.auteur}</span>
        <span>•</span>
        <span>{formatDateFr(article.date)}</span>
      </div>
    </Link>
  );
}

/* ── Colonne thématique (2 par ligne) ── */
function ThemeColumn({
  titre,
  href,
  items,
  badge,
}: {
  titre: string;
  href: string;
  items: ArticleInfo[];
  badge?: string;
}) {
  if (items.length === 0) {
    return (
      <div>
        <SectionHeading titre={titre} href={href} />
        <p className="py-6 text-sm text-neutral-400">
          Contenus à venir dans cette rubrique.
        </p>
      </div>
    );
  }
  const [lead, ...suite] = items;
  return (
    <div>
      <SectionHeading titre={titre} href={href} />
      <Link href={`/touba-infos/${lead.slug}`} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <EditorialImage article={lead} emojiSize="text-6xl" className="transition-transform duration-500 group-hover:scale-105" />
          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-black leading-tight text-neutral-900 group-hover:text-green-700">
          {lead.titre}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 line-clamp-2">
          {lead.extrait}
        </p>
      </Link>
      {suite.length > 0 && (
        <div className="mt-3 divide-y divide-neutral-100 border-t border-neutral-100">
          {suite.slice(0, 3).map((a) => (
            <CardHorizontal key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function SocialButton({
  label,
  href,
  Icon,
}: {
  label: string;
  href: string;
  Icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-neutral-800 shadow-sm ring-1 ring-neutral-200 transition hover:text-green-700"
    >
      <Icon size={18} /> {label}
    </a>
  );
}
