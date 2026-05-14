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
            <div className="w-11 h-11 bg-gray-950 border border-or-500/60 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <span className="text-or-400 font-black text-sm tracking-tight"
                style={{ textShadow: "0 0 8px #d4af37" }}>
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
            <a href="#" className="w-9 h-9 bg-vert-800 hover:bg-or-500 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Facebook size={16} className="text-white" />
            </a>
            <a href="#" className="w-9 h-9 bg-vert-800 hover:bg-or-500 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Instagram size={16} className="text-white" />
            </a>
            <a href="#" className="w-9 h-9 bg-vert-800 hover:bg-or-500 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Twitter size={16} className="text-white" />
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
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-vert-400 hover:text-or-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
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
              <a href="tel:+221778001717" className="text-vert-400 hover:text-or-400 transition-colors">
                +221 77 800 17 17
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-or-400 flex-shrink-0" />
              <a href="https://wa.me/221778001717" className="text-vert-400 hover:text-or-400 transition-colors">
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
