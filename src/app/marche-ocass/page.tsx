"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Store, ShoppingBag, Star, TrendingUp, Shield,
  Megaphone, ChevronRight, CheckCircle, X, Phone, MapPin,
  Tag, Users, Sparkles, Crown, Zap, ArrowRight, Package,
  BadgeCheck, Clock, Heart, Eye
} from "lucide-react";

// ── Données mock ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "alimentation", label: "Alimentation", emoji: "🥗", count: 124 },
  { id: "vetements",    label: "Vêtements",    emoji: "👗", count: 87  },
  { id: "electronique", label: "Électronique", emoji: "📱", count: 63  },
  { id: "maison",       label: "Maison & Déco",emoji: "🏠", count: 51  },
  { id: "beaute",       label: "Beauté & Santé",emoji: "💄", count: 45 },
  { id: "services",     label: "Services",     emoji: "🔧", count: 38  },
  { id: "chaussures",   label: "Chaussures",   emoji: "👟", count: 29  },
  { id: "autres",       label: "Autres",       emoji: "📦", count: 72  },
];

const CANTINES_VEDETTE = [
  {
    id: 1,
    nom: "Boutique Fatou Diop",
    categorie: "Vêtements & Textile",
    description: "Mode sénégalaise haut de gamme — bazin, wax, tissus et tenues sur mesure pour toutes occasions.",
    produits: 48,
    note: 4.9,
    avis: 124,
    ville: "Touba",
    badge: "VIP",
    sponsor: true,
    couleur: "#0e7d52",
    emoji: "👗",
  },
  {
    id: 2,
    nom: "Épicerie Al Amine",
    categorie: "Alimentation",
    description: "Produits locaux et importés, épices de qualité, légumes frais. Livraison dans Touba.",
    produits: 130,
    note: 4.7,
    avis: 89,
    ville: "Touba",
    badge: "VÉRIFIÉ",
    sponsor: true,
    couleur: "#ff7a2a",
    emoji: "🥗",
  },
  {
    id: 3,
    nom: "Tech Mobile Touba",
    categorie: "Électronique & Téléphones",
    description: "Smartphones, accessoires, réparation rapide. Meilleurs prix garantis en ville sainte.",
    produits: 72,
    note: 4.8,
    avis: 57,
    ville: "Touba",
    badge: "TOP VENDEUR",
    sponsor: true,
    couleur: "#1d4ed8",
    emoji: "📱",
  },
  {
    id: 4,
    nom: "Maison Déco Sénégal",
    categorie: "Maison & Décoration",
    description: "Tapis, rideaux, artisanat sénégalais, mobilier. Sublimez votre intérieur avec notre collection.",
    produits: 35,
    note: 4.6,
    avis: 41,
    ville: "Touba",
    badge: null,
    sponsor: false,
    couleur: "#7c3aed",
    emoji: "🏠",
  },
];

const PRODUITS = [
  { id: 1,  nom: "Bazin Riche 5m",          prix: 35000, cantine: "Boutique Fatou Diop",   cat: "vetements",    emoji: "👘", vues: 210 },
  { id: 2,  nom: "Smartphone Samsung A15",  prix: 89000, cantine: "Tech Mobile Touba",      cat: "electronique", emoji: "📱", vues: 340 },
  { id: 3,  nom: "Sac de riz 25kg",          prix: 16000, cantine: "Épicerie Al Amine",      cat: "alimentation", emoji: "🌾", vues: 180 },
  { id: 4,  nom: "Tapis prière brodé",       prix: 12000, cantine: "Maison Déco Sénégal",   cat: "maison",       emoji: "🧶", vues: 95  },
  { id: 5,  nom: "Parfum Oud Al Shams",      prix: 22000, cantine: "Boutique Fatou Diop",   cat: "beaute",       emoji: "✨", vues: 156 },
  { id: 6,  nom: "Écouteurs Bluetooth",      prix: 8500,  cantine: "Tech Mobile Touba",      cat: "electronique", emoji: "🎧", vues: 88  },
  { id: 7,  nom: "Huile de Coco 500ml",      prix: 3500,  cantine: "Épicerie Al Amine",      cat: "alimentation", emoji: "🥥", vues: 67  },
  { id: 8,  nom: "Boubou Homme Luxe",        prix: 45000, cantine: "Boutique Fatou Diop",   cat: "vetements",    emoji: "🧥", vues: 122 },
];

const PLANS = [
  {
    id: "starter",
    nom: "STARTER",
    prix: 5000,
    periodicite: "/mois",
    couleur: "border-vert-600",
    bg: "bg-vert-50",
    textCouleur: "text-vert-700",
    btnClass: "btn-primary",
    badge: null,
    description: "Pour débuter sur MARCHÉ OCASS",
    avantages: [
      "1 cantine active",
      "Jusqu'à 20 produits listés",
      "Profil vendeur basique",
      "Apparition dans les résultats",
      "Contact WhatsApp intégré",
      "Support par email",
    ],
    desavantages: ["Pas de mise en avant", "Pas de badge vérifié"],
  },
  {
    id: "pro",
    nom: "PRO",
    prix: 10000,
    periodicite: "/mois",
    couleur: "border-or-400",
    bg: "bg-or-50",
    textCouleur: "text-or-700",
    btnClass: "btn-gold",
    badge: "POPULAIRE",
    description: "Visibilité maximale sur le portail",
    avantages: [
      "1 cantine en vedette (page d'accueil)",
      "Jusqu'à 100 produits listés",
      "Badge ✓ VÉRIFIÉ affiché",
      "Priorité dans les résultats de recherche",
      "Fiche cantine enrichie avec photos",
      "Contact WhatsApp + téléphone direct",
      "Statistiques de visites",
      "Support prioritaire 7j/7",
    ],
    desavantages: [],
  },
  {
    id: "boost",
    nom: "PUB BOOST",
    prix: null,
    periodicite: "",
    couleur: "border-orange-500",
    bg: "bg-orange-50",
    textCouleur: "text-orange-700",
    btnClass: "btn-orange",
    badge: "SUR DEVIS",
    description: "Promotion via les canaux ATV",
    avantages: [
      "Post sponsorisé TikTok ATV",
      "Story & Réel Instagram ciblé Touba",
      "Diffusion WhatsApp (liste 5 000+ abonnés)",
      "Visuel publicitaire créé par ATV",
      "Campagne Facebook Ads géo-ciblée",
      "Rapport de performance inclus",
    ],
    desavantages: [],
  },
];

const TEMOIGNAGES = [
  {
    nom: "Moustapha Ndiaye",
    role: "Vendeur — Épicerie Al Amine",
    texte: "Depuis mon inscription sur MARCHÉ OCASS, mes ventes ont doublé en moins de 2 mois. Les clients de la diaspora commandent maintenant directement depuis l'étranger !",
    note: 5,
    mois: "Mars 2025",
  },
  {
    nom: "Astou Diallo",
    role: "Vendeuse — Mode Touba Fashion",
    texte: "Le plan PRO vaut vraiment son prix. Ma cantine apparaît en tête des résultats et j'ai reçu 3× plus de contacts depuis. Le support est réactif et professionnel.",
    note: 5,
    mois: "Avril 2025",
  },
  {
    nom: "Ibrahima Seck",
    role: "Vendeur — Tech & Accessoires",
    texte: "La promotion PUB BOOST via les réseaux ATV m'a rapporté des ventes en 48h. Un investissement qui se rentabilise très vite pour n'importe quel commerçant.",
    note: 5,
    mois: "Février 2025",
  },
];

// ── Composant principal ────────────────────────────────────────────────────

export default function MarcheOcassPage() {
  const [recherche, setRecherche] = useState("");
  const [catActive, setCatActive] = useState("tous");
  const [showModal, setShowModal] = useState(false);
  const [planChoisi, setPlanChoisi] = useState<string | null>(null);
  const [favoris, setFavoris] = useState<number[]>([]);

  const toggleFavori = (id: number) => {
    setFavoris((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const ouvrirModal = (plan: string) => {
    setPlanChoisi(plan);
    setShowModal(true);
  };

  const produitsFiltres = catActive === "tous"
    ? PRODUITS
    : PRODUITS.filter((p) => p.cat === catActive);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #042c1d 0%, #07402b 35%, #0a6342 60%, #1d9c68 100%)",
          minHeight: "520px",
        }}
      >
        {/* Motif islamique subtil */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 0l5 10 11 0-9 8 3 11-10-7-10 7 3-11-9-8 11 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          {/* Badge portail */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{ background: "rgba(255,200,0,0.15)", borderColor: "rgba(255,200,0,0.4)", color: "#ffc800" }}
            >
              <Sparkles size={14} />
              Portail commercial de Touba
            </span>
          </div>

          {/* Titre principal */}
          <div className="text-center mb-8">
            <h1
              className="text-5xl md:text-7xl font-black text-white mb-3 leading-none tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MARCHÉ
              <span
                className="block md:inline md:ml-4"
                style={{ WebkitTextStroke: "2px #ffc800", color: "transparent" }}
              >
                OCASS
              </span>
            </h1>
            <p className="text-vert-200 text-xl md:text-2xl font-medium mt-4 max-w-2xl mx-auto">
              Ouvrez votre cantine en ligne — vendez à Touba et partout au Sénégal
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
              <Search className="absolute left-5 text-gray-400" size={22} />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un produit, une cantine, une catégorie..."
                className="w-full pl-14 pr-4 py-4 text-gray-900 text-base focus:outline-none"
              />
              <button className="m-2 px-6 py-3 rounded-xl font-bold text-gray-900 text-sm whitespace-nowrap flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
                Rechercher
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { val: "240+", label: "Cantines actives",   icon: <Store size={18} /> },
              { val: "3 800+", label: "Produits listés",  icon: <ShoppingBag size={18} /> },
              { val: "12 000+", label: "Clients / mois",  icon: <Users size={18} /> },
              { val: "5 000F", label: "Tarif mensuel",    icon: <Tag size={18} /> },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-vert-300 text-xs mb-1">
                  {s.icon}
                  {s.label}
                </div>
                <div className="text-white font-black text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vague basse */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1200 60" className="w-full h-10 fill-white">
            <path d="M0,60 C400,0 800,0 1200,60 L1200,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── CTA VENDEUR ──────────────────────────────────────────────────── */}
      <div className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm md:text-base">
            <strong className="text-vert-700">Vous vendez à Touba ?</strong> Ouvrez votre cantine en ligne dès aujourd&apos;hui pour seulement <strong>5 000 FCFA/mois</strong>
          </p>
          <button
            onClick={() => ouvrirModal("starter")}
            className="btn-primary whitespace-nowrap"
          >
            <Store size={18} />
            Ouvrir ma cantine
          </button>
        </div>
      </div>

      {/* ── CATÉGORIES ───────────────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-6 text-center">Toutes les catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatActive(cat.id === catActive ? "tous" : cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                  catActive === cat.id
                    ? "border-vert-600 bg-vert-50 shadow-md"
                    : "border-gray-100 bg-white hover:border-vert-300 hover:shadow-sm"
                }`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.label}</span>
                <span className="text-xs text-gray-400">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANTINES EN VEDETTE ──────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={20} className="text-or-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-or-600">Cantines en vedette</span>
              </div>
              <h2 className="section-title">Les meilleures boutiques</h2>
            </div>
            <Link href="#" className="hidden md:flex items-center gap-1 text-vert-700 font-semibold text-sm hover:text-vert-600">
              Voir toutes <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CANTINES_VEDETTE.map((c) => (
              <div
                key={c.id}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Bandeau couleur */}
                <div
                  className="h-24 flex items-center justify-center relative"
                  style={{ background: `${c.couleur}15` }}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
                  {c.sponsor && (
                    <span
                      className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#ffc800,#ff7a2a)" }}
                    >
                      SPONSORISÉ
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {/* Badge */}
                  {c.badge && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mb-2"
                      style={{ background: `${c.couleur}15`, color: c.couleur }}
                    >
                      <BadgeCheck size={10} />
                      {c.badge}
                    </span>
                  )}

                  <h3 className="font-bold text-gray-900 text-base mb-1">{c.nom}</h3>
                  <p className="text-xs text-gray-500 mb-2">{c.categorie}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{c.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-or-500 fill-or-500" />
                      <strong className="text-gray-700">{c.note}</strong> ({c.avis} avis)
                    </span>
                    <span className="flex items-center gap-1">
                      <Package size={12} />
                      {c.produits} produits
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <MapPin size={12} />
                    {c.ville}
                  </div>

                  <button className="w-full btn-outline text-xs py-2">
                    Voir la cantine
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUITS POPULAIRES ──────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-vert-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-vert-700">Produits du moment</span>
              </div>
              <h2 className="section-title">Produits populaires</h2>
            </div>
            {/* Filtre rapide */}
            <div className="hidden md:flex gap-2">
              {["tous", "alimentation", "vetements", "electronique"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCatActive(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    catActive === c
                      ? "bg-vert-700 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-vert-400"
                  }`}
                >
                  {c === "tous" ? "Tous" : CATEGORIES.find((cat) => cat.id === c)?.label ?? c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {produitsFiltres.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Image placeholder */}
                <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{p.emoji}</span>
                  <button
                    onClick={() => toggleFavori(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Heart
                      size={15}
                      className={favoris.includes(p.id) ? "fill-red-500 text-red-500" : "text-gray-300"}
                    />
                  </button>
                </div>

                <div className="p-3">
                  <p className="text-xs text-vert-600 font-semibold mb-1 truncate">{p.cantine}</p>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">{p.nom}</h3>

                  <div className="flex items-center justify-between">
                    <span className="font-black text-vert-700 text-base">
                      {p.prix.toLocaleString("fr-SN")} F
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye size={11} />
                      {p.vues}
                    </span>
                  </div>

                  <button className="w-full mt-3 bg-vert-50 hover:bg-vert-100 text-vert-700 font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
                    <Phone size={12} />
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #042c1d, #07402b, #0a6342)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Ouvrez votre cantine en 5 étapes
            </h2>
            <p className="text-vert-300 text-lg">Simple, rapide — commencez à vendre aujourd&apos;hui</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 relative">
            {[
              { num: "01", titre: "S'inscrire", desc: "Créez votre compte vendeur gratuitement en 2 minutes.", icon: "✍️" },
              { num: "02", titre: "Choisir un plan", desc: "Sélectionnez Starter (5 000F) ou Pro (10 000F) selon vos besoins.", icon: "💳" },
              { num: "03", titre: "Créer votre cantine", desc: "Personnalisez votre boutique — nom, description, logo, ville.", icon: "🏪" },
              { num: "04", titre: "Ajouter vos produits", desc: "Listez vos articles avec photos, prix et description détaillée.", icon: "📦" },
              { num: "05", titre: "Recevoir des clients", desc: "Vos produits apparaissent sur le portail — les clients vous contactent directement.", icon: "🎉" },
            ].map((e, i) => (
              <div key={e.num} className="relative text-center">
                {i < 4 && (
                  <div
                    className="hidden md:block absolute top-10 left-full w-full h-0.5 z-0 -translate-x-1/2"
                    style={{ background: "linear-gradient(90deg, #ffc80030, #ff7a2a30)" }}
                  />
                )}
                <div className="relative z-10">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
                  >
                    <span className="text-3xl">{e.icon}</span>
                  </div>
                  <div className="text-or-400 text-xs font-black uppercase tracking-widest mb-1">{e.num}</div>
                  <h3 className="text-white font-bold text-base mb-2">{e.titre}</h3>
                  <p className="text-vert-300 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => ouvrirModal("starter")}
              className="btn-gold text-base px-10 py-4 text-lg"
            >
              <Store size={20} />
              Ouvrir ma cantine maintenant
            </button>
            <p className="text-vert-400 text-sm mt-3">Paiement via Wave, Orange Money ou espèces</p>
          </div>
        </div>
      </section>

      {/* ── PLANS & TARIFS ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="tarifs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Tag size={20} className="text-vert-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-vert-700">Tarifs & abonnements</span>
            </div>
            <h2 className="section-title mb-3">Choisissez votre plan</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Commencez à 5 000 F/mois — sans commission sur vos ventes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${plan.couleur} p-6 ${plan.id === "pro" ? "shadow-2xl scale-105" : "shadow-sm"} transition-all duration-300 hover:shadow-xl`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-black text-white shadow"
                      style={{
                        background: plan.id === "pro"
                          ? "linear-gradient(135deg,#ffc800,#ff7a2a)"
                          : "linear-gradient(135deg,#ff7a2a,#e04a00)",
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mb-3 ${plan.bg} ${plan.textCouleur}`}>
                  {plan.nom}
                </div>

                <div className="mb-2">
                  {plan.prix ? (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                        {plan.prix.toLocaleString("fr-SN")}
                      </span>
                      <span className="text-gray-500 text-sm mb-1">F CFA{plan.periodicite}</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-black text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                      Sur devis
                    </div>
                  )}
                </div>

                <p className="text-gray-500 text-sm mb-5">{plan.description}</p>

                <ul className="space-y-2.5 mb-6">
                  {plan.avantages.map((av) => (
                    <li key={av} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={15} className="text-vert-600 flex-shrink-0 mt-0.5" />
                      {av}
                    </li>
                  ))}
                  {plan.desavantages.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-gray-400">
                      <X size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => ouvrirModal(plan.id)}
                  className={`w-full ${plan.btnClass} justify-center`}
                >
                  {plan.id === "boost" ? (
                    <><Megaphone size={16} /> Demander un devis</>
                  ) : (
                    <><Zap size={16} /> Choisir {plan.nom}</>
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Pas de commission sur vos ventes · Annulation possible chaque mois · Paiement local accepté
          </p>
        </div>
      </section>

      {/* ── PUBLICITÉ & PROMOTION ────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,200,0,0.08) 0%, transparent 70%), #f9fafb" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Megaphone size={22} className="text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Service Premium</span>
              </div>
              <h2 className="section-title mb-4">
                Boostez votre cantine<br />
                <span className="text-orange-500">via nos canaux ATV</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Agence Touba Visuel dispose de canaux digitaux actifs avec des milliers d&apos;abonnés ciblés sur Touba et la diaspora. Faites la promotion de votre boutique auprès des bonnes personnes.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { canal: "TikTok ATV", detail: "Vidéo dédiée de votre cantine — portée organique massive", emoji: "📱", abonnes: "15K+" },
                  { canal: "Instagram ATV", detail: "Story + Réel sponsorisé géo-ciblé Touba", emoji: "📸", abonnes: "8K+" },
                  { canal: "WhatsApp Broadcast", detail: "Message direct à +5 000 abonnés qualifiés", emoji: "💬", abonnes: "5K+" },
                  { canal: "Facebook Ads", detail: "Campagne payante ciblée ville + diaspora sénégalaise", emoji: "🎯", abonnes: "Ciblé" },
                ].map((c) => (
                  <div key={c.canal} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-2xl flex-shrink-0">{c.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-gray-900 text-sm">{c.canal}</h4>
                        <span className="text-xs text-vert-600 font-bold bg-vert-50 px-2 py-0.5 rounded-full">{c.abonnes}</span>
                      </div>
                      <p className="text-xs text-gray-500">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => ouvrirModal("boost")}
                className="btn-orange text-base px-8 py-4"
              >
                <Megaphone size={18} />
                Demander une promotion
              </button>
            </div>

            {/* Visuel résultats */}
            <div
              className="rounded-3xl p-8 border"
              style={{ background: "rgba(255,122,42,0.04)", borderColor: "rgba(255,122,42,0.15)" }}
            >
              <p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-5">Résultats moyens campagne Boost</p>
              <div className="space-y-5">
                {[
                  { label: "Vues sur la cantine", val: "+850%", sub: "première semaine", color: "#ff7a2a" },
                  { label: "Nouvelles commandes", val: "+3×",   sub: "vs semaine normale",  color: "#ffc800" },
                  { label: "Nouveaux abonnés",   val: "+240",   sub: "en moyenne",           color: "#0e7d52" },
                  { label: "ROI de la campagne", val: "8–15×",  sub: "retour sur investissement", color: "#1d4ed8" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-4">
                    <div
                      className="text-2xl font-black w-20 text-right flex-shrink-0"
                      style={{ color: r.color, fontFamily: "var(--font-display)" }}
                    >
                      {r.val}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.label}</p>
                      <p className="text-gray-400 text-xs">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(255,200,0,0.1)", border: "1px solid rgba(255,200,0,0.3)" }}>
                <p className="text-sm font-semibold text-gray-800">
                  💡 <strong>Offre combinée :</strong> Abonnement PRO + Pub Boost mensuel pour une visibilité maximale toute l&apos;année.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAIL TOUBA ────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Pourquoi MARCHÉ OCASS ?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Le premier portail commercial dédié à Touba — la ville sainte et capitale économique du mouridisme
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin size={28} className="text-vert-600" />,
                titre: "Ancré dans Touba",
                desc: "MARCHÉ OCASS est pensé pour les commerçants de Touba et leurs clients. Interface en français + arabe, tarifs en FCFA, paiements locaux.",
              },
              {
                icon: <Users size={28} className="text-vert-600" />,
                titre: "Touchez la diaspora",
                desc: "Des millions de mourides vivent en Europe, aux USA, au Gabon. Votre cantine est visible mondialement — commandes et envois facilitées.",
              },
              {
                icon: <Shield size={28} className="text-vert-600" />,
                titre: "Plateforme de confiance",
                desc: "Vendeurs vérifiés, avis authentiques, système de signalement. MARCHÉ OCASS garantit un commerce transparent et sécurisé.",
              },
              {
                icon: <Phone size={28} className="text-vert-600" />,
                titre: "Paiements mobiles",
                desc: "Vos clients paient par Wave, Orange Money, Free Money ou carte bancaire. Encaissez directement sur votre compte mobile.",
              },
              {
                icon: <TrendingUp size={28} className="text-vert-600" />,
                titre: "Statistiques en temps réel",
                desc: "Suivez vos vues, contacts, produits populaires. Le tableau de bord vendeur vous donne toutes les clés pour optimiser vos ventes.",
              },
              {
                icon: <Sparkles size={28} className="text-vert-600" />,
                titre: "Croissance garantie",
                desc: "MARCHÉ OCASS est soutenu par ATV — agence digitale avec une communauté active de dizaines de milliers d'abonnés à Touba et en diaspora.",
              },
            ].map((item) => (
              <div key={item.titre} className="flex flex-col gap-3 p-6 bg-gray-50 rounded-2xl">
                <div>{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-base">{item.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Ils font confiance à MARCHÉ OCASS</h2>
            <p className="section-subtitle">Vendeurs satisfaits qui ont transformé leur business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.note }).map((_, i) => (
                    <Star key={i} size={16} className="text-or-400 fill-or-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">&ldquo;{t.texte}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#0e7d52,#1d9c68)" }}
                  >
                    {t.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.nom}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-300 flex items-center gap-1">
                    <Clock size={11} />
                    {t.mois}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #042c1d 0%, #07402b 50%, #ffc800 200%)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="text-6xl mb-6">🏪</div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rejoignez<br />MARCHÉ OCASS
          </h2>
          <p className="text-vert-200 text-xl mb-8 leading-relaxed">
            Plus de 240 cantines vous attendent. Ouvrez votre boutique en ligne
            et atteignez des milliers de clients dès aujourd&apos;hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => ouvrirModal("starter")}
              className="btn-gold text-lg px-10 py-4"
            >
              <Store size={22} />
              Ouvrir ma cantine — 5 000F/mois
            </button>
            <Link
              href="https://wa.me/221768001717?text=Bonjour%2C%20je%20veux%20ouvrir%20une%20cantine%20sur%20MARCH%C3%89%20OCASS"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all text-base"
            >
              <Phone size={20} />
              Nous contacter d&apos;abord
            </Link>
          </div>
          <p className="text-vert-400 text-sm mt-6">
            Paiement Wave · Orange Money · Espèces à Touba · Sans engagement
          </p>
        </div>
      </section>

      {/* ── MODAL INSCRIPTION ────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header modal */}
            <div
              className="p-6 text-white relative"
              style={{ background: "linear-gradient(135deg, #07402b, #0a6342)" }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
              <Store size={28} className="mb-3 text-or-400" />
              <h3 className="text-xl font-black mb-1">
                {planChoisi === "boost" ? "Demande de promotion" : "Ouvrir ma cantine"}
              </h3>
              <p className="text-vert-200 text-sm">
                {planChoisi === "starter" && "Plan STARTER — 5 000 F CFA / mois"}
                {planChoisi === "pro" && "Plan PRO — 10 000 F CFA / mois"}
                {planChoisi === "boost" && "Service PUB BOOST — tarif sur devis"}
              </p>
            </div>

            {/* Formulaire */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du vendeur / responsable</label>
                <input type="text" placeholder="Votre nom complet" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de votre cantine / boutique</label>
                <input type="text" placeholder="Ex: Boutique Al Amine" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone (WhatsApp)</label>
                  <input type="tel" placeholder="+221 XX XXX XX XX" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville</label>
                  <input type="text" placeholder="Touba" className="input-field" defaultValue="Touba" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie principale</label>
                <select className="input-field">
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              {planChoisi === "boost" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Décrivez votre besoin</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: je veux promouvoir ma boutique de vêtements sur TikTok et WhatsApp..."
                    className="input-field resize-none"
                  />
                </div>
              )}

              <div className="bg-vert-50 rounded-xl p-3 border border-vert-100">
                <p className="text-xs text-vert-700 font-semibold flex items-center gap-2">
                  <Shield size={14} />
                  Un conseiller ATV vous contactera dans les 24h pour finaliser votre inscription.
                </p>
              </div>

              <Link
                href={`https://wa.me/221768001717?text=Bonjour%2C%20je%20veux%20ouvrir%20une%20cantine%20sur%20MARCH%C3%89%20OCASS%20(plan%20${planChoisi?.toUpperCase()})%20!`}
                target="_blank"
                className="btn-primary w-full justify-center text-base py-3"
                onClick={() => setShowModal(false)}
              >
                <ArrowRight size={18} />
                Envoyer ma demande via WhatsApp
              </Link>
              <p className="text-center text-xs text-gray-400">
                Ou appelez le <strong>+221 76 800 17 17</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
