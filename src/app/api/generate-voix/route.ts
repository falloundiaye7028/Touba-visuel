import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

const VOIX_VALIDES = ["Celine", "Lea", "Mathieu", "Joanna", "Matthew", "Amy"];

function nettoyerTexte(texte: string): string {
  return texte
    .replace(/[\r\n\t]+/g, " ")   // sauts de ligne → espaces
    .replace(/\s{2,}/g, " ")      // espaces multiples → 1 seul
    .replace(/[<>{}[\]\\^`|~]/g, "") // caractères spéciaux dangereux
    .trim()
    .slice(0, 600);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texte = nettoyerTexte(String(body.texte ?? ""));
    const voix = VOIX_VALIDES.includes(body.voix) ? body.voix : "Lea";

    if (!texte) {
      return NextResponse.json({ error: "Texte requis" }, { status: 400 });
    }

    // StreamElements — Amazon Polly Neural
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voix}&text=${encodeURIComponent(texte)}`;

    const audioRes = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "audio/mpeg, audio/*;q=0.9, */*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://streamelements.com/",
      },
    });

    if (!audioRes.ok) {
      return NextResponse.json(
        { error: `Service vocal indisponible (${audioRes.status}). Utilisez le mode navigateur.` },
        { status: 502 }
      );
    }

    const contentType = audioRes.headers.get("content-type") ?? "audio/mpeg";
    if (!contentType.includes("audio")) {
      return NextResponse.json(
        { error: "Réponse invalide du service vocal. Utilisez le mode navigateur." },
        { status: 502 }
      );
    }

    const buffer = await audioRes.arrayBuffer();

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
    return NextResponse.json(
      { error: "Erreur serveur. Essayez le mode navigateur." },
      { status: 500 }
    );
  }
}
