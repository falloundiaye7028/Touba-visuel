"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Phone, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/commande", label: "Commander" },
  { href: "/suivi", label: "Suivi Commande" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-vert-900 shadow-lg">
      {/* Barre supérieure */}
      <div className="bg-vert-950 text-or-300 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              +221 77 800 17 17
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              Touba, Sénégal
            </span>
          </div>
          <span>Livraison Touba &bull; Dakar &bull; Partout au Sénégal &bull; International</span>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* Icône ATV style neon */}
            <div className="w-11 h-11 bg-gray-950 border border-or-500/60 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <span className="text-or-400 font-black text-sm tracking-tight"
                style={{ textShadow: "0 0 8px #ffffff, 0 0 16px #ffffff" }}>
                ATV
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-0">
                <span className="text-or-400 font-black text-lg tracking-wide leading-none"
                  style={{ textShadow: "0 0 6px rgba(255,255,255,0.5)" }}>
                  AGENCE
                </span>
              </div>
              <div>
                <span className="text-white font-bold text-base tracking-widest leading-none">
                  TOUBA VISUEL
                </span>
              </div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-vert-200 hover:text-or-400 text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/commande"
              className="flex items-center gap-2 bg-or-500 hover:bg-or-400 text-vert-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <ShoppingBag size={16} />
              Commander
            </Link>
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile ouvert */}
      {menuOpen && (
        <div className="md:hidden bg-vert-900 border-t border-vert-700 px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-vert-100 hover:text-or-400 text-base font-medium py-2 border-b border-vert-800 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/commande"
              className="mt-2 flex items-center justify-center gap-2 bg-or-500 text-vert-950 font-bold text-base px-4 py-3 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingBag size={18} />
              Passer une commande
            </Link>
          </nav>
          <div className="mt-4 pt-3 border-t border-vert-700 text-vert-400 text-xs space-y-1">
            <p className="flex items-center gap-1"><Phone size={12} /> +221 77 800 17 17</p>
            <p className="flex items-center gap-1"><MapPin size={12} /> Touba, Sénégal</p>
          </div>
        </div>
      )}
    </header>
  );
}
