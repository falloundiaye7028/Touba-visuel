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

    // --- Fond dégradé vert foncé ---
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#07402b");
    bg.addColorStop(0.5, "#0a5535");
    bg.addColorStop(1, "#000000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- Cercle décoratif doré en haut ---
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(W / 2, -60, 420, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffc800";
    ctx.lineWidth = 80;
    ctx.stroke();
    ctx.restore();

    // --- Cercle décoratif doré en bas ---
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.beginPath();
    ctx.arc(W / 2, H + 80, 380, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffc800";
    ctx.lineWidth = 60;
    ctx.stroke();
    ctx.restore();

    // --- Étoiles décoratives ---
    const etoiles = [
      { x: 80, y: 80, r: 18 },
      { x: W - 80, y: 100, r: 14 },
      { x: 60, y: H - 120, r: 12 },
      { x: W - 60, y: H - 80, r: 16 },
      { x: W / 2 - 200, y: 200, r: 8 },
      { x: W / 2 + 220, y: 180, r: 10 },
    ];
    etoiles.forEach(({ x, y, r }) => {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#ffc800";
      dessinEtoile(ctx, x, y, r, 5);
      ctx.restore();
    });

    // --- Croissant de lune ---
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#ffc800";
    const cx = W / 2, cy = 170, rExt = 70, rInt = 52;
    ctx.beginPath();
    ctx.arc(cx, cy, rExt, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#07402b";
    ctx.beginPath();
    ctx.arc(cx + 26, cy - 10, rInt, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Étoile sur le croissant ---
    ctx.save();
    ctx.fillStyle = "#ffc800";
    ctx.globalAlpha = 1;
    dessinEtoile(ctx, cx + 68, cy - 36, 14, 5);
    ctx.restore();

    // --- Ligne décorative dorée ---
    const lgrd = ctx.createLinearGradient(100, 0, W - 100, 0);
    lgrd.addColorStop(0, "transparent");
    lgrd.addColorStop(0.3, "#ffc800");
    lgrd.addColorStop(0.7, "#ff7a2a");
    lgrd.addColorStop(1, "transparent");
    ctx.strokeStyle = lgrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 290);
    ctx.lineTo(W - 100, 290);
    ctx.stroke();

    // --- TABASKI MOUBARAK ---
    ctx.save();
    ctx.fillStyle = "#ffc800";
    ctx.font = `bold 90px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(255,200,0,0.3)";
    ctx.shadowBlur = 30;
    ctx.fillText("TABASKI", W / 2, 390);
    ctx.restore();

    ctx.save();
    const grtxt = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
    grtxt.addColorStop(0, "#ffc800");
    grtxt.addColorStop(1, "#ff7a2a");
    ctx.fillStyle = grtxt;
    ctx.font = `bold 64px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText("MOUBARAK", W / 2, 475);
    ctx.restore();

    // --- Ligne décorative ---
    ctx.strokeStyle = lgrd;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 510);
    ctx.lineTo(W - 100, 510);
    ctx.stroke();

    // --- Nom de la famille ---
    const nomAffiche = nom.trim() || "Votre Famille";
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 72px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(255,255,255,0.2)";
    ctx.shadowBlur = 20;
    // Réduire si trop long
    const maxW = W - 120;
    let fontSize = 72;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    while (ctx.measureText(nomAffiche).width > maxW && fontSize > 32) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    }
    ctx.fillText(nomAffiche, W / 2, 620);
    ctx.restore();

    // --- Sous-titre famille ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `italic 32px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText("et toute sa famille", W / 2, 680);
    ctx.restore();

    // --- Message personnalisé ---
    if (message.trim()) {
      ctx.save();
      ctx.fillStyle = "rgba(255,200,0,0.85)";
      ctx.font = `italic 30px Georgia, serif`;
      ctx.textAlign = "center";
      const msgMax = W - 160;
      const mots = message.trim().split(" ");
      const lignes: string[] = [];
      let ligne = "";
      for (const mot of mots) {
        const test = ligne ? `${ligne} ${mot}` : mot;
        if (ctx.measureText(test).width > msgMax) {
          if (ligne) lignes.push(ligne);
          ligne = mot;
        } else {
          ligne = test;
        }
      }
      if (ligne) lignes.push(ligne);
      lignes.forEach((l, i) => ctx.fillText(l, W / 2, 760 + i * 42));
      ctx.restore();
    }

    // --- Ligne bas ---
    ctx.strokeStyle = lgrd;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, H - 120);
    ctx.lineTo(W - 100, H - 120);
    ctx.stroke();

    // --- Logo ATV en bas ---
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = `bold 26px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Carte créée sur • Agence Touba Visuel (ATV) • touba-visuel.vercel.app", W / 2, H - 68);
    ctx.restore();
  }

  function dessinEtoile(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pts: number) {
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const angle = (i * Math.PI) / pts - Math.PI / 2;
      const dist = i % 2 === 0 ? r : r * 0.4;
      const px = x + dist * Math.cos(angle);
      const py = y + dist * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
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
