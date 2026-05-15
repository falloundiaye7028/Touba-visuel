import Image from "next/image";
import Link from "next/link";

const CLIENTS = [
  { nom: "Orange Money", emoji: "🟠", couleur: "#FF6600" },
  { nom: "MASAE", emoji: "🌿", couleur: "#2d7a2d" },
  { nom: "FAO", emoji: "🌾", couleur: "#4a9e4a" },
  { nom: "Ville de Touba", emoji: "🏛️", couleur: "#1a5276" },
  { nom: "Baraka Immo", emoji: "🏠", couleur: "#e67e22" },
  { nom: "Orange Sénégal", emoji: "🟧", couleur: "#FF6600" },
  { nom: "Agences & PME", emoji: "💼", couleur: "#07402b" },
];

export default function LogosClients() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Partenaires Officiels du Mois */}
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-vert-600 mb-6">
            Partenaires officiels du mois · Mai 2026
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">

            {/* Touba Ca Kanam + bouton Wave */}
            <div className="flex flex-col items-center gap-3">
              <Link href="https://web.facebook.com/toubacakanam/" target="_blank" rel="noopener noreferrer"
                className="relative flex items-center gap-5 bg-white border-2 rounded-3xl px-8 py-5 shadow-lg hover:shadow-xl transition-shadow"
                style={{ borderColor: "#c8a200" }}>
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                  Mai 2026
                </div>
                <div className="absolute -left-3 -top-3 text-yellow-400 text-xl">★</div>
                <Image
                  src="/images/touba-ca-kanam-logo.png"
                  alt="Touba Ca Kanam"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <div>
                  <p className="font-black text-gray-900 text-lg leading-tight">Touba Ca Kanam</p>
                  <p className="text-sm font-semibold" style={{ color: "#c8a200" }}>Nɔroud Daraïni</p>
                  <p className="text-xs text-gray-500 mt-1">Partenaire officiel ATV · Mai 2026</p>
                  <p className="text-xs text-blue-500 font-semibold mt-1">Voir sur Facebook →</p>
                </div>
              </Link>
              {/* Boutons barkeelu */}
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="https://pay.wave.com/m/M_sn_UMbi7rZ15Cq6/c/sn/?amount=1000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center px-5 py-3 rounded-2xl font-black text-white text-sm shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #1bb6e6, #0e8fc1)" }}
                >
                  <Image src="/images/wave.png" alt="Wave" width={22} height={22} className="object-contain rounded" />
                  Barkeelu via Wave
                </a>
                <a
                  href="https://sugu.orange-sonatel.com/mp/410818/Touba%20Ca%20Kanam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center px-5 py-3 rounded-2xl font-black text-white text-sm shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #FF6600, #e65c00)" }}
                >
                  <Image src="/images/orange-money-logo.png" alt="Orange Money" width={22} height={22} className="object-contain rounded" />
                  Barkeelu via Orange Money
                </a>
              </div>
            </div>

            {/* Touba Techno Plus */}
            <Link href="https://web.facebook.com/ToubaTechnoPlus.ttp." target="_blank" rel="noopener noreferrer"
              className="relative flex items-center gap-5 bg-white border-2 rounded-3xl px-8 py-5 shadow-lg hover:shadow-xl transition-shadow"
              style={{ borderColor: "#3b82f6" }}>
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                Mai 2026
              </div>
              <div className="absolute -left-3 -top-3 text-blue-400 text-xl">★</div>
              <Image
                src="/images/ttp.jpg"
                alt="Touba Techno Plus"
                width={80}
                height={80}
                className="object-contain rounded-xl"
              />
              <div>
                <p className="font-black text-gray-900 text-lg leading-tight">Touba Techno Plus</p>
                <p className="text-sm font-semibold text-blue-600">Informatique · Électronique</p>
                <p className="text-xs text-gray-500 mt-1">Partenaire officiel ATV · Mai 2026</p>
                <p className="text-xs text-blue-500 font-semibold mt-1">Voir sur Facebook →</p>
              </div>
            </Link>

          </div>
        </div>

        <p className="text-center text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">
          Ils nous font confiance
        </p>

        {/* Défilement infini */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #f9fafb, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, #f9fafb, transparent)" }} />

          <div className="flex gap-8 animate-marquee" style={{ width: "max-content" }}>
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <div key={i}
                className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 hover:shadow-md transition-shadow">
                <span className="text-3xl">{c.emoji}</span>
                <div>
                  <p className="font-black text-sm text-gray-900 whitespace-nowrap">{c.nom}</p>
                  <p className="text-xs font-medium" style={{ color: c.couleur }}>Client ATV</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
