import Link from "next/link";
import { ArrowRight, CheckCircle, Truck, Shield, Headphones } from "lucide-react";
import Hero from "@/components/Hero";
import CategorieCard from "@/components/CategorieCard";
import SupportCard from "@/components/SupportCard";
import Realisations from "@/components/Realisations";
import TikTokSection from "@/components/TikTokSection";
import BrandingSection from "@/components/BrandingSection";
import MotDirecteur from "@/components/MotDirecteur";
import AlbumShooting from "@/components/AlbumShooting";
import Temoignages from "@/components/Temoignages";
import { BannierePromoGrande } from "@/components/BannierePromo";
import { CATALOGUE, getSupportsPopulaires } from "@/lib/supports";
import BlogCard from "@/components/BlogCard";
import { ARTICLES } from "@/lib/blog";
import StatsSection from "@/components/StatsSection";
import LogosClients from "@/components/LogosClients";
import FAQ from "@/components/FAQ";

const avantages = [
  {
    icon: <CheckCircle className="text-vert-600" size={28} />,
    titre: "Qualité garantie",
    description: "Matériaux premium, impression haute résolution, finitions soignées sur chaque commande.",
  },
  {
    icon: <Truck className="text-vert-600" size={28} />,
    titre: "Livraison rapide",
    description: "Express 48h à Touba. Livraison dans tout le Sénégal et à l'international.",
  },
  {
    icon: <Shield className="text-vert-600" size={28} />,
    titre: "Paiement sécurisé",
    description: "Stripe, Wave, Orange Money ou à la livraison — votre sécurité est notre priorité.",
  },
  {
    icon: <Headphones className="text-vert-600" size={28} />,
    titre: "Support dédié",
    description: "Notre équipe est disponible 7j/7 par WhatsApp, téléphone ou email.",
  },
];

const etapes = [
  { num: "01", titre: "Choisissez votre service", desc: "Impression, signalétique, textile, digital ou conception de site web — tout est disponible." },
  { num: "02", titre: "Personnalisez votre commande", desc: "Format, quantité, fichiers à transmettre ou création complète par nos graphistes et développeurs." },
  { num: "03", titre: "Payez en toute sécurité", desc: "Carte, Wave, Orange Money ou paiement à la livraison." },
  { num: "04", titre: "Recevez votre commande", desc: "Livraison rapide à Touba, Dakar, partout au Sénégal et à l'international." },
];

export default function HomePage() {
  const populaires = getSupportsPopulaires().slice(0, 8);

  return (
    <>
      <Hero />

      {/* Section avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((a) => (
              <div key={a.titre} className="flex flex-col items-start p-6 bg-gray-50 rounded-2xl">
                <div className="mb-3">{a.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{a.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos clients */}
      <LogosClients />

      {/* Grande bannière publicitaire */}
      <BannierePromoGrande />

      {/* Section supports populaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Supports les plus commandés</h2>
              <p className="section-subtitle">Nos produits phares choisis par nos clients</p>
            </div>
            <Link
              href="/catalogue"
              className="hidden md:flex items-center gap-2 text-vert-700 hover:text-vert-600 font-semibold text-sm"
            >
              Voir tout
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {populaires.map((support) => (
              <SupportCard key={support.id} support={support} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/catalogue" className="btn-outline">
              Voir tous les supports
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Branding / Identité ATV */}
      <BrandingSection />

      {/* Mot du Directeur */}
      <MotDirecteur />

      {/* Album Shooting */}
      <AlbumShooting />

      {/* Témoignages */}
      <Temoignages />

      {/* Stats ATV */}
      <StatsSection />

      {/* Section réalisations */}
      <Realisations />

      {/* Section TikTok */}
      <TikTokSection />

      {/* Section Blog */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Derniers articles du blog</h2>
              <p className="section-subtitle">Conseils marketing digital &amp; communication au Sénégal</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-vert-700 hover:text-vert-600 font-semibold text-sm"
            >
              Voir tous les articles
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="btn-outline">
              Voir tous les articles
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section catégories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Tous nos domaines d&apos;expertise</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              {CATALOGUE.length} catégories — impression, signalétique, textile, digital et <strong>conception de site web de A à Z</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATALOGUE.map((cat) => (
              <CategorieCard key={cat.id} categorie={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Section comment ça marche */}
      <section className="py-16 bg-gradient-touba text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Comment commander ?</h2>
            <p className="text-vert-200 text-lg max-w-xl mx-auto">
              Simple, rapide et sécurisé — votre commande en 4 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapes.map((etape, i) => (
              <div key={etape.num} className="relative">
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 z-0" style={{ background: "linear-gradient(90deg, #ff7a2a40, #ffc80040)" }} />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 font-bold text-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-gray-900"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
                    {etape.num}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{etape.titre}</h3>
                  <p className="text-vert-300 text-sm leading-relaxed">{etape.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/commande" className="btn-gold text-base px-8 py-4">
              Commencer maintenant
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Section paiements */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-6">
            Modes de paiement acceptés
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Visa / Mastercard", color: "bg-blue-50 border-blue-200 text-blue-700" },
              { label: "Wave", color: "bg-teal-50 border-teal-200 text-teal-700" },
              { label: "Orange Money", color: "bg-orange-50 border-orange-200 text-orange-700" },
              { label: "Paiement à la livraison", color: "bg-green-50 border-green-200 text-green-700" },
            ].map((m) => (
              <div
                key={m.label}
                className={`border ${m.color} rounded-xl px-6 py-3 font-semibold text-sm`}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
