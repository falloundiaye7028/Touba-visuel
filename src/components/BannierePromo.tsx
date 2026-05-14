"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

export default function BannierePromo() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">🎁</span>
          <p className="text-sm font-bold truncate">
            <span className="text-yellow-200">Tissus yi yeksi neegn !</span>
            <span className="hidden sm:inline text-white font-normal mx-2">—</span>
            <span className="hidden sm:inline">Des cadeaux à n&apos;en pluuuus finir</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/commande"
            className="flex items-center gap-1.5 bg-white text-orange-600 hover:bg-yellow-50 font-bold text-xs px-3 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap"
          >
            <ShoppingBag size={12} />
            Commander
          </Link>
          <button
            onClick={() => setVisible(false)}
            className="text-white/80 hover:text-white p-1 transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function BannierePromoGrande() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-6">
      <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
        {/* Image principale */}
        <Link href="/commande">
          <div className="relative w-full aspect-[16/6] md:aspect-[16/5]">
            <Image
              src="/images/banniere-promo.jpg"
              alt="Tissus yi yeksi neegn — Des cadeaux à n'en pluuuus finir"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Overlay dégradé pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            {/* Texte superposé */}
            <div className="absolute inset-0 flex items-center px-8 md:px-12">
              <div>
                <p className="text-white text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">
                  Offre spéciale
                </p>
                <h2 className="text-white font-black text-2xl md:text-4xl leading-tight mb-1"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                  Tissus yi yeksi neegn !
                </h2>
                <p className="text-yellow-300 font-bold text-base md:text-xl mb-4"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  Des cadeaux à n&apos;en pluuuus finir
                </p>
                <span className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-lg">
                  <ShoppingBag size={16} />
                  Commander maintenant
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Bouton fermer */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
          aria-label="Fermer la bannière"
        >
          <X size={16} />
        </button>
      </div>
    </section>
  );
}
