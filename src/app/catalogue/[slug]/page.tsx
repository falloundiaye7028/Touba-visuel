import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SupportCard from "@/components/SupportCard";
import { CATALOGUE, getCategorieBySlug } from "@/lib/supports";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATALOGUE.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categorie = getCategorieBySlug(slug);
  if (!categorie) return { title: "Catégorie introuvable" };
  const url = `https://touba-visuel.vercel.app/catalogue/${slug}`;
  return {
    title: `${categorie.nom} — Agence Touba Visuel (ATV)`,
    description: categorie.description,
    openGraph: {
      title: `${categorie.emoji} ${categorie.nom} — Agence Touba Visuel`,
      description: `${categorie.description} | ${categorie.supports.length} supports disponibles. Commandez en ligne — Livraison Touba, Dakar, Sénégal.`,
      url,
      siteName: "Agence Touba Visuel",
      locale: "fr_SN",
      type: "website",
      images: [
        {
          url: "/images/atv-tiktok-cover.jpg",
          width: 800,
          height: 1422,
          alt: `${categorie.nom} — ATV Touba Visuel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categorie.nom} — ATV`,
      description: categorie.description,
      images: ["/images/atv-tiktok-cover.jpg"],
    },
  };
}

export default async function CategorieDetailPage({ params }: Props) {
  const { slug } = await params;
  const categorie = getCategorieBySlug(slug);
  if (!categorie) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête catégorie */}
      <div className="bg-vert-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-vert-400 text-sm mb-4">
            <Link href="/" className="hover:text-or-400">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/catalogue" className="hover:text-or-400">Catalogue</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{categorie.nom}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{categorie.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{categorie.nom}</h1>
              <p className="text-vert-300 text-base max-w-2xl">{categorie.description}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="bg-or-500 text-vert-950 text-sm font-bold px-4 py-1.5 rounded-full">
              {categorie.supports.length} supports disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Grille des supports */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categorie.supports.map((support) => (
            <SupportCard key={support.id} support={support} categorieSlug={categorie.slug} />
          ))}
        </div>

        {/* Navigation entre catégories */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">
            Autres catégories
          </p>
          <div className="flex flex-wrap gap-3">
            {CATALOGUE.filter((c) => c.slug !== categorie.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/catalogue/${c.slug}`}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-vert-400 hover:bg-vert-50 text-gray-700 hover:text-vert-700 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
              >
                <span>{c.emoji}</span>
                {c.nom}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
