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
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&seed=${s}&nologo=true&model=flux`;

    const imageRes = await fetch(url, {
      headers: { Accept: "image/*" },
    });

    if (!imageRes.ok) {
      throw new Error(`Pollinations error: ${imageRes.status}`);
    }

    const blob = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "X-Seed": String(s),
      },
    });
  } catch (err) {
    console.error("generate-image error:", err);
    return NextResponse.json({ error: "Génération échouée. Réessayez." }, { status: 500 });
  }
}
