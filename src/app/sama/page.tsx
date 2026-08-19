import Link from "next/link";
import {
  ShoppingCart, Package, Users, FileText, Store, BarChart3,
  Bot, Check, MessageCircle, ChevronRight,
} from "lucide-react";
import { PLANS } from "@/lib/sama/constants";
import { formatMoney } from "@/lib/sama/money";

export const dynamic = "force-static";

const FEATURES = [
  { icon: ShoppingCart, title: "Ventes rapides", desc: "Encaissez en quelques secondes, le stock et la marge se calculent seuls." },
  { icon: Package, title: "Stock & produits", desc: "Suivez votre inventaire, recevez des alertes de rupture automatiques." },
  { icon: Users, title: "Clients & CRM", desc: "Fichier clients, historique d'achats, créances et relances." },
  { icon: FileText, title: "Factures & reçus", desc: "Générez des factures professionnelles en PDF, partagez sur WhatsApp." },
  { icon: Store, title: "Boutique en ligne", desc: "Un lien de boutique pour vendre sur WhatsApp, TikTok et Instagram." },
  { icon: BarChart3, title: "Rapports clairs", desc: "Chiffre d'affaires, bénéfices, dépenses : vos chiffres en un coup d'œil." },
];

const PROBLEMS = [
  "Des ventes notées dans un cahier ou sur WhatsApp",
  "Un stock impossible à suivre",
  "Des bénéfices calculés à la main",
  "Des clients qui oublient de payer leurs dettes",
  "Des factures faites une par une",
];

const FAQ = [
  { q: "Ai-je besoin d'être connecté en permanence ?", a: "SAMA BUSINESS est optimisé pour les connexions mobiles. Vous gérez votre activité en quelques minutes par jour." },
  { q: "Puis-je payer par Wave ou Orange Money ?", a: "Oui, l'abonnement se règle par Wave, Orange Money ou virement. Notre équipe confirme l'activation." },
  { q: "Mes données sont-elles protégées ?", a: "Chaque entreprise est totalement isolée. Personne d'autre ne voit vos ventes, vos clients ni vos chiffres." },
  { q: "Est-ce compliqué à utiliser ?", a: "Non. En moins de 10 minutes, vous créez votre compte, ajoutez un produit, enregistrez une vente et générez une facture." },
];

export default function SamaLanding() {
  return (
    <div className="bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-vert-800">SAMA BUSINESS</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#fonctionnalites" className="hover:text-vert-700">Fonctionnalités</a>
            <a href="#ia" className="hover:text-vert-700">SAMA AI</a>
            <a href="#tarifs" className="hover:text-vert-700">Tarifs</a>
            <a href="#faq" className="hover:text-vert-700">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/sama/connexion" className="text-sm font-medium text-gray-700 px-3 py-2">Connexion</Link>
            <Link href="/sama/inscription" className="btn-primary !py-2 text-sm">Commencer</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-vert-900 via-vert-800 to-vert-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <span className="inline-block bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-5">Conçu pour les commerçants du Sénégal 🇸🇳</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Gérez votre commerce<br /> simplement.
          </h1>
          <p className="mt-5 text-lg text-vert-100 max-w-2xl mx-auto">
            Ventes, commandes, clients, stocks, factures et marketing dans une seule application. Vendez. Gérez. Encaissez. Fidélisez.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sama/inscription" className="btn-gold !px-6 !py-3 text-base">Commencer gratuitement</Link>
            <a href="#fonctionnalites" className="inline-flex items-center justify-center gap-2 border border-white/30 rounded-xl px-6 py-3 font-semibold hover:bg-white/10">
              Voir la démo <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-vert-200">14 jours d&apos;essai · sans carte bancaire</p>
        </div>
      </section>

      {/* Problèmes */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Fini la gestion à l&apos;ancienne</h2>
        <p className="text-center text-gray-500 mt-2">SAMA BUSINESS remplace vos outils dispersés.</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {PROBLEMS.map((p) => (
            <div key={p} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-red-400">✕</span><span className="text-sm text-gray-600">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Tout votre commerce, au même endroit</h2>
          <p className="text-center text-gray-500 mt-2">Simple, rapide, pensé pour le mobile.</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold">SAMA AI, votre assistant business</h2>
            <p className="mt-2 text-vert-100">« Combien ai-je vendu aujourd&apos;hui ? », « Quel est mon produit le plus rentable ? », « Quels produits risquent la rupture ? » — des réponses basées sur vos vraies données.</p>
            <span className="inline-block mt-4 bg-white/15 rounded-full px-3 py-1 text-xs">Inclus dans le plan Pro IA</span>
          </div>
        </div>
      </section>

      {/* Boutique */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-vert-100 text-vert-700 grid place-items-center mx-auto mb-4"><MessageCircle className="w-6 h-6" /></div>
          <h2 className="text-2xl sm:text-3xl font-bold">Votre boutique en ligne, prête à partager</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Un lien unique pour votre catalogue. Vos clients commandent en un clic et vous recevez la commande directement — WhatsApp inclus.</p>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Des tarifs adaptés à votre taille</h2>
        <p className="text-center text-gray-500 mt-2">Commencez gratuitement, évoluez quand vous voulez.</p>
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
          <h2 className="text-3xl font-bold">Prêt à faire grandir votre commerce ?</h2>
          <p className="mt-3 text-vert-100">Rejoignez les commerçants qui gèrent tout depuis leur téléphone.</p>
          <Link href="/sama/inscription" className="btn-gold !px-8 !py-3 mt-6 inline-flex">Commencer gratuitement</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>
            <div className="font-bold text-white text-lg">SAMA BUSINESS</div>
            <p className="mt-1">Vendez. Gérez. Encaissez. Fidélisez.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/sama/inscription" className="hover:text-white">Créer un compte</Link>
            <Link href="/sama/connexion" className="hover:text-white">Connexion</Link>
            <a href="#tarifs" className="hover:text-white">Tarifs</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-6 text-xs text-gray-500">© {new Date().getFullYear()} SAMA BUSINESS · Sénégal · Afrique francophone</div>
      </footer>
    </div>
  );
}
