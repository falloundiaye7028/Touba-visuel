import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

// Voix Amazon Polly supportées par ttsmp3.com
const VOIX_VALIDES = ["Celine", "Lea", "Mathieu", "Joanna", "Matthew", "Amy"];

function nettoyerTexte(texte: string): string {
  return texte
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[<>{}[\]\\^`|~]/g, "")
    .trim()
    .slice(0, 600);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texte = nettoyerTexte(String(body.texte ?? ""));
    const voix  = VOIX_VALIDES.includes(body.voix) ? body.voix : "Lea";

    if (!texte) {
      return NextResponse.json({ error: "Texte requis" }, { status: 400 });
    }

    // ttsmp3.com — proxifie Amazon Polly, gratuit, sans clé
    const formBody = new URLSearchParams({ msg: texte, lang: voix, source: "ttsmp3" });

    const ttsRes = await fetch("https://ttsmp3.com/makemp3_new.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://ttsmp3.com",
        "Referer": "https://ttsmp3.com/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: formBody.toString(),
    });

    if (!ttsRes.ok) {
      return NextResponse.json(
        { error: `Service vocal indisponible (${ttsRes.status}). Utilisez le mode navigateur.` },
        { status: 502 }
      );
    }

    const data = await ttsRes.json() as { Error: number; URL?: string; MP3?: string };

    if (data.Error !== 0 || (!data.URL && !data.MP3)) {
      return NextResponse.json(
        { error: "Génération audio échouée. Utilisez le mode navigateur." },
        { status: 502 }
      );
    }

    const mp3Url = data.URL ?? data.MP3 ?? "";

    // Télécharger le MP3 généré et le renvoyer au client
    const mp3Res = await fetch(mp3Url, {
      headers: { "Referer": "https://ttsmp3.com/" },
    });

    if (!mp3Res.ok) {
      return NextResponse.json(
        { error: "Fichier audio introuvable. Utilisez le mode navigateur." },
        { status: 502 }
      );
    }

    const buffer = await mp3Res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
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
