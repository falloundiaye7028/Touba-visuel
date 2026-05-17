"use client";

import { useState } from "react";

/* ── Templates de contenu ──────────────────────────────── */
const TEMPLATES: Record<string, Record<string, string[]>> = {
  Commerce: {
    Instagram: [
      "✨ {produit} de qualité exceptionnelle disponible maintenant chez {entreprise} !\n\nPrix imbattable 🔥 Livraison rapide 🚚\n\nContactez-nous pour commander 👇\n📱 WhatsApp : {contact}\n\n{hashtags}",
      "🛍️ Nouvelle arrivée chez {entreprise} !\n\n{produit} — {slogan}\n\n⚡ Stock limité — commandez vite !\n📞 {contact}\n\n{hashtags}",
      "💎 {entreprise} vous propose {produit} à un prix exceptionnel.\n\n✅ Qualité garantie\n✅ Livraison rapide\n✅ Service client disponible 7j/7\n\n👉 DM ou WhatsApp : {contact}\n\n{hashtags}",
    ],
    Facebook: [
      "🔥 OFFRE EXCEPTIONNELLE 🔥\n\n{entreprise} vous propose {produit} avec une qualité incomparable !\n\n💰 Prix : contactez-nous pour plus d'informations\n📦 Livraison disponible\n📱 WhatsApp : {contact}\n\nPartagez avec vos amis ! 👍\n\n{hashtags}",
      "Bonjour la communauté ! 👋\n\n{entreprise} est fier de vous présenter {produit}.\n{slogan}\n\nNous livrons partout au Sénégal 🇸🇳\nContactez-nous : {contact}\n\n{hashtags}",
    ],
    WhatsApp: [
      "🌟 *OFFRE SPÉCIALE — {entreprise}* 🌟\n\n{produit} disponible maintenant !\n\n{slogan}\n\n✅ Qualité premium\n✅ Prix compétitif\n✅ Livraison rapide\n\nPour commander 👉 {contact}",
      "Salam Alaikum 🌙\n\nNouveau chez *{entreprise}* :\n👉 {produit}\n\n{slogan}\n\nPlus d'infos → {contact}",
    ],
  },
  Restaurant: {
    Instagram: [
      "🍽️ Aujourd'hui chez {entreprise} : {produit} !\n\n{slogan}\n\n🕐 Ouvert tous les jours\n📍 Touba, Sénégal\n📱 Réservation : {contact}\n\n{hashtags}",
      "😋 Vous avez faim ? {entreprise} a la solution !\n\n✨ {produit} fraîchement préparé\n{slogan}\n\nLivraison disponible 🛵\n📞 {contact}\n\n{hashtags}",
    ],
    Facebook: [
      "🍴 Menu du jour chez {entreprise} ! 🍴\n\n👨‍🍳 {produit}\n{slogan}\n\n📍 Venez nous retrouver à Touba\n📱 Livraison : {contact}\n\nBon appétit ! 😊 {hashtags}",
    ],
    WhatsApp: [
      "🍽️ *Menu du jour — {entreprise}*\n\n{produit}\n\n{slogan}\n\n📱 Commande & livraison : {contact}",
    ],
  },
  Immobilier: {
    Instagram: [
      "🏠 {produit} disponible chez {entreprise} !\n\n{slogan}\n\n💰 Prix attractif · Financement disponible\n📱 Contactez-nous : {contact}\n\n{hashtags}",
      "🔑 Votre nouveau chez-vous vous attend !\n\n{entreprise} vous propose : {produit}\n{slogan}\n\n📞 {contact}\n\n{hashtags}",
    ],
    Facebook: [
      "🏡 NOUVELLE PROPRIÉTÉ — {entreprise}\n\n{produit}\n{slogan}\n\nVisite disponible sur rendez-vous\n📱 {contact}\n\nPartagez si vous connaissez quelqu'un intéressé ! 🙏 {hashtags}",
    ],
    WhatsApp: [
      "🏠 *Bonne opportunité immobilière !*\n\n{entreprise} propose : {produit}\n{slogan}\n\nContactez-nous pour visiter 👉 {contact}",
    ],
  },
  Formation: {
    Instagram: [
      "📚 Nouvelle formation chez {entreprise} !\n\n✨ {produit}\n{slogan}\n\n🎓 Certifiez-vous · Progressez · Réussissez\n📱 Inscriptions : {contact}\n\n{hashtags}",
      "🚀 Boostez votre carrière avec {entreprise} !\n\n💡 {produit}\n{slogan}\n\nPlaces limitées — Inscrivez-vous vite !\n📞 {contact}\n\n{hashtags}",
    ],
    Facebook: [
      "🎓 FORMATION PROFESSIONNELLE — {entreprise}\n\n{produit}\n{slogan}\n\n✅ Formateurs expérimentés\n✅ Attestation de formation\n✅ Pratique garantie\n\nInscriptions ouvertes → {contact} {hashtags}",
    ],
    WhatsApp: [
      "📚 *Formation disponible — {entreprise}*\n\n{produit}\n{slogan}\n\n🎓 Démarrez votre apprentissage maintenant\n👉 {contact}",
    ],
  },
  Santé: {
    Instagram: [
      "💊 Votre santé, notre priorité chez {entreprise} !\n\n{produit}\n{slogan}\n\n🌿 Produits naturels · Conseils professionnels\n📱 {contact}\n\n{hashtags}",
    ],
    Facebook: [
      "🌿 {entreprise} prend soin de vous !\n\n{produit}\n{slogan}\n\nConsultez nos experts en santé\n📞 {contact}\n\n{hashtags}",
    ],
    WhatsApp: [
      "💚 *Votre santé d'abord — {entreprise}*\n\n{produit}\n{slogan}\n\n🌿 Conseils gratuits disponibles\n👉 {contact}",
    ],
  },
};

const HASHTAGS: Record<string, string[]> = {
  Commerce: ["#Sénégal", "#Touba", "#Commerce", "#Shopping", "#BusinessSN", "#MadeinSenegal", "#Qualité"],
  Restaurant: ["#Restaurant", "#Cuisine", "#Touba", "#FoodSenegal", "#Sénégal", "#Délicieux", "#Manger"],
  Immobilier: ["#Immobilier", "#Maison", "#Sénégal", "#Touba", "#LogementSN", "#Investissement", "#ImmobilierSN"],
  Formation: ["#Formation", "#Sénégal", "#Apprentissage", "#Compétences", "#CarrièreSN", "#Touba", "#Education"],
  Santé: ["#Santé", "#Bien-être", "#Sénégal", "#Touba", "#SantéNaturelle", "#Médecine", "#VivreEnSanté"],
};

function generer(
  secteur: string,
  plateforme: string,
  entreprise: string,
  produit: string,
  slogan: string,
  contact: string
): string {
  const templates = TEMPLATES[secteur]?.[plateforme];
  if (!templates || templates.length === 0) return "Aucun template disponible pour cette combinaison.";

  const template = templates[Math.floor(Math.random() * templates.length)];
  const tags = HASHTAGS[secteur] || [];
  const hashtags = tags.slice(0, 5).map((t) => t).join(" ");

  return template
    .replace(/{entreprise}/g, entreprise || "Votre Entreprise")
    .replace(/{produit}/g, produit || "Votre Produit/Service")
    .replace(/{slogan}/g, slogan || "La qualité au meilleur prix !")
    .replace(/{contact}/g, contact || "+221 76 800 17 17")
    .replace(/{hashtags}/g, hashtags);
}

export default function GenerateurIAPage() {
  const [secteur, setSecteur] = useState("Commerce");
  const [plateforme, setPlateforme] = useState("Instagram");
  const [entreprise, setEntreprise] = useState("");
  const [produit, setProduit] = useState("");
  const [slogan, setSlogan] = useState("");
  const [contact, setContact] = useState("");
  const [contenu, setContenu] = useState("");
  const [copie, setCopie] = useState(false);
  const [genCount, setGenCount] = useState(0);

  function handleGenerer() {
    const result = generer(secteur, plateforme, entreprise, produit, slogan, contact);
    setContenu(result);
    setGenCount((n) => n + 1);
  }

  function handleCopier() {
    navigator.clipboard.writeText(contenu);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  function handlePartager() {
    const msg = `Voici mon post généré par l'IA Touba Visuel :\n\n${contenu}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const SECTEURS = Object.keys(TEMPLATES);
  const PLATEFORMES = Object.keys(TEMPLATES[secteur] || {});

  return (
    <main
      className="min-h-screen px-4 py-16"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 60%), #030712",
      }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{
              background: "rgba(168,85,247,0.1)",
              borderColor: "rgba(168,85,247,0.3)",
              color: "#c084fc",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Générateur IA — Touba Visuel
          </div>

          <h1 className="text-white text-4xl md:text-5xl font-black mb-4">
            Créez vos posts{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #ffc800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              en 1 clic
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Notre IA génère du contenu marketing professionnel et adapté à votre business en quelques secondes — en Français, prêt à publier.
          </p>

          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount} post{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""} dans cette session
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Formulaire */}
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <h2 className="text-white font-bold text-xl mb-6">Paramètres</h2>

            <div className="space-y-5">

              {/* Secteur */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Secteur d&apos;activité</label>
                <div className="grid grid-cols-2 gap-2">
                  {SECTEURS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSecteur(s); setPlateforme(Object.keys(TEMPLATES[s])[0]); }}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: secteur === s ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)",
                        borderWidth: 1,
                        borderColor: secteur === s ? "#a855f7" : "rgba(255,255,255,0.08)",
                        color: secteur === s ? "#c084fc" : "#9ca3af",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plateforme */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Réseau social cible</label>
                <div className="flex gap-2">
                  {PLATEFORMES.map((p) => {
                    const emoji = p === "Instagram" ? "📸" : p === "Facebook" ? "👥" : "💬";
                    return (
                      <button
                        key={p}
                        onClick={() => setPlateforme(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: plateforme === p ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)",
                          borderWidth: 1,
                          borderColor: plateforme === p ? "#a855f7" : "rgba(255,255,255,0.08)",
                          color: plateforme === p ? "#c084fc" : "#9ca3af",
                        }}
                      >
                        {emoji} {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Entreprise */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Nom de votre entreprise *</label>
                <input
                  value={entreprise}
                  onChange={(e) => setEntreprise(e.target.value)}
                  placeholder="Ex: Boutique Aminata"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors border"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              </div>

              {/* Produit */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Produit / Service à promouvoir *</label>
                <input
                  value={produit}
                  onChange={(e) => setProduit(e.target.value)}
                  placeholder="Ex: Robes traditionnelles bazin"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors border"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Slogan ou accroche (optionnel)</label>
                <input
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ex: La qualité au meilleur prix !"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors border"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-white/60 text-sm font-semibold block mb-2">Votre numéro WhatsApp</label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+221 76 000 00 00"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors border"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              </div>

              <button
                onClick={handleGenerer}
                disabled={!entreprise || !produit}
                className="w-full py-4 rounded-2xl font-black text-gray-900 text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
              >
                🤖 Générer mon post IA
              </button>

              {(!entreprise || !produit) && (
                <p className="text-center text-yellow-500/60 text-xs">
                  * Remplissez le nom de l&apos;entreprise et le produit
                </p>
              )}
            </div>
          </div>

          {/* Résultat */}
          <div className="flex flex-col gap-5">
            <div
              className="rounded-3xl p-8 border min-h-[300px] flex flex-col"
              style={{
                background: contenu
                  ? "rgba(168,85,247,0.05)"
                  : "rgba(255,255,255,0.02)",
                borderColor: contenu
                  ? "rgba(168,85,247,0.3)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              {contenu ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                        Post IA généré · {plateforme}
                      </span>
                    </div>
                    <button
                      onClick={handleGenerer}
                      className="text-xs text-gray-500 hover:text-purple-400 transition-colors font-medium"
                    >
                      ↻ Regénérer
                    </button>
                  </div>

                  <div className="flex-1 text-gray-200 text-sm leading-relaxed whitespace-pre-line bg-black/20 rounded-2xl p-4 mb-4 border border-white/5">
                    {contenu}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCopier}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                      style={{
                        background: copie ? "#22c55e20" : "rgba(255,255,255,0.08)",
                        borderWidth: 1,
                        borderColor: copie ? "#22c55e60" : "rgba(255,255,255,0.1)",
                        color: copie ? "#22c55e" : "white",
                      }}
                    >
                      {copie ? "✓ Copié !" : "📋 Copier"}
                    </button>
                    <button
                      onClick={handlePartager}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        borderWidth: 1,
                        borderColor: "rgba(34,197,94,0.3)",
                        color: "#22c55e",
                      }}
                    >
                      📱 Partager WhatsApp
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4 opacity-30">🤖</div>
                  <p className="text-gray-600 text-sm">
                    Remplissez le formulaire et cliquez sur <br />
                    <strong className="text-purple-400">Générer mon post IA</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Info pro */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,200,0,0.05)", borderColor: "rgba(255,200,0,0.2)" }}
            >
              <p className="text-yellow-400 font-bold text-sm mb-2">🚀 Passez à l&apos;automatisation complète</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Avec nos packs Marketing IA, on génère et publie vos posts automatiquement — sans que vous ayez à intervenir.
              </p>
              <a
                href="/services-ia"
                className="inline-flex items-center gap-1 text-yellow-400 font-bold text-xs hover:underline"
              >
                Voir les packs IA →
              </a>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { emoji: "⚡", titre: "Rapide", desc: "Un post professionnel en moins de 5 secondes" },
            { emoji: "🎯", titre: "Ciblé", desc: "Adapté à votre secteur et votre audience sénégalaise" },
            { emoji: "🔄", titre: "Illimité", desc: "Regénérez autant de fois que vous voulez" },
          ].map((t) => (
            <div
              key={t.titre}
              className="rounded-2xl p-5 border text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-3xl mb-2">{t.emoji}</div>
              <h3 className="text-white font-bold text-sm mb-1">{t.titre}</h3>
              <p className="text-gray-500 text-xs">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
