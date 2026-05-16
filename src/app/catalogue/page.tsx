import type { Metadata } from "next";
import Link from "next/link";
import CategorieCard from "@/components/CategorieCard";
import SupportCard from "@/components/SupportCard";
import { CATALOGUE, getSupportsPopulaires, TOTAL_SUPPORTS, TOTAL_CATEGORIES } from "@/lib/supports";

export const metadata: Metadata = {
  title: "Catalogue — Tous nos supports de communication",
  description: `Découvrez notre catalogue de ${TOTAL_SUPPORTS}+ supports de communication répartis en ${TOTAL_CATEGORIES} catégories. Impression, signalétique, textile, digital et plus.`,
};

export default function CataloguePage() {
  const populaires = getSupportsPopulaires();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-vert-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-vert-400 text-sm mb-4">
            <Link href="/" className="hover:text-or-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Catalogue</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Catalogue complet
          </h1>
          <p className="text-vert-300 text-lg max-w-2xl">
            {TOTAL_SUPPORTS}+ supports de communication dans {TOTAL_CATEGORIES} catégories.
            Tout ce dont vous avez besoin pour votre visibilité.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Grille des catégories */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATALOGUE.map((cat) => (
              <CategorieCard key={cat.id} categorie={cat} />
            ))}
          </div>
        </div>

        {/* Supports populaires */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Supports les plus populaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {populaires.map((support) => (
              <SupportCard key={support.id} support={support} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-touba rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Vous ne trouvez pas ce qu'il vous faut ?</h3>
          <p className="text-vert-200 mb-6">
            Contactez-nous pour un devis personnalisé sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/commande" className="btn-gold">
              Passer une commande
            </Link>
            <a
              href="https://wa.me/221768001717"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-vert-900"
            >
              Contacter par WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
