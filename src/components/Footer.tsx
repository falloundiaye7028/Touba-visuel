import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-vert-950 text-vert-300">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Colonne 1 — Logo & description */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gray-950 border border-or-500/60 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <span className="text-or-400 font-black text-sm tracking-tight"
                style={{ textShadow: "0 0 8px #ffffff" }}>
                ATV
              </span>
            </div>
            <div>
              <p className="text-or-400 font-black text-base tracking-wide leading-tight">AGENCE</p>
              <p className="text-white font-bold text-base tracking-widest leading-tight">TOUBA VISUEL</p>
            </div>
          </div>
          <p className="text-vert-400 text-sm leading-relaxed mb-4">
            Votre partenaire de confiance pour tous vos besoins en communication visuelle.
            Impression, signalétique, textile, digital — tout sous un même toit.
          </p>
          <div className="flex gap-3">
            <a href="https://web.facebook.com/agencetoubavisuel/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-vert-800 hover:bg-or-500 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Facebook size={16} className="text-white" />
            </a>
            <a href="https://web.facebook.com/Shootingphotodor/" target="_blank" rel="noopener noreferrer" title="Nos Reportages Photos" className="w-9 h-9 bg-vert-800 hover:bg-or-500 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Instagram size={16} className="text-white" />
            </a>
            <a href="https://www.youtube.com/@toubainfostv183" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-vert-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@yoonu_murid_digital" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-vert-800 hover:bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Colonne 2 — Services */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Nos Services</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/catalogue/impression-papier", label: "Impression & Papier" },
              { href: "/catalogue/signaletique-grand-format", label: "Signalétique & Grand Format" },
              { href: "/catalogue/textile-objets", label: "Textile & Objets Publicitaires" },
              { href: "/catalogue/numerique-digital", label: "Numérique & Digital" },
              { href: "/catalogue/evenementiel", label: "Événementiel" },
              { href: "/catalogue/identite-corporate", label: "Identité Corporate" },
              { href: "/catalogue/couverture-mediatique", label: "Couverture Médiatique" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-vert-400 hover:text-or-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://web.facebook.com/Shootingphotodor/" target="_blank" rel="noopener noreferrer" className="text-vert-400 hover:text-or-400 transition-colors">
                📸 Nos Reportages Photos
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 — Liens rapides */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informations</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/commande", label: "Passer une commande" },
              { href: "/suivi", label: "Suivre ma commande" },
              { href: "/paiement", label: "Modes de paiement" },
              { href: "/devis", label: "Demander un devis" },
              { href: "/livraison", label: "Livraison & Délais" },
              { href: "/contact", label: "Nous contacter" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-vert-400 hover:text-or-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 4 — Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-or-400 mt-0.5 flex-shrink-0" />
              <span className="text-vert-400">Touba, Sénégal<br />Quartier Darou Khoudoss</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-or-400 flex-shrink-0" />
              <a href="tel:+221768001717" className="text-vert-400 hover:text-or-400 transition-colors">
                +221 76 800 17 17
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-or-400 flex-shrink-0" />
              <a href="https://wa.me/221768001717" className="text-vert-400 hover:text-or-400 transition-colors">
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-or-400 flex-shrink-0" />
              <a href="mailto:toubavisuel@gmail.com" className="text-vert-400 hover:text-or-400 transition-colors">
                toubavisuel@gmail.com
              </a>
            </li>
          </ul>

          {/* Paiements acceptés */}
          <div className="mt-5">
            <p className="text-white text-xs font-semibold mb-2">Paiements acceptés</p>
            <div className="flex flex-wrap gap-2">
              {["Visa/MC", "Wave", "Orange Money", "Livraison"].map((m) => (
                <span key={m} className="bg-vert-800 text-vert-300 text-xs px-2 py-1 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-vert-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-vert-600">
          <p>&copy; {new Date().getFullYear()} Agence Touba Visuel (ATV). Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-or-400 transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-or-400 transition-colors">Confidentialité</Link>
            <Link href="/cgv" className="hover:text-or-400 transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
