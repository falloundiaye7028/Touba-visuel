import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Smartphone, Package, Shield, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Modes de paiement — Agence Touba Visuel",
  description: "Paiement sécurisé par carte bancaire, Wave, Orange Money ou à la livraison.",
};

const methodes = [
  {
    icon: <CreditCard size={32} className="text-blue-600" />,
    titre: "Carte Bancaire",
    sous: "Visa / Mastercard",
    bg: "bg-blue-50 border-blue-200",
    desc: "Paiement sécurisé via Stripe. Vos données bancaires ne sont jamais stockées sur nos serveurs. Connexion SSL 256 bits.",
    avantages: ["Paiement immédiat", "Confirmation instantanée", "Remboursement facilité"],
    disponible: true,
  },
  {
    icon: <Smartphone size={32} className="text-teal-600" />,
    titre: "Wave",
    sous: "Paiement mobile Sénégal",
    bg: "bg-teal-50 border-teal-200",
    desc: "Payez avec votre compte Wave. Rapide, sans frais supplémentaires, disponible 24h/24.",
    avantages: ["Sans frais supplémentaires", "Disponible 24h/24", "Confirmation rapide"],
    disponible: true,
  },
  {
    icon: <Smartphone size={32} className="text-orange-600" />,
    titre: "Orange Money",
    sous: "Mobile Money Orange",
    bg: "bg-orange-50 border-orange-200",
    desc: "Paiement via Orange Money. Compatible avec tous les numéros Orange au Sénégal et dans la sous-région.",
    avantages: ["Disponible dans toute l'Afrique de l'Ouest", "Pas besoin de carte bancaire", "Transaction sécurisée"],
    disponible: true,
  },
  {
    icon: <Package size={32} className="text-green-600" />,
    titre: "Paiement à la livraison",
    sous: "Cash à la réception",
    bg: "bg-green-50 border-green-200",
    desc: "Payez en espèces lors de la livraison ou du retrait en boutique. Disponible pour les commandes à Touba et Dakar.",
    avantages: ["Aucun risque en ligne", "Vérifiez avant de payer", "Retrait en boutique possible"],
    disponible: true,
  },
];

export default function PaiementPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-vert-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="text-vert-400 text-sm mb-4">
            <Link href="/" className="hover:text-or-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Modes de paiement</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-or-400" />
            <h1 className="text-3xl font-bold">Paiement sécurisé</h1>
          </div>
          <p className="text-vert-300 max-w-xl">
            Choisissez le mode de paiement qui vous convient le mieux. Toutes les transactions sont sécurisées.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {methodes.map((m) => (
            <div key={m.titre} className={`bg-white border-2 ${m.bg} rounded-2xl p-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{m.titre}</h3>
                  <p className="text-gray-500 text-sm">{m.sous}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{m.desc}</p>
              <ul className="space-y-1.5">
                {m.avantages.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Garanties */}
        <div className="bg-vert-900 text-white rounded-2xl p-8 text-center">
          <Shield size={40} className="text-or-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Votre sécurité est notre priorité</h2>
          <p className="text-vert-300 max-w-2xl mx-auto mb-6">
            Tous nos paiements en ligne sont chiffrés via SSL. Nous ne stockons jamais vos données bancaires.
            En cas de problème, notre équipe est disponible 7j/7 pour vous aider.
          </p>
          <Link href="/commande" className="btn-gold inline-flex">
            Passer une commande
          </Link>
        </div>
      </div>
    </div>
  );
}
