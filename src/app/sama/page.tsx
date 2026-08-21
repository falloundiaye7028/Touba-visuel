import Link from "next/link";
import {
  ShoppingCart, Package, Users, FileText, Store, BarChart3,
  Bot, Check, MessageCircle, ChevronRight,
} from "lucide-react";
import { PLANS } from "@/lib/sama/constants";
import { formatMoney } from "@/lib/sama/money";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: ShoppingCart, title: "Ventes rapides", desc: "Enregistrez une vente en quelques secondes. Stock, marge et encaissement se mettent à jour ensemble." },
  { icon: Package, title: "Stock & produits", desc: "Suivez votre inventaire et repérez les produits proches de la rupture." },
  { icon: Users, title: "Clients & créances", desc: "Historique d’achats, clients débiteurs et relances depuis une seule fiche." },
  { icon: FileText, title: "Factures & reçus", desc: "Créez des factures, devis et reçus professionnels, prêts à imprimer ou partager." },
  { icon: Store, title: "Boutique en ligne", desc: "Partagez votre catalogue sur WhatsApp, TikTok, Instagram ou Facebook." },
  { icon: BarChart3, title: "Résultats clairs", desc: "Chiffre d’affaires, marge, dépenses et créances : voyez où en est réellement votre activité." },
];

const PROBLEMS = [
  "Des ventes notées dans un cahier ou dispersées sur WhatsApp",
  "Un stock difficile à suivre au quotidien",
  "Des bénéfices calculés à la main",
  "Des créances clients qu’on oublie de relancer",
  "Des factures et reçus préparés un par un",
];

const STEPS = [
  { n: "1", title: "Créez votre entreprise", desc: "Renseignez votre activité et vos informations principales." },
  { n: "2", title: "Enregistrez votre activité", desc: "Ajoutez vos produits puis saisissez ventes, dépenses, clients et paiements." },
  { n: "3", title: "Laissez SAMA vous guider", desc: "Consultez vos résultats et demandez à SAMA AI ce qui mérite votre attention aujourd’hui." },
];

const FAQ = [
  { q: "Ai-je besoin d’être connecté en permanence ?", a: "Une connexion est nécessaire pour synchroniser vos données et utiliser les fonctions en ligne. L’application est pensée pour fonctionner efficacement sur mobile et peut être installée sur l’écran d’accueil." },
  { q: "Puis-je payer par Wave ou Orange Money ?", a: "Oui. Les abonnements peuvent être réglés par Wave, Orange Money ou virement selon les moyens configurés sur la plateforme." },
  { q: "Mes données sont-elles protégées ?", a: "Chaque entreprise dispose de son propre espace. Les accès et les données métier sont isolés côté serveur par entreprise." },
  { q: "Est-ce compliqué à utiliser ?", a: "Le parcours est conçu pour être simple : création du compte, ajout d’un produit, première vente puis lecture du tableau de bord." },
];

export default function SamaLanding() {
  return (
    <div className="bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-vert-800">SAMA PILOT</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#comment-ca-marche" className="hover:text-vert-700">Comment ça marche</a>
            <a href="#fonctionnalites" className="hover:text-vert-700">Fonctionnalités</a>
            <a href="#ia" className="hover:text-vert-700">SAMA AI</a>
            <a href="#tarifs" className="hover:text-vert-700">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/sama/connexion" className="text-sm font-medium text-gray-700 px-3 py-2">Connexion</Link>
            <Link href="/sama/inscription" className="btn-primary !py-2 text-sm">Créer mon compte</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-vert-900 via-vert-800 to-vert-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <span className="inline-block bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-5">SAMA PILOT · Votre copilote de gestion intelligent 🇸🇳</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Votre entreprise<br />dans votre poche.
          </h1>
          <p className="mt-5 text-lg text-vert-100 max-w-2xl mx-auto">
            Enregistrez vos ventes, suivez votre stock, vos créances et votre bénéfice. Puis demandez à SAMA AI ce que vous devez faire aujourd’hui.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sama/inscription" className="btn-gold !px-6 !py-3 text-base">Créer mon compte gratuitement</Link>
            <a href="#comment-ca-marche" className="inline-flex items-center justify-center gap-2 border border-white/30 rounded-xl px-6 py-3 font-semibold hover:bg-white/10">
              Voir comment ça marche <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-vert-200">14 jours d&apos;essai · sans carte bancaire · conçu pour le mobile</p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Du premier produit à la première décision</h2>
        <p className="text-center text-gray-500 mt-2 max-w-2xl mx-auto">SAMA PILOT est conçu pour vous amener rapidement à une vue claire de votre activité.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-2xl border border-gray-100 p-5 bg-white">
              <div className="w-10 h-10 rounded-full bg-vert-700 text-white grid place-items-center font-bold">{step.n}</div>
              <h3 className="font-semibold text-lg mt-4">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problèmes */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Fini la gestion dispersée</h2>
          <p className="text-center text-gray-500 mt-2">Un seul espace pour suivre ce qui compte vraiment.</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {PROBLEMS.map((p) => (
              <div key={p} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <span className="text-red-400">✕</span><span className="text-sm text-gray-600">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Tout votre commerce, au même endroit</h2>
          <p className="text-center text-gray-500 mt-2">Simple, rapide et pensé pour être utilisé depuis le téléphone.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="w-11 h-11 rounded-xl bg-vert-50 text-vert-600 grid place-items-center mb-3"><f.icon className="w-5 h-5" /></div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMA AI */}
      <section id="ia" className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-vert-800 to-vert-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 grid place-items-center shrink-0"><Bot className="w-10 h-10" /></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">SAMA AI ne se contente pas d’afficher vos chiffres</h2>
            <p className="mt-2 text-vert-100">Demandez « Que dois-je faire aujourd’hui ? ». SAMA peut attirer votre attention sur les stocks faibles, créances à récupérer, clients inactifs, commandes en attente ou baisse d’activité — à partir de vos données réelles.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="bg-white/15 rounded-full px-3 py-1">Essai : SAMA AI accessible</span>
              <span className="bg-white/15 rounded-full px-3 py-1">Après essai : plan Pro IA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-vert-100 text-vert-700 grid place-items-center mx-auto mb-4"><MessageCircle className="w-6 h-6" /></div>
          <h2 className="text-2xl sm:text-3xl font-bold">Votre boutique en ligne, prête à partager</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Un lien unique pour votre catalogue. Vos clients peuvent commander en ligne et vous pouvez poursuivre l’échange sur WhatsApp.</p>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Commencez gratuitement, évoluez selon vos besoins</h2>
        <p className="text-center text-gray-500 mt-2">Les limites et fonctionnalités augmentent avec votre activité.</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((p) => (
            <div key={p.code} className={`rounded-2xl border p-5 flex flex-col ${p.highlight ? "border-vert-500 ring-2 ring-vert-500 shadow-lg" : "border-gray-100"}`}>
              {p.highlight && <span className="text-xs font-semibold text-vert-700 mb-1">POPULAIRE</span>}
              <div className="font-bold text-lg">{p.name}</div>
              <div className="text-3xl font-extrabold mt-1">{p.priceMonthly === 0 ? "0" : formatMoney(p.priceMonthly).replace(" FCFA", "")}<span className="text-sm font-normal text-gray-400"> FCFA{p.priceMonthly > 0 ? "/mois" : ""}</span></div>
              <ul className="mt-4 space-y-2 flex-1">
                {p.features.map((f) => <li key={f} className="flex gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-vert-600 shrink-0" />{f}</li>)}
              </ul>
              <Link href="/sama/inscription" className={`mt-5 text-center ${p.highlight ? "btn-primary" : "btn-outline"}`}>Choisir</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Questions fréquentes</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="bg-white rounded-xl border border-gray-100 p-4">
                <summary className="font-medium cursor-pointer">{f.q}</summary>
                <p className="text-sm text-gray-500 mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vert-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Commencez par votre première vente</h2>
          <p className="mt-3 text-vert-100">Créez votre espace, ajoutez vos produits et découvrez ce que vos chiffres peuvent déjà vous apprendre.</p>
          <Link href="/sama/inscription" className="btn-gold !px-8 !py-3 mt-6 inline-flex">Créer mon compte gratuitement</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-6 text-sm">
          <div>
            <div className="font-bold text-white text-lg">SAMA PILOT</div>
            <p className="mt-1">Vendez. Gérez. Encaissez. Décidez avec l’IA.</p>
            <p className="mt-3 text-gray-300">Développé par <span className="font-semibold text-white">Touba Digital Group</span></p>
            <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs">
              <a href="tel:+221778001717" className="hover:text-white transition-colors">+221 77 800 17 17</a>
              <a href="mailto:toubainfos@gmail.com" className="hover:text-white transition-colors">toubainfos@gmail.com</a>
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/sama/inscription" className="hover:text-white">Créer un compte</Link>
            <Link href="/sama/connexion" className="hover:text-white">Connexion</Link>
            <a href="#tarifs" className="hover:text-white">Tarifs</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-6 text-xs text-gray-500">© {new Date().getFullYear()} SAMA PILOT · Sénégal · Afrique francophone</div>
      </footer>
    </div>
  );
}
