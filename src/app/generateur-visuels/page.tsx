"use client";

import { useState } from "react";

interface Style { id: string; label: string; emoji: string; suffix: string }
interface Format { id: string; label: string; w: number; h: number; icon: string }
interface Template { label: string; prompt: string; categorie: string }

const STYLES: Style[] = [
  { id: "pro",      label: "Professionnel",  emoji: "💼", suffix: "professional marketing photo, studio quality, sharp, vibrant colors, 4k" },
  { id: "luxe",     label: "Luxe",           emoji: "✨", suffix: "luxury brand photography, elegant, gold accents, premium quality, minimalist" },
  { id: "africain", label: "Style Africain", emoji: "🌍", suffix: "African aesthetic, vibrant kente colors, traditional patterns, Senegalese style, bold" },
  { id: "moderne",  label: "Moderne",        emoji: "🎨", suffix: "modern graphic design, bold typography, geometric shapes, gradient colors, trendy" },
  { id: "realiste", label: "Ultra Réaliste", emoji: "📷", suffix: "hyperrealistic, photorealistic, DSLR photo, perfect lighting, 8k resolution" },
  { id: "illustre", label: "Illustré",       emoji: "🖌️", suffix: "digital illustration, flat design, colorful, clean lines, professional vector art" },
];

const FORMATS: Format[] = [
  { id: "carre",    label: "Carré (Instagram)", w: 1024, h: 1024, icon: "⬛" },
  { id: "story",    label: "Story / Reel",      w: 576,  h: 1024, icon: "📱" },
  { id: "paysage",  label: "Bannière web",       w: 1024, h: 576,  icon: "🖥️" },
  { id: "portrait", label: "Portrait",           w: 768,  h: 1024, icon: "🖼️" },
];

const TEMPLATES: Template[] = [
  { label: "Produit boutique",     categorie: "Commerce",   prompt: "Beautiful product display in a luxury boutique, elegant shelves, warm lighting, premium packaging, professional marketing photography" },
  { label: "Nourriture sénégal",   categorie: "Restaurant", prompt: "Delicious Senegalese cuisine thieboudienne, steam rising, colorful vegetables, restaurant table setting, food photography, appetizing" },
  { label: "Promotion / Soldes",   categorie: "Commerce",   prompt: "Sale promotion banner, shopping bags, confetti, vibrant red and gold colors, excitement, discount" },
  { label: "Maison / Immobilier",  categorie: "Immobilier", prompt: "Beautiful modern house exterior, Senegalese architecture, palm trees, blue sky, real estate photography, luxury villa" },
  { label: "Mode africaine",       categorie: "Mode",       prompt: "African fashion model wearing colorful traditional bazin riche clothing, elegant pose, professional fashion photography, Dakar" },
  { label: "Cosmétiques Beauté",   categorie: "Beauté",     prompt: "Beauty products flatlay, skincare cream, perfume bottle, flowers, marble background, luxury cosmetics photography" },
  { label: "Mosquée de Touba",     categorie: "Spirituel",  prompt: "Beautiful Grande Mosquée de Touba architecture at golden hour, minaret, spiritual peaceful atmosphere, warm sunset light, Senegal" },
  { label: "Événement Fête",       categorie: "Événement",  prompt: "Celebration event decoration, colorful balloons, elegant table setting, festive atmosphere, party venue, beautiful" },
  { label: "Formation Education",  categorie: "Formation",  prompt: "Students learning in modern classroom, tablets and books, bright professional space, diverse African students, success" },
  { label: "Tech Informatique",    categorie: "Tech",       prompt: "Modern technology setup, laptop, smartphone, coding, digital innovation, blue neon lighting, professional workspace" },
  { label: "Transport Taxi",       categorie: "Services",   prompt: "Modern clean taxi transport vehicle, professional driver in suit, city background Dakar, blue sky, business service" },
  { label: "Pharmacie Santé",      categorie: "Santé",      prompt: "Clean modern pharmacy interior, medicine bottles, health products, white and green colors, professional medical photography" },
];

const INPUT_STYLE: React.CSSProperties = {
  background: "#1e1b3a",
  color: "#ffffff",
  borderColor: "rgba(99,102,241,0.2)",
};

function buildPrompt(description: string, style: Style, businessName: string): string {
  let p = description.trim();
  if (businessName.trim()) p += ", brand: " + businessName.trim();
  p += ", " + style.suffix;
  return p;
}

export default function GenerateurVisuelsPage() {
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [styleId, setStyleId] = useState("pro");
  const [formatId, setFormatId] = useState("carre");
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [seed, setSeed] = useState(0);
  const [genCount, setGenCount] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const style = STYLES.find((s) => s.id === styleId) ?? STYLES[0];
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
        throw new Error((err as { error?: string }).error ?? "Erreur " + res.status);
      }
      const data = await res.json() as { imageUrl: string; seed: number };
      setImgSrc(data.imageUrl);
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
    a.download = "atv-visuel-ia-" + Date.now() + ".png";
    a.target = "_blank";
    a.click();
  }

  function partager() {
    const text = "Visuel créé par l'IA Touba Visuel! touba-visuel.vercel.app/generateur-visuels";
    if (navigator.share) navigator.share({ title: "Visuel IA", text });
    else window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }

  const aspectStyle: React.CSSProperties =
    format.id === "story"    ? { aspectRatio: "9/16", maxHeight: "560px" } :
    format.id === "paysage"  ? { aspectRatio: "16/9" } :
    format.id === "portrait" ? { aspectRatio: "3/4" } :
    { aspectRatio: "1/1" };

  const categories = [...new Set(TEMPLATES.map((t) => t.categorie))];

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%), #030712" }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6 border" style={{ background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
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
              {genCount} visuel{genCount > 1 ? "s" : ""} généré{genCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">

            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
                Nom de votre entreprise (optionnel)
              </label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: Boutique Aminata, Restaurant Chez Fatou…" className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500" style={INPUT_STYLE} />
            </div>

            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
                Décrivez votre visuel *
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Une belle robe bazin rouge sur fond blanc, éclairage studio…" rows={4} className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" style={INPUT_STYLE} />
              <p className="text-right text-xs text-gray-500 mt-1">{description.length} car.</p>
            </div>

            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
                Style de rendu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyleId(s.id)}
                    className={"px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 border " + (styleId === s.id ? "border-indigo-500 text-white" : "border-white/10 text-gray-400")}
                    style={styleId === s.id ? { background: "rgba(99,102,241,0.25)" } : { background: "rgba(255,255,255,0.03)" }}>
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-white/6" style={{ background: "#0d0d1a" }}>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button key={f.id} onClick={() => setFormatId(f.id)}
                    className={"px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 border " + (formatId === f.id ? "border-indigo-500 text-white" : "border-white/10 text-gray-400")}
                    style={formatId === f.id ? { background: "rgba(99,102,241,0.25)" } : { background: "rgba(255,255,255,0.03)" }}>
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => generer()} disabled={loading || !description.trim()}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading || !description.trim() ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", boxShadow: loading || !description.trim() ? "none" : "0 0 30px rgba(99,102,241,0.4)" }}>
              {loading ? "Génération en cours…" : "✨ Générer le visuel IA"}
            </button>

          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/8 overflow-hidden flex items-center justify-center" style={{ background: "#0a0a14", minHeight: "400px", ...aspectStyle }}>
              {loading && (
                <div className="text-center p-8">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Génération en cours…</p>
                  <p className="text-gray-600 text-xs mt-1">Cela peut prendre 10 à 30 secondes</p>
                </div>
              )}
              {!loading && hasError && (
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-red-400 font-semibold mb-1">Génération échouée</p>
                  <p className="text-gray-500 text-sm mb-4">{errMsg || "Essayez une description plus simple ou relancez."}</p>
                  <button onClick={() => generer()} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.4)" }}>
                    ↻ Réessayer
                  </button>
                </div>
              )}
              {!loading && !hasError && imgSrc && (
                <div className="relative w-full h-full">
                  <img src={imgSrc} alt="Visuel IA généré" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <button onClick={telecharger} className="px-4 py-2 rounded-xl text-xs font-bold text-white backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      ⬇ Télécharger
                    </button>
                    <button onClick={partager} className="px-4 py-2 rounded-xl text-xs font-bold text-white backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      📤 Partager
                    </button>
                    <button onClick={() => generer()} className="px-4 py-2 rounded-xl text-xs font-bold text-white backdrop-blur-sm" style={{ background: "rgba(99,102,241,0.6)", border: "1px solid rgba(99,102,241,0.5)" }}>
                      ↻ Regénérer
                    </button>
                  </div>
                  {seed > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs text-gray-400 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)" }}>
                      Seed: {seed}
                    </div>
                  )}
                </div>
              )}
              {!loading && !hasError && !imgSrc && (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4 opacity-20">🖼️</div>
                  <p className="text-gray-500 text-sm">Votre visuel apparaîtra ici</p>
                  <p className="text-gray-600 text-xs mt-1">Décrivez votre image et cliquez sur Générer</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-white text-2xl font-black mb-2">Templates prêts à l&apos;emploi</h2>
          <p className="text-gray-500 text-sm mb-8">Cliquez sur un template pour l&apos;appliquer, puis générez.</p>
          {categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h3 className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-3">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.filter((t) => t.categorie === cat).map((t) => (
                  <button key={t.label} onClick={() => appliquerTemplate(t)}
                    className={"px-4 py-2 rounded-xl text-sm font-medium transition-all border " + (activeTemplate === t.label ? "border-indigo-500 text-white" : "border-white/10 text-gray-400")}
                    style={activeTemplate === t.label ? { background: "rgba(99,102,241,0.2)" } : { background: "rgba(255,255,255,0.03)" }}>
                    <span className="font-semibold">{t.label}</span>
                    <span className="block text-xs text-gray-500 mt-0.5 truncate">{t.prompt.substring(0, 60)}…</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { icon: "📸", title: "Post Instagram", desc: "Format carré 1024x1024 optimisé pour Instagram et Facebook." },
            { icon: "📱", title: "Stories et Reels", desc: "Format vertical 9:16 prêt pour Stories Instagram, TikTok, Snapchat." },
            { icon: "🖨️", title: "A imprimer", desc: "Visuels HD pour flyers, affiches, kakémonos et t-shirts." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl p-5 border border-white/6 text-center" style={{ background: "#0d0d1a" }}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="text-white font-bold mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl p-8 text-center border border-indigo-500/20" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))" }}>
          <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">Passer au niveau supérieur</p>
          <h2 className="text-white text-3xl font-black mb-3">30 visuels pro par mois, automatiquement ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Avec nos packs Marketing IA, notre équipe génère et publie vos visuels automatiquement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/services-ia" className="px-6 py-3 rounded-xl font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              🤖 Voir les packs IA
            </a>
            <a href="https://wa.me/221768001717?text=Je veux un pack IA pour des visuels automatiques" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl font-bold transition-all border border-white/20 text-white hover:bg-white/5">
              📱 WhatsApp : 76 800 17 17
            </a>
          </div>
        </div>

      </div>
    </main>
  );
                      }
