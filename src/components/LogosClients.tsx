import Image from "next/image";

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

        {/* Partenaire Officiel du Mois */}
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-vert-600 mb-4">
            Partenaire officiel du mois
          </p>
          <div className="relative flex items-center gap-5 bg-white border-2 rounded-3xl px-8 py-5 shadow-lg"
            style={{ borderColor: "#c8a200" }}>
            {/* Badge doré */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">
              Mai 2026
            </div>
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
            </div>
            {/* Étoiles déco */}
            <div className="absolute -left-3 -top-3 text-yellow-400 text-xl">★</div>
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
