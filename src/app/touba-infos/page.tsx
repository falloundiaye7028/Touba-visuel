import Link from "next/link";
import { AlertCircle, ArrowRight, Bell, Newspaper, Send } from "lucide-react";
import { slugCategorie } from "@/lib/touba-infos";
import { getArticlesTries } from "@/lib/touba-infos-store";
import { CardStandard, CategorieChip, EditorialImage, SectionHeading } from "./_components/ui";

export const revalidate = 20;

export const metadata = {
  title: { absolute: "Touba Infos — L’actualité de Touba, du Sénégal et du monde" },
  alternates: { canonical: "/" },
};

export default async function ToubaInfosHome() {
  try {
    const articles = await getArticlesTries();
    const une = articles.find((article) => article.alaUne) ?? articles[0];
    const suite = articles.filter((article) => article.id !== une?.id);

    if (!une) return <EmptyState />;

    return (
      <>
        <section className="border-b border-neutral-200 bg-neutral-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.5fr_1fr] lg:py-14">
            <Link href={`/touba-infos/${une.slug}`} className="group relative overflow-hidden rounded-2xl bg-neutral-900">
              <div className="aspect-[16/9]">
                <EditorialImage article={une} emojiSize="text-[9rem]" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-5 pt-24 sm:p-8 sm:pt-32">
                <CategorieChip categorie={une.categorie} />
                <h1 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">{une.titre}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{une.extrait}</p>
              </div>
            </Link>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-300">À la une</p>
              <h2 className="mt-3 text-2xl font-black leading-tight">L’information utile, au cœur de Touba.</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">Suivez les articles publiés par la rédaction, de Touba au monde.</p>
              <Link href="/touba-infos/fil-info" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-green-300 hover:text-green-200">
                Voir toutes les actualités <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <SectionHeading titre="Dernières actualités" href="/touba-infos/fil-info" hrefLabel="Fil info" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suite.slice(0, 6).map((article) => <CardStandard key={article.id} article={article} />)}
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
            <SectionHeading titre="Explorer par rubrique" />
            <div className="flex flex-wrap gap-3">
              {[...new Set(articles.map((article) => article.categorie))].map((categorie) => (
                <Link key={categorie} href={`/touba-infos/rubrique/${slugCategorie(categorie)}`} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 hover:border-green-500 hover:text-green-700">
                  {categorie}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  } catch {
    return <ErrorState />;
  }
}

function EmptyState() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <Newspaper size={42} className="text-green-700" />
      <h1 className="mt-5 text-3xl font-black text-neutral-900">La rédaction prépare ses prochaines publications.</h1>
      <p className="mt-3 max-w-xl text-neutral-600">Aucun article publié n’est disponible pour le moment. Revenez bientôt ou contactez la rédaction.</p>
      <Link href="/touba-infos/contact#alerte" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700">Contacter la rédaction <Send size={16} /></Link>
    </section>
  );
}

function ErrorState() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <AlertCircle size={42} className="text-amber-600" />
      <h1 className="mt-5 text-3xl font-black text-neutral-900">Les actualités sont temporairement indisponibles.</h1>
      <p className="mt-3 max-w-xl text-neutral-600">La rédaction reste accessible pendant le rétablissement du service.</p>
      <Link href="/touba-infos/contact#alerte" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700">Contacter la rédaction <Bell size={16} /></Link>
    </section>
  );
}
