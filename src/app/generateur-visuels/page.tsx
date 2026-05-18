"use client";

import { useState } from "react";

/* ── Types ─────────────────────────────────── */
interface Style { id: string; label: string; emoji: string; suffix: string }
interface Format { id: string; label: string; w: number; h: number; icon: string }
interface Template { label: string; prompt: string; categorie: string }

/* ── Styles ─────────────────────────────────── */
const STYLES: Style[] = [
  { id: "pro",      label: "Professionnel",  emoji: "💼", suffix: "professional marketing photo, studio quality, sharp, vibrant colors, 4k" },
  { id: "luxe",     label: "Luxe",           emoji: "✨", suffix: "luxury brand photography, elegant, gold accents, premium quality, minimalist" },
  { id: "africain", label: "Style Africain", emoji: "🌍", suffix: "African aesthetic, vibrant kente colors, traditional patterns, Senegalese style, bold" },
  { id: "moderne",  label: "Moderne",        emoji: "🎨", suffix: "modern graphic design, bold typography, geometric shapes, gradient colors, trendy" },
  { id: "realiste", label: "Ultra Réaliste", emoji: "📷", suffix: "hyperrealistic, photorealistic, DSLR photo, perfect lighting, 8k resolution" },
  { id: "illustre", label: "Illustré",       emoji: "🖌️", suffix: "digital illustration, flat design, colorful, clean lines, professional vector art" },
];

/* ── Formats ────────────────────────────────── */
const FORMATS: Format[] = [
  { id: "carre",    label: "Carré (Instagram)", w: 1024, h: 1024, icon: "⬛" },
  { id: "story",    label: "Story / Reel",      w: 576,  h: 1024, icon: "📱" },
  { id: "paysage",  label: "Bannière web",      w: 1024, h: 576,  icon: "🖥️" },
  { id: "portrait", label: "Portrait",          w: 768,  h: 1024, icon: "🖼️" },
];

/* ── Templates ──────────────────────────────── */
const TEMPLATES: Template[] = [
  { label: "Produit boutique",      categorie: "Commerce",   prompt: "Beautiful product display in a luxury boutique, elegant shelves, warm lighting, premium packaging, professional marketing photography" },
  { label: "Nourriture sénégalaise",categorie: "Restaurant", prompt: "Delicious Senegalese cuisine thieboudienne, steam rising, colorful vegetables, restaurant table setting, food photography, appetizing" },
  { label: "Promotion / Soldes",    categorie: "Commerce",   prompt: "Sale promotion banner, shopping bags, confetti, vibrant red and gold colors, excitement, discount" },
  { label: "Maison / Immobilier",   categorie: "Immobilier", prompt: "Beautiful modern house exterior, Senegalese architecture, palm trees, blue sky, real estate photography, luxury villa" },
  { label: "Mode africaine",        categorie: "Mode",       prompt: "African fashion model wearing colorful traditional bazin riche clothing, elegant pose, professional fashion photography, Dakar" },
  { label: "Cosmétiques & Beauté",  categorie: "Beauté",     prompt: "Beauty products flatlay, skincare cream, perfume bottle, flowers, marble background, luxury cosmetics photography" },
  { label: "Mosquée de Touba",      categorie: "Spirituel",  prompt: "Beautiful Grande Mosquée de Touba architecture at golden hour, minaret, spiritual peaceful atmosphere, warm sunset light, Senegal" },
  { label: "Événement / Fête",      categorie: "Événement",  prompt: "Celebration event decoration, colorful balloons, elegant table setting, festive atmosphere, party venue, beautiful" },
  { label: "Formation / Éducation", categorie: "Formation",  prompt: "Students learning in modern classroom, tablets and books, bright professional space, diverse African students, success" },
  { label: "Tech & Informatique",   categorie: "Tech",       prompt: "Modern technology setup, laptop, smartphone, coding, digital innovation, blue neon lighting, professional workspace" },
  { label: "Transport / Taxi",      categorie: "Services",   prompt: "Modern clean taxi transport vehicle, professional driver in suit, city background Dakar, blue sky, business service" },
  { label: "Pharmacie & Santé",     categorie: "Santé",      prompt: "Clean modern pharmacy interior, medicine bottles, health products, white and green colors, professional medical photography" },
];

/* ── Helpers ────────────────────────────────── */
const INPUT_STYLE: React.CSSProperties = {
  background: "#1e1b3a",
  color: "#ffffff",
  borderColor: "rgba(99,102,241,0.2)",
};

function buildPrompt(description: string, style: Style, businessName: string): string {
  let prompt = description.trim();
  if (businessName.trim()) prompt += `, brand: ${businessName.trim()}`;
  prompt += `, ${style.suffix}`;
  return prompt;
}

/* ── Page ───────────────────────────────────── */
export default function GenerateurVisuelsPage() {
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [styleId, setStyleId]   = useState("pro");
  const [formatId, setFormatId] = useState("carre");
  const [imgSrc, setImgSrc]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg]     = useState("");
  const [seed, setSeed]         = useState(0);
  const [genCount, setGenCount] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const style  = STYLES.find((s) => s.id === styleId)  ?? STYLES[0];
  const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[0];

  async function generer(descOverride?: string) {
    const desc = (descOverride ?? description).trim();
    if (!desc) return;

    const newSeed = Math.floor(Math.random() * 999999);
    setSeed(newSeed);
    setHasError(false);
    setErrMsg("");
    setLoading(true);
    setImgSrc("");

    try {
      const prompt = buildPrompt(desc, style, businessName);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width: format.w, height: format.h, seed: newSeed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Erreur ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImgSrc(url);
      setGenCount((n) => n + 1);
    } catch (e: unknown) {
      setHasError(true);
      setErrMsg(e instanceof Error ? e.message : "Génération échouée. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function appliquerTemplate(t: Template) {
    setDescription(t.prompt);
    setActiveTemplate(t.label);
    setImgSrc("");
    setHasError(false);
    setLoading(false);
  }

  function telecharger() {
    if (!imgSrc) return;
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = `atv-visuel-ia-${Date.now()}.png`;
    a.click();
  }

  function partager() {
    const text = `✨ Visuel créé par l'IA Touba Visuel !\n👉 touba-visuel.vercel.app/generateur-visuels`;
    if (navigator.share) navigator.share({ title: "Visuel IA", text });
    else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  const aspectStyle: React.CSSProperties =
    format.id === "story"   ? { aspectRatio: "9/16", maxHeight: "560px" } :
    format.id === "paysage" ? { aspectRatio: "16/9" } :
    format.id === "portrait"? { aspectRatio: "3/4" } :
    { aspectRatio: "1/1" };

  const categories = [...new Set(TEMPLATES.map((t) => t.categorie))];

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%), #030712" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border"
            style={{ background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Générateur de visuels IA · Touba Visuel
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 leading-tight">
            Créez vos visuels{" "}
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ffc800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              marketing en 1 clic
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Décrivez votre visuel en français, choisissez un style — l&apos;IA génère une vraie image HD en quelques secondes.
          </p>
          {genCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              ✓ {genCount} visuel{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── PANNEAU CONTRÔLES ─────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Nom entreprise */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Nom de votre entreprise (optionnel)
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Boutique Aminata, Restaurant Chez Fatou…"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none border transition-colors"
                style={{ ...INPUT_STYLE, borderColor: "rgba(99,102,241,0.25)" }}
              />
            </div>

            {/* Description */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a5b4fc" }}>
                Décrivez votre visuel *
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setActiveTemplate(null); }}
                placeholder="Ex: Une belle robe bazin rouge sur fond blanc, éclairage studio, pour une boutique de mode sénégalaise…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none border transition-colors resize-none"
                style={{ ...INPUT_STYLE, borderColor: "rgba(99,102,241,0.25)" }}
              />
              <p className="text-right text-xs mt-1" style={{ color: "#4b5563" }}>{description.length} car.</p>
            </div>

            {/* Styles */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Style de rendu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyleId(s.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: styleId === s.id ? "rgba(99,102,241,0.25)" : "#16162a",
                      borderColor: styleId === s.id ? "#6366f1" : "rgba(255,255,255,0.06)",
                      color: styleId === s.id ? "#a5b4fc" : "#9ca3af",
                    }}>
                    <span>{s.emoji}</span><span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formats */}
            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a5b4fc" }}>
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button key={f.id} onClick={() => setFormatId(f.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: formatId === f.id ? "rgba(99,102,241,0.25)" : "#16162a",
                      borderColor: formatId === f.id ? "#6366f1" : "rgba(255,255,255,0.06)",
                      color: formatId === f.id ? "#a5b4fc" : "#9ca3af",
                    }}>
                    <span>{f.icon}</span><span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton générer */}
            <button
              onClick={() => generer()}
              disabled={!description.trim() || loading}
              className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-3"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Génération en cours…</span>
                : "✨ Générer le visuel IA"}
            </button>

            {!description.trim() && (
              <p className="text-center text-xs" style={{ color: "#f59e0b88" }}>
                Décrivez votre visuel ou choisissez un template ci-dessous
              </p>
            )}
          </div>

          {/* ── APERÇU IMAGE ─────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div
              className="rounded-3xl overflow-hidden border relative w-full flex items-center justify-center"
              style={{ ...aspectStyle, background: "#0d0d1a", borderColor: "rgba(99,102,241,0.2)", minHeight: "280px" }}
            >
              {/* Image générée */}
              {imgSrc && !loading && !hasError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgSrc}
                  alt="Visuel IA généré"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Spinner chargement */}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                  </div>
                  <p className="text-white font-bold text-sm mb-1">L&apos;IA génère votre image…</p>
                  <p className="text-gray-500 text-xs">10 à 20 secondes</p>
                </div>
              )}

              {/* Erreur */}
              {hasError && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-red-400 font-bold text-sm mb-2">Génération échouée</p>
                  <p className="text-gray-500 text-xs mb-4">{errMsg || "Essayez une description plus simple ou relancez."}</p>
                  <button onClick={() => generer()}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    ↻ Réessayer
                  </button>
                </div>
              )}

              {/* Placeholder vide */}
              {!imgSrc && !loading && !hasError && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl mb-4 opacity-20">🎨</div>
                  <p className="text-gray-600 text-sm max-w-xs">
                    Votre visuel IA apparaîtra ici.<br />
                    Décrivez-le ou choisissez un template, puis cliquez sur{" "}
                    <span className="font-bold" style={{ color: "#6366f1" }}>Générer</span>.
                  </p>
                </div>
              )}

              {/* Badge watermark */}
              {imgSrc && !loading && !hasError && (
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(4px)" }}>
                  IA · Touba Visuel
                </div>
              )}
            </div>

            {/* Actions */}
            {imgSrc && !loading && !hasError && (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => generer()}
                  className="py-3 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2"
                  style={{ background: "#16162a", borderColor: "rgba(255,255,255,0.08)", color: "#9ca3af" }}>
                  ↻ Regénérer
                </button>
                <button onClick={telecharger}
                  className="py-3 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  ⬇ Télécharger
                </button>
                <button onClick={partager}
                  className="py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border hover:opacity-90"
                  style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "#4ade80" }}>
                  📱 Partager
                </button>
              </div>
            )}

            {/* Info technique */}
            {imgSrc && !loading && !hasError && (
              <div className="rounded-xl px-4 py-3 border flex items-center justify-between text-xs"
                style={{ background: "#0d0d1a", borderColor: "rgba(255,255,255,0.05)", color: "#4b5563" }}>
                <span>Seed #{seed} · {style.label} · {format.w}×{format.h}px</span>
                <button onClick={() => generer()} className="font-medium hover:opacity-80 transition-opacity" style={{ color: "#6366f1" }}>
                  Nouveau seed →
                </button>
              </div>
            )}

            {/* CTA impression */}
            {imgSrc && !loading && !hasError && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(255,200,0,0.05)", borderColor: "rgba(255,200,0,0.2)" }}>
                <p className="font-bold text-sm mb-1" style={{ color: "#fbbf24" }}>🖨️ Imprimer ce visuel avec ATV ?</p>
                <p className="text-xs mb-3" style={{ color: "#6b7280" }}>Flyers, kakémonos, banderoles, t-shirts — impression HD livrée à Touba.</p>
                <a href="https://wa.me/221768001717?text=Je veux imprimer un visuel généré par votre IA. Je vous envoie l'image."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-gray-900 hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
                  Commander l&apos;impression sur WhatsApp →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* TEMPLATES */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-black mb-2">Templates prêts à l&apos;emploi</h2>
            <p className="text-gray-500 text-sm">Cliquez sur un template pour l&apos;appliquer, puis générez.</p>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6366f1" }}>{cat}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {TEMPLATES.filter((t) => t.categorie === cat).map((t) => (
                  <button key={t.label} onClick={() => appliquerTemplate(t)}
                    className="text-left px-4 py-3 rounded-2xl border transition-all hover:scale-[1.02]"
                    style={{
                      background: activeTemplate === t.label ? "rgba(99,102,241,0.15)" : "#0d0d1a",
                      borderColor: activeTemplate === t.label ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)",
                    }}>
                    <p className="font-bold text-white text-sm">{t.label}</p>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: activeTemplate === t.label ? "#a5b4fc" : "#6b7280" }}>
                      {t.prompt.slice(0, 55)}…
                    </p>
                    {activeTemplate === t.label && (
                      <span className="inline-block mt-1 text-xs font-bold" style={{ color: "#6366f1" }}>✓ Sélectionné — Cliquez Générer</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Usage tips */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { emoji: "📸", titre: "Post Instagram", desc: "Format carré 1024×1024 optimisé pour Instagram et Facebook." },
            { emoji: "📱", titre: "Stories & Reels", desc: "Format vertical 9:16 prêt pour Stories Instagram, TikTok, Snapchat." },
            { emoji: "🖨️", titre: "À imprimer", desc: "Visuels HD — parfaits pour flyers, affiches, kakémonos et t-shirts." },
          ].map((item) => (
            <div key={item.titre} className="rounded-2xl p-6 border text-center" style={{ background: "#0d0d1a", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-white font-bold text-base mb-2">{item.titre}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA pack */}
        <div className="mt-12 rounded-3xl p-8 border text-center"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))", borderColor: "rgba(99,102,241,0.25)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#6366f1" }}>Passer au niveau supérieur</p>
          <h3 className="text-white text-2xl font-black mb-3">30 visuels pro par mois, automatiquement ?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Avec nos packs Marketing IA, notre équipe génère et publie vos visuels automatiquement — vous ne faites rien.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/services-ia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              🤖 Voir les packs IA
            </a>
            <a href="https://wa.me/221768001717?text=Je veux un pack IA pour des visuels automatiques"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm border"
              style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
              📱 WhatsApp : 76 800 17 17
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
