import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminCreate, adminListAll, adminUpdate } from "@/lib/touba-infos-store";
import { ELECTIONS_2027_SERIES } from "@/lib/touba-infos-series-elections-2027";

export const dynamic = "force-dynamic";

const img = (prompt: string, seed: number) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(
    "Touba Infos editorial illustration, Senegal, " + prompt + ", premium news magazine, realistic, clean composition, no text, no logos, 16:10 landscape"
  )}?width=1200&height=750&seed=${seed}&nologo=true&enhance=false`;

export async function GET() {
  const all = await adminListAll();
  for (const a of all) if (a.alaUne) await adminUpdate(a.id, { alaUne: false });

  const made = [];
  const baseMinute = 14;

  for (let i = 0; i < ELECTIONS_2027_SERIES.length; i++) {
    const x = ELECTIONS_2027_SERIES[i];
    const date = `2026-09-04T02:${String(Math.max(0, baseMinute - i)).padStart(2, "0")}:00.000Z`;
    const imageUrl = img(x.imagePrompt, 221700 + i * 37);
    const current = (await adminListAll()).find((a) => a.titre === x.titre);

    const patch = {
      titre: x.titre,
      sousTitre: x.sousTitre,
      extrait: x.extrait,
      categorie: "Politique" as const,
      genre: "Analyse" as const,
      statut: "publie" as const,
      auteur: "Rédaction Touba Infos",
      date,
      tempsLecture: "5 min",
      imageEmoji: "⚖️",
      imageGradient: "from-emerald-800 via-green-900 to-neutral-950",
      imageUrl,
      credit: "Illustration éditoriale générée pour Touba Infos",
      legende: x.titre,
      alaUne: i === 0,
      breaking: false,
      epingle: i === 0,
      vues: current?.vues ?? 0,
      tags: [...x.tags],
      contenu: x.contenu,
    };

    if (current) {
      const updated = await adminUpdate(current.id, patch);
      if (updated) made.push(updated);
    } else {
      made.push(await adminCreate(patch));
    }
  }

  revalidatePath("/touba-infos", "layout");
  revalidatePath("/touba-infos/fil-info");
  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    count: made.length,
    une: made.find((a) => a.alaUne)?.slug,
    articles: made.map((a) => ({ id: a.id, slug: a.slug, titre: a.titre, imageUrl: a.imageUrl })),
  });
}
