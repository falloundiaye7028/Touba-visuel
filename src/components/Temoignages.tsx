"use client";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const TEMOIGNAGES = [
  {
    id: 1,
    message:
      "Nous souhaitons à nouveau vous remercier pour votre professionnalisme et votre accompagnement lors de cette animation Magal. Nous sommes très satisfaits de la collaboration et serions ravis de travailler avec vous sur d'autres campagnes à fort impact. N'hésitez pas à nous faire part de vos idées pour renforcer notre présence sur le terrain, accroître la visibilité de notre marque, et surtout développer la préférence pour Orange Money à Touba en faisant du service, le Kalpé incontournable. Meuna Nekk… !",
    auteur: "Adjaratou Mbissine KANE",
    poste: "Responsable Marketing Digital & Communication",
    entreprise: "Orange Money Sénégal",
    logo: "🟠",
    couleur: "#FF6600",
    fond: "rgba(255,102,0,0.08)",
    bordure: "rgba(255,102,0,0.25)",
    campagne: "Campagne Zénith Touba — Décembre 2025",
  },
  {
    id: 2,
    message:
      "Je me joins à l'équipe pour vous adresser nos remerciements et nos félicitations pour le travail accompli durant le Magal en peu de temps. Votre apport a été déterminant et l'impact s'est ressenti. En attendant le bilan, nous sommes déjà rassurés qu'ensemble on pourra relever le défi de repositionner OM dans le cœur des populations et des fidèles dans la sainte ville. Après le bilan, cap sur les next step avec plus d'ambitions et d'impacts, à vos propositions ! Djeuredieuf !!",
    auteur: "ElHadji Cheikh GAYE",
    poste: "SNT OFMS / DBV",
    entreprise: "Orange Money Sénégal",
    logo: "🟠",
    couleur: "#FF6600",
    fond: "rgba(255,102,0,0.08)",
    bordure: "rgba(255,102,0,0.25)",
    campagne: "Campagne Magal Touba — Août 2025",
  },
];

export default function Temoignages() {
  const [idx, setIdx] = useState(0);
  const t = TEMOIGNAGES[idx];
  const prev = () => setIdx((i) => (i - 1 + TEMOIGNAGES.length) % TEMOIGNAGES.length);
  const next = () => setIdx((i) => (i + 1) % TEMOIGNAGES.length);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Fond déco */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(255,102,0,0.05)" }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(10,99,66,0.05)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">

        {/* Label */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] mb-3 text-vert-600">
            Ils nous font confiance
          </p>
          <h2 className="section-title mb-2">Ce que nos clients disent</h2>
          <p className="section-subtitle">Partenariats, campagnes et résultats qui parlent</p>
        </div>

        {/* Carte témoignage */}
        <div className="relative rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden"
          style={{ background: t.fond, border: `1.5px solid ${t.bordure}` }}>

          {/* Logo en filigrane */}
          <div className="absolute top-6 right-8 text-6xl opacity-20 select-none">{t.logo}</div>

          {/* Guillemets */}
          <Quote size={40} className="mb-6 opacity-40" style={{ color: t.couleur }} />

          {/* Message */}
          <blockquote className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium mb-8 relative z-10">
            &ldquo;{t.message}&rdquo;
          </blockquote>

          {/* Badge campagne */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: `${t.couleur}20`, color: t.couleur, border: `1px solid ${t.couleur}40` }}>
            📸 {t.campagne}
          </div>

          {/* Auteur */}
          <div className="flex items-center gap-4 pt-6"
            style={{ borderTop: `1px solid ${t.bordure}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${t.couleur}, #ff9933)` }}>
              {t.auteur.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900 text-base">{t.auteur}</p>
              <p className="text-sm font-semibold" style={{ color: t.couleur }}>{t.poste}</p>
              <p className="text-gray-500 text-xs mt-0.5 font-medium">{t.entreprise}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl"
              style={{ background: `${t.couleur}15`, border: `1px solid ${t.couleur}30` }}>
              <span className="text-xl">🟠</span>
              <div>
                <p className="text-xs font-black" style={{ color: t.couleur }}>Orange</p>
                <p className="text-xs font-black text-gray-700">Money</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation carousel */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button onClick={prev}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(255,102,0,0.3)" }}>
            <ChevronLeft size={18} style={{ color: "#FF6600" }} />
          </button>
          <div className="flex gap-2">
            {TEMOIGNAGES.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i === idx ? "#FF6600" : "rgba(255,102,0,0.25)" }} />
            ))}
          </div>
          <button onClick={next}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-gray-50"
            style={{ borderColor: "rgba(255,102,0,0.3)" }}>
            <ChevronRight size={18} style={{ color: "#FF6600" }} />
          </button>
        </div>

        {/* Compteur */}
        <p className="text-center text-xs text-gray-400 mt-2 font-medium">
          {idx + 1} / {TEMOIGNAGES.length}
        </p>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Rejoignez nos clients satisfaits — entreprises, institutions et grandes marques
          </p>
          <a
            href="https://wa.me/221778001717?text=Bonjour%20ATV%2C%20je%20souhaite%20discuter%20d%27une%20campagne%20de%20communication."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg text-sm"
            style={{ background: "linear-gradient(135deg, #0a6342, #1d9c68)" }}
          >
            📱 Démarrer une collaboration
          </a>
        </div>
      </div>
    </section>
  );
}
