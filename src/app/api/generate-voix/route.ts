import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

// Voix disponibles via StreamElements (Amazon Polly Neural)
const VOIX_VALIDES = [
  "Celine", "Lea", "Mathieu",        // Français
  "Joanna", "Matthew", "Amy",         // Anglais
  "Penelope", "Miguel",               // Espagnol
];

export async function POST(req: NextRequest) {
  try {
    const { texte, voix } = await req.json();

    if (!texte || typeof texte !== "string") {
      return NextResponse.json({ error: "Texte requis" }, { status: 400 });
    }
    if (texte.length > 600) {
      return NextResponse.json({ error: "Texte trop long (max 600 caractères)" }, { status: 400 });
    }

    const voixChoisie = VOIX_VALIDES.includes(voix) ? voix : "Lea";
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voixChoisie}&text=${encodeURIComponent(texte)}`;

    const audioRes = await fetch(url, {
      headers: {
        "Accept": "audio/mpeg, audio/*",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!audioRes.ok) {
      throw new Error(`TTS error: ${audioRes.status}`);
    }

    const buffer = await audioRes.arrayBuffer();
    const contentType = audioRes.headers.get("content-type") ?? "audio/mpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="voix-atv-${Date.now()}.mp3"`,
      },
    });
  } catch (err) {
    console.error("generate-voix error:", err);
    return NextResponse.json({ error: "Génération vocale échouée. Réessayez." }, { status: 500 });
  }
}
