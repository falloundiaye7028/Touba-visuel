"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function TabaskiPage() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("Que ce jour béni vous apporte bonheur et prospérité");
  const [telecharge, setTelecharge] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    dessinerCarte();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nom, message]);

  function dessinerCarte() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // --- Fond dégradé bleu ciel ---
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1a2e52");
    bg.addColorStop(0.4, "#2a4a7f");
    bg.addColorStop(0.75, "#4a7ab5");
    bg.addColorStop(1, "#c8dff5");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- Nuages bas de page ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (const [cx2, cy2, r2] of [
      [200, H - 60, 160], [400, H - 40, 200], [650, H - 70, 180],
      [900, H - 50, 150], [100, H - 100, 100], [1000, H - 90, 120],
    ]) {
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // --- Silhouette mosquée centrale ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    dessinMosquee(ctx, W / 2, H - 80, 320);
    ctx.restore();

    // --- Mosquées latérales gauche ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    dessinMosquee(ctx, W / 2 - 270, H - 80, 180);
    ctx.restore();

    // --- Mosquées latérales droite ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    dessinMosquee(ctx, W / 2 + 270, H - 80, 180);
    ctx.restore();

    // --- Petits minarets extrêmes ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    dessinMinaret(ctx, W / 2 - 430, H - 80, 90);
    dessinMinaret(ctx, W / 2 + 430, H - 80, 90);
    ctx.restore();

    // --- Texte "Bonne fête de" ---
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `italic 68px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 12;
    ctx.fillText("Bonne fête de", W / 2, 160);
    ctx.restore();

    // --- TABASKI en grand orange ---
    ctx.save();
    ctx.font = `bold 160px Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 20;
    const gtabaski = ctx.createLinearGradient(W / 2 - 300, 0, W / 2 + 300, 0);
    gtabaski.addColorStop(0, "#ff8c00");
    gtabaski.addColorStop(0.5, "#ffa500");
    gtabaski.addColorStop(1, "#ff6600");
    ctx.fillStyle = gtabaski;
    ctx.fillText("TABASKI", W / 2, 310);
    ctx.restore();

    // --- Nom de famille ---
    const nomAffiche = nom.trim() || "Votre Famille";
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,80,0.5)";
    ctx.shadowBlur = 16;
    ctx.textAlign = "center";
    let fs = 80;
    ctx.font = `bold ${fs}px Arial, sans-serif`;
    while (ctx.measureText(nomAffiche).width > W - 120 && fs > 36) {
      fs -= 4;
      ctx.font = `bold ${fs}px Arial, sans-serif`;
    }
    ctx.fillText(nomAffiche, W / 2, 420);
    ctx.restore();

    // --- "vous souhaite une belle fête" ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `italic 38px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 8;
    ctx.fillText("vous souhaite une belle fête", W / 2, 482);
    ctx.restore();

    // --- Message personnalisé ---
    if (message.trim()) {
      ctx.save();
      ctx.fillStyle = "rgba(255,220,100,0.95)";
      ctx.font = `italic 32px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 6;
      const mots = message.trim().split(" ");
      const lignes: string[] = [];
      let ligne = "";
      for (const mot of mots) {
        const test = ligne ? `${ligne} ${mot}` : mot;
        if (ctx.measureText(test).width > W - 200) {
          if (ligne) lignes.push(ligne);
          ligne = mot;
        } else {
          ligne = test;
        }
      }
      if (ligne) lignes.push(ligne);
      lignes.forEach((l, i) => ctx.fillText(l, W / 2, 538 + i * 44));
      ctx.restore();
    }

    // --- Logo ATV bas ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.0)";
    ctx.fillRect(0, H - 100, W, 100);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `bold 26px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillText("✦ Agence Touba Visuel (ATV) ✦ touba-visuel.vercel.app", W / 2, H - 36);
    ctx.restore();
  }

  function dessinMosquee(ctx: CanvasRenderingContext2D, cx: number, base: number, taille: number) {
    const t = taille;
    // Dome central
    ctx.beginPath();
    ctx.arc(cx, base - t * 0.55, t * 0.4, Math.PI, 0);
    ctx.lineTo(cx + t * 0.4, base - t * 0.15);
    ctx.lineTo(cx - t * 0.4, base - t * 0.15);
    ctx.closePath();
    ctx.fill();
    // Corps mosquée
    ctx.fillRect(cx - t * 0.4, base - t * 0.15, t * 0.8, t * 0.15);
    // Minarets
    dessinMinaret(ctx, cx - t * 0.52, base, t * 0.38);
    dessinMinaret(ctx, cx + t * 0.52, base, t * 0.38);
    // Croissant dome
    dessinCroissant(ctx, cx, base - t * 0.55 - t * 0.4 - 10, t * 0.07);
  }

  function dessinMinaret(ctx: CanvasRenderingContext2D, cx: number, base: number, h: number) {
    const w = h * 0.22;
    ctx.fillRect(cx - w / 2, base - h, w, h);
    // Pointe
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, base - h);
    ctx.lineTo(cx, base - h - h * 0.18);
    ctx.lineTo(cx + w / 2, base - h);
    ctx.closePath();
    ctx.fill();
    // Croissant sommet
    dessinCroissant(ctx, cx, base - h - h * 0.18 - 8, h * 0.055);
  }

  function dessinCroissant(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    const prevFill = ctx.fillStyle;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx + r * 0.45, cy - r * 0.15, r * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = prevFill;
    ctx.restore();
  }


  function telecharger() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lien = document.createElement("a");
    lien.download = `Tabaski-Moubarak-${nom.trim() || "famille"}.png`;
    lien.href = canvas.toDataURL("image/png");
    lien.click();
    setTelecharge(true);
    setTimeout(() => setTelecharge(false), 3000);
  }

  function partager() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "tabaski-moubarak.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Tabaski Moubarak !", text: `${nom.trim() || "Notre famille"} vous souhaite une belle fête de Tabaski 🌙` });
      } else {
        telecharger();
      }
    });
  }

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #07402b 0%, #0a2e1f 60%, #000 100%)" }}>

      {/* Hero */}
      <section className="text-center pt-16 pb-10 px-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 text-black"
          style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
          Tabaski 2026 · Aïd El Kébir
        </span>
        <h1 className="text-white text-4xl md:text-5xl font-black mb-4 leading-tight">
          🌙 Carte de vœux<br />Tabaski gratuite
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Personnalisez votre carte, téléchargez-la et partagez-la sur WhatsApp ou Facebook — gratuitement.
        </p>
      </section>

      {/* Générateur */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Formulaire */}
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
            <h2 className="text-white font-bold text-xl mb-6">Personnalisez votre carte</h2>

            <div className="space-y-5">
              <div>
                <label className="text-white/70 text-sm font-semibold block mb-2">Nom de famille *</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex : Famille Diallo"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/30 font-bold text-lg focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-semibold block mb-2">Message (optionnel)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                />
                <p className="text-white/30 text-xs mt-1 text-right">{message.length}/120</p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={telecharger}
                  className="flex items-center justify-center gap-2 w-full font-black py-4 rounded-2xl text-gray-900 text-base shadow-xl hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
                >
                  {telecharge ? "✓ Téléchargée !" : "⬇ Télécharger ma carte PNG"}
                </button>
                <button
                  onClick={partager}
                  className="flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-2xl text-white text-sm border border-white/30 bg-white/10 hover:bg-white/20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  Partager directement
                </button>
              </div>

              <p className="text-white/30 text-xs text-center pt-2">
                100% gratuit · Carte 1080×1080 px · Parfaite pour WhatsApp & Instagram
              </p>
            </div>
          </div>

          {/* Aperçu canvas */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Aperçu de votre carte</p>
            <canvas
              ref={canvasRef}
              className="w-full max-w-sm rounded-2xl shadow-2xl border border-white/10"
              style={{ aspectRatio: "1/1" }}
            />
          </div>
        </div>

        {/* CTA ATV */}
        <div className="mt-16 text-center p-8 rounded-3xl border border-white/10 bg-white/5">
          <p className="text-white font-bold text-xl mb-2">Vous voulez des supports imprimés pour Tabaski ?</p>
          <p className="text-white/50 text-sm mb-6">T-shirts famille, cartes de vœux, mugs, banderoles — livraison avant Tabaski</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/221778001717?text=Je veux commander des supports pour Tabaski 2026"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-gray-900 shadow-xl hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}
            >
              Commander sur WhatsApp
            </a>
            <Link href="/catalogue"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all">
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
