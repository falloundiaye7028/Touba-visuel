"use client";

import { useState, useCallback } from "react";

/* ── Types ─────────────────────────────────── */
interface Style {
  id: string;
  label: string;
  emoji: string;
  suffix: string;
}

interface Format {
  id: string;
  label: string;
  w: number;
  h: number;
  icon: string;
}

interface Template {
  label: string;
  prompt: string;
  categorie: string;
}

/* ── Styles artistiques ─────────────────────── */
const STYLES: Style[] = [
  { id: "pro", label: "Professionnel", emoji: "💼", suffix: "professional marketing photo, studio quality, sharp, vibrant colors, 4k" },
  { id: "luxe", label: "Luxe", emoji: "✨", suffix: "luxury brand photography, elegant, gold accents, premium quality, minimalist, high fashion" },
  { id: "africain", label: "Style Africain", emoji: "🌍", suffix: "African aesthetic, vibrant kente colors, traditional patterns, bold and beautiful, Senegalese style" },
  { id: "moderne", label: "Moderne", emoji: "🎨", suffix: "modern graphic design, bold typography, geometric shapes, gradient colors, trendy 2025" },
  { id: "realiste", label: "Ultra Réaliste", emoji: "📷", suffix: "hyperrealistic, photorealistic, DSLR photo, perfect lighting, 8k resolution, award winning photography" },
  { id: "anime", label: "Illustré", emoji: "🖌️", suffix: "digital illustration, flat design, colorful, clean lines, professional vector art style" },
];

/* ── Formats ────────────────────────────────── */
const FORMATS: Format[] = [
  { id: "carre", label: "Carré", w: 1024, h: 1024, icon: "⬛" },
  { id: "story", label: "Story / Reel", w: 768, h: 1360, icon: "📱" },
  { id: "paysage", label: "Bannière web", w: 1360, h: 768, icon: "🖥️" },
  { id: "portrait", label: "Portrait", w: 832, h: 1216, icon: "🖼️" },
];

/* ── Templates marketing ────────────────────── */
const TEMPLATES: Template[] = [
  { label: "Produit boutique", categorie: "Commerce", prompt: "Beautiful product display in a luxury boutique, elegant shelves, warm lighting, premium packaging, professional marketing photography" },
  { label: "Nourriture appétissante", categorie: "Restaurant", prompt: "Delicious Senegalese cuisine, thiéboudienne or yassa, steam rising, colorful vegetables, restaurant table setting, food photography" },
  { label: "Promotion vente", categorie: "Promo", prompt: "Sale promotion banner, bold discount text, shopping bags, confetti, vibrant red and gold colors, excitement" },
  { label: "Maison / Immobilier", categorie: "Immobilier", prompt: "Beautiful modern house exterior, Senegalese architecture, palm trees, blue sky, real estate photography, luxury villa" },
  { label: "Mode & Vêtements", categorie: "Mode", prompt: "African fashion model wearing colorful traditional clothing, bazin riche fabric, elegant pose, professional fashion photography, Dakar" },
  { label: "Cosmétiques & Beauté", categorie: "Beauté", prompt: "Beauty products flatlay, skincare cream, perfume bottle, flowers, marble background, luxury cosmetics photography" },
  { label: "Transport / Taxi", categorie: "Services", prompt: "Modern clean taxi or transport vehicle, professional driver, city background Dakar, blue sky, business transportation" },
  { label: "Événement / Fête", categorie: "Événement", prompt: "Celebration event decoration, colorful balloons, elegant table setting, festive atmosphere, party venue" },
  { label: "Formation / Éducation", categorie: "Formation", prompt: "Students learning in modern classroom, tablets and books, bright professional space, diverse African students, success and education" },
  { label: "Mosquée & Spirituel", categorie: "Spirituel", prompt: "Beautiful mosque architecture at golden hour, Touba style mosque, minaret, spiritual peaceful atmosphere, warm sunset light" },
  { label: "Tech & Informatique", categorie: "Tech", prompt: "Modern technology setup, laptop, smartphone, coding, digital innovation, blue neon lighting, professional workspace" },
  { label: "Pharmacie & Santé", categorie: "Santé", prompt: "Clean modern pharmacy interior, medicine bottles, health products, white and green colors, professional medical photography" },
];

/* ── Helpers ────────────────────────────────── */
function buildPrompt(description: string, style: Style, businessName: string): string {
  let p = description.trim();
  if (businessName.trim()) {
    p += `, for ${businessName.trim()} brand`;
  }
  p += `, ${style.suffix}`;
  return p;
}

function buildUrl(prompt: string, format: Format, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${format.w}&height=${format.h}&seed=${seed}&nologo=true&enhance=true`;
}

/* ── Page principale ────────────────────────── */
export default function GenerateurVisuelsPage() {
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [styleId, setStyleId] = useState("pro");
  const [formatId, setFormatId] = useState("carre");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seed, setSeed] = useState(42);
  const [genCount, setGenCount] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const style = STYLES.find((s) => s.id === styleId) || STYLES[0];
  const format = FORMATS.find((f) => f.id === formatId) || FORMATS[0];

  const generer = useCallback(async (promptOverride?: string) => {
    const desc = promptOverride ?? description;
    if (!desc.trim()) return;

    setLoading(true);
    setError("");
    const newSeed = Math.floor(Math.random() * 99999);
    setSeed(newSeed);

    const prompt = buildPrompt(desc, style, businessName);
    const url = buildUrl(prompt, format, newSeed);

    // On précharge l'image dans un objet Image pour détecter la fin du chargement
    const img = new Image();
    img.onload = () => {
      setImageUrl(url);
      setLoading(false);
      setGenCount((n) => n + 1);
    };
    img.onerror = () => {
      setError("Erreur de génération. Réessayez avec une autre description.");
      setLoading(false);
    };
    img.src = url;
  }, [description, style, format, businessName]);

  function regenerer() {
    if (description.trim()) generer();
  }

  function appliquerTemplate(t: Template) {
    setDescription(t.prompt);
    setActiveTemplate(t.label);
    setImageUrl("");
  }

  async function telecharger() {
    if (!imageUrl) return;
    try {
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `touba-visuel-ia-${Date.now()}.png`;
      a.click();
    } catch {
      window.open(imageUrl, "_blank");
    }
  }

  function partager() {
    if (!imageUrl) return;
    const text = `✨ Visuel créé par l'IA Touba Visuel !\n\nGénérez vos propres visuels marketing gratuitement :\n👉 touba-visuel.vercel.app/generateur-visuels`;
    if (navigator.share) {
      navigator.share({ title: "Visuel IA Touba Visuel", text });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  }

  const aspectStyle =
    format.id === "story" ? { aspectRatio: "9/16" } :
    format.id === "paysage" ? { aspectRatio: "16/9" } :
    format.id === "portrait" ? { aspectRatio: "2/3" } :
    { aspectRatio: "1/1" };

  const categories = [...new Set(TEMPLATES.map((t) => t.categorie))];

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%), #030712",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HERO ─────────────────────────────── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{
              background: "rgba(99,102,241,0.12)",
              borderColor: "rgba(99,102,241,0.35)",
              color: "#a5b4fc",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Générateur de visuels IA · Touba Visuel
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight">
            Créez vos visuels{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7, #ffc800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              marketing en 1 clic
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
            Décrivez votre visuel, choisissez votre style — notre IA génère une image professionnelle en quelques secondes.
            <strong className="text-white"> Comme ChatGPT Images, mais pour votre marketing.</strong>
          </p>

          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount} visuel{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""} dans cette session
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── PANNEAU GAUCHE (contrôles) ──────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Nom business */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-2">
                Votre entreprise (optionnel)
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Boutique Aminata, Restaurant Chez Fatou..."
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none border border-white/8 bg-white/4 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-2">
                Décrivez votre visuel *
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setActiveTemplate(null); }}
                placeholder="Ex: Une belle robe bazin rouge sur fond blanc, éclairage studio professionnel, pour une boutique de mode sénégalaise..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none border border-white/8 bg-white/4 focus:border-indigo-500 transition-colors resize-none"
              />
              <p className="text-white/20 text-xs mt-1 text-right">{description.length} caractères</p>
            </div>

            {/* Styles */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">
                Style de rendu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyleId(s.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: styleId === s.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                      borderWidth: 1,
                      borderColor: styleId === s.id ? "#6366f1" : "rgba(255,255,255,0.06)",
                      color: styleId === s.id ? "#a5b4fc" : "#9ca3af",
                    }}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formats */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">
                Format de l&apos;image
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormatId(f.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: formatId === f.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                      borderWidth: 1,
                      borderColor: formatId === f.id ? "#6366f1" : "rgba(255,255,255,0.06)",
                      color: formatId === f.id ? "#a5b4fc" : "#9ca3af",
                    }}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton générer */}
            <button
              onClick={() => generer()}
              disabled={!description.trim() || loading}
              className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 40px rgba(99,102,241,0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  L&apos;IA génère votre image...
                </span>
              ) : (
                "✨ Générer le visuel IA"
              )}
            </button>

            {!description.trim() && (
              <p className="text-center text-yellow-500/50 text-xs">
                Décrivez votre visuel ou choisissez un template ci-dessous
              </p>
            )}
          </div>

          {/* ── PANNEAU DROIT (aperçu) ──────────── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Zone image */}
            <div
              className="rounded-3xl overflow-hidden border relative"
              style={{
                ...aspectStyle,
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.08)",
                maxWidth: "100%",
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                  </div>
                  <p className="text-white font-bold text-sm mb-1">L&apos;IA crée votre visuel...</p>
                  <p className="text-gray-400 text-xs">Environ 5 à 15 secondes</p>
                </div>
              )}

              {imageUrl && !loading ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Visuel généré par IA"
                  className="w-full h-full object-cover"
                />
              ) : !loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl mb-4 opacity-20">🎨</div>
                  <p className="text-gray-600 text-sm max-w-xs">
                    Votre visuel IA apparaîtra ici.<br />
                    Décrivez-le ou choisissez un template, puis cliquez sur{" "}
                    <span className="text-indigo-400 font-bold">Générer</span>.
                  </p>
                </div>
              ) : null}

              {/* Watermark */}
              {imageUrl && !loading && (
                <div
                  className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white/60"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                >
                  IA · Touba Visuel
                </div>
              )}
            </div>

            {/* Actions */}
            {imageUrl && !loading && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={regenerer}
                  className="py-3 rounded-xl font-bold text-sm border border-white/10 bg-white/4 text-gray-300 hover:bg-white/8 transition-all flex items-center justify-center gap-2"
                >
                  <span>↻</span> Regénérer
                </button>
                <button
                  onClick={telecharger}
                  className="py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                  ⬇ Télécharger
                </button>
                <button
                  onClick={partager}
                  className="py-3 rounded-xl font-bold text-sm border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
                >
                  📱 Partager
                </button>
              </div>
            )}

            {/* Info seed */}
            {imageUrl && !loading && (
              <div
                className="rounded-xl px-4 py-3 border text-xs text-gray-500 flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
              >
                <span>Seed #{seed} · Style: {style.label} · Format: {format.label} ({format.w}×{format.h}px)</span>
                <button
                  onClick={regenerer}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-2 flex-shrink-0"
                >
                  Nouveau seed →
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* CTA impression */}
            {imageUrl && !loading && (
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "rgba(255,200,0,0.05)", borderColor: "rgba(255,200,0,0.2)" }}
              >
                <p className="text-yellow-400 font-bold text-sm mb-1">🖨️ Imprimer ce visuel avec ATV ?</p>
                <p className="text-gray-400 text-xs mb-3">
                  Flyers, kakémonos, banderoles, t-shirts — on imprime votre visuel IA en qualité HD.
                </p>
                <a
                  href={`https://wa.me/221768001717?text=Je veux imprimer ce visuel généré par votre IA. Je vous envoie l'image.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-gray-900 hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
                >
                  Commander l&apos;impression sur WhatsApp →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── TEMPLATES ────────────────────────── */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-black mb-2">
              Templates marketing prêts à l&apos;emploi
            </h2>
            <p className="text-gray-500 text-sm">
              Choisissez un template, personnalisez si besoin, et générez en 1 clic.
            </p>
          </div>

          {categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">{cat}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {TEMPLATES.filter((t) => t.categorie === cat).map((t) => (
                  <button
                    key={t.label}
                    onClick={() => appliquerTemplate(t)}
                    className="text-left px-4 py-3 rounded-2xl border transition-all hover:scale-[1.02]"
                    style={{
                      background: activeTemplate === t.label
                        ? "rgba(99,102,241,0.15)"
                        : "rgba(255,255,255,0.02)",
                      borderColor: activeTemplate === t.label
                        ? "rgba(99,102,241,0.5)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="font-bold text-white text-sm">{t.label}</p>
                    <p
                      className="text-xs mt-0.5 line-clamp-2"
                      style={{ color: activeTemplate === t.label ? "#a5b4fc" : "#6b7280" }}
                    >
                      {t.prompt.slice(0, 60)}...
                    </p>
                    {activeTemplate === t.label && (
                      <span className="inline-block mt-1 text-xs text-indigo-400 font-bold">✓ Sélectionné</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── EXEMPLES D'UTILISATION ───────────── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { emoji: "📸", titre: "Post Instagram", desc: "Générez des visuels parfaits pour vos posts Instagram — carré 1080×1080, couleurs vibrantes." },
            { emoji: "📱", titre: "Stories & Reels", desc: "Format vertical 9/16 prêt pour Stories Instagram, Facebook et TikTok." },
            { emoji: "🖨️", titre: "À imprimer", desc: "Visuels HD haute résolution — parfaits pour flyers, affiches, kakémonos, t-shirts." },
          ].map((item) => (
            <div
              key={item.titre}
              className="rounded-2xl p-6 border text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-white font-bold text-base mb-2">{item.titre}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── PACK PRO ─────────────────────────── */}
        <div
          className="mt-12 rounded-3xl p-8 border text-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))",
            borderColor: "rgba(99,102,241,0.25)",
          }}
        >
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Passer au niveau supérieur</p>
          <h3 className="text-white text-2xl font-black mb-3">
            Voulez-vous 30 visuels pro par mois, automatiquement ?
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Avec nos packs Marketing IA, notre équipe génère et publie vos visuels automatiquement — vous ne faites rien.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/services-ia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              🤖 Voir les packs IA
            </a>
            <a
              href="https://wa.me/221768001717?text=Je veux un pack IA pour la création de visuels automatiques"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-300 text-sm border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all"
            >
              📱 WhatsApp : 76 800 17 17
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
