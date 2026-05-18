import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
    try {
          const { prompt, width, height, seed } = await req.json();

      if (!prompt) {
              return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
      }

      const w = Math.min(Number(width) || 1024, 1024);
          const h = Math.min(Number(height) || 1024, 1024);
          const s = Number(seed) || Math.floor(Math.random() * 999999);

      const encoded = encodeURIComponent(prompt);
          const url = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&seed=${s}&nologo=true&enhance=false`;

      // Retourner l'URL directement — le client charge l'image depuis le navigateur
      // Cela évite les erreurs 402/503 et les timeouts côté serveur Vercel
      return NextResponse.json({ imageUrl: url, seed: s }, { status: 200 });
    } catch (err) {
          console.error("generate-image error:", err);
          return NextResponse.json({ error: "Génération échouée. Réessayez." }, { status: 500 });
    }
}
