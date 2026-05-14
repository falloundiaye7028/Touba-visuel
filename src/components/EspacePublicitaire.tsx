import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

export interface Pub {
  id: string;
  partenaire: string;
  imageUrl: string;
  lienUrl: string;
  format: "large" | "moyen" | "petit";
}

/* ── Modifiez ce tableau pour gérer vos publicités ── */
const PUBS: Pub[] = [
  {
    id: "1",
    partenaire: "Baraka Immo",
    imageUrl: "/images/baraka-immo.jpg",
    lienUrl: "https://www.facebook.com/barakaimmovateur",
    format: "large",
  },
  {
    id: "2",
    partenaire: "Orange Sénégal",
    imageUrl: "/images/orange-tabaski.jpg",
    lienUrl: "https://www.facebook.com/orange.sn",
    format: "moyen",
  },
  // Slot vide — affiche "Réservez cet espace"
  { id: "3", partenaire: "", imageUrl: "", lienUrl: "", format: "moyen" },
];

function SlotVide({ format }: { format: string }) {
  return (
    <a
      href={`https://wa.me/221778001717?text=Bonjour, je souhaite réserver un espace publicitaire sur votre site Agence Touba Visuel`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-or-400 bg-gray-50 hover:bg-or-50 rounded-xl transition-all duration-200 group ${
        format === "large" ? "min-h-[200px]" : "min-h-[160px]"
      }`}
    >
      <div className="w-12 h-12 bg-or-100 group-hover:bg-or-200 rounded-full flex items-center justify-center mb-3 transition-colors">
        <span className="text-2xl">📢</span>
      </div>
      <p className="font-bold text-gray-600 group-hover:text-or-700 text-sm mb-1">
        Réservez cet espace
      </p>
      <p className="text-gray-400 text-xs text-center px-4">
        Affichez votre publicité ici
      </p>
      <div className="mt-3 flex items-center gap-1.5 bg-or-500 group-hover:bg-or-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
        <Phone size={11} />
        Nous contacter
      </div>
    </a>
  );
}

export default function EspacePublicitaire() {
  const pubLarge = PUBS.find((p) => p.format === "large");
  const pubsMoyens = PUBS.filter((p) => p.format === "moyen");

  return (
    <section className="bg-white py-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre de la section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-or-500 rounded-full" />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                Espace commercial
              </p>
              <h2 className="text-gray-800 font-bold text-lg">
                Nos Partenaires & Publicités
              </h2>
            </div>
          </div>
          <a
            href={`https://wa.me/221778001717?text=Bonjour, je souhaite réserver un espace publicitaire sur votre site Agence Touba Visuel`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-or-600 hover:text-or-500 font-semibold border border-or-300 hover:border-or-400 px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
          >
            Réserver un espace →
          </a>
        </div>

        {/* Grille des publicités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Grande publicité — occupe 2 colonnes */}
          <div className="md:col-span-2">
            {pubLarge?.imageUrl ? (
              <a
                href={pubLarge.lienUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-white border border-gray-100"
              >
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={pubLarge.imageUrl}
                    alt={`Publicité — ${pubLarge.partenaire}`}
                    fill
                    className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  Sponsorisé
                </span>
              </a>
            ) : (
              <SlotVide format="large" />
            )}
          </div>

          {/* Petites publicités — colonne droite */}
          <div className="flex flex-col gap-4">
            {pubsMoyens.map((pub) =>
              pub.imageUrl ? (
                <a
                  key={pub.id}
                  href={pub.lienUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex-1 bg-white border border-gray-100"
                >
                  <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={pub.imageUrl}
                      alt={`Publicité — ${pub.partenaire}`}
                      fill
                      className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    Sponsorisé
                  </span>
                </a>
              ) : (
                <div key={pub.id} className="flex-1">
                  <SlotVide format="moyen" />
                </div>
              )
            )}
          </div>
        </div>

        {/* Bannière CTA bas de section */}
        <div className="mt-5 bg-gradient-to-r from-vert-900 to-vert-700 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">
              Votre entreprise pourrait être ici
            </p>
            <p className="text-vert-300 text-xs">
              Touchez des milliers de clients à Touba, Dakar et dans la diaspora
            </p>
          </div>
          <a
            href={`https://wa.me/221778001717?text=Bonjour, je veux afficher ma publicité sur votre site`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-or-500 hover:bg-or-400 text-vert-950 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Phone size={14} />
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
