import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminListAll, adminUpdate } from "@/lib/touba-infos-store";

export const dynamic = "force-dynamic";

const visualUrl = (headline: string, scene: string, seed: number) => {
  const prompt = [
    "Touba Infos premium editorial election analysis poster, Senegal, landscape 16:10",
    "clean modern news magazine design, cream background, green yellow red Senegal accents",
    "large bold condensed French headline on the left, perfectly legible, exact headline:",
    `\"${headline}\"`,
    "small label ANALYSE INSTITUTIONNELLE, election ballot box, Senegal flag colors",
    scene,
    "professional institutional visual, strong hierarchy, high readability, no watermark, no extra logos",
  ].join(", ");
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=750&seed=${seed}&nologo=true&enhance=true`;
};

const ITEMS = [
  {
    titre: "ÉLECTIONS 2027 : PEUT-ON VRAIMENT COUPLER LES LÉGISLATIVES ET LES LOCALES ?",
    scene: "National Assembly silhouette and municipal town hall, two institutional clocks, calendar and ballot papers",
  },
  {
    titre: "DISSOLUTION EN DÉCEMBRE : CE QUE DIT EXACTEMENT L’ARTICLE 87 DE LA CONSTITUTION",
    scene: "open Constitution book with Article 87 highlighted, calendar December January February, National Assembly",
  },
  {
    titre: "LOCALES 2027 : POURQUOI LE 23 JANVIER 2022 RESTE LA DATE DE RÉFÉRENCE",
    scene: "municipal town hall, timeline from 23 January 2022 to 2027, ballot box and electoral calendar",
  },
  {
    titre: "LE PRÉSIDENT PEUT-IL REPORTER LES ÉLECTIONS LOCALES PAR SIMPLE DÉCRET ?",
    scene: "presidential decree document, law book, justice scales, gavel, ballot box",
  },
  {
    titre: "PROROGER LES MANDATS LOCAUX : POURQUOI UNE LOI SERAIT LA VOIE LA PLUS SOLIDE",
    scene: "law book, municipal council, National Assembly, calendar bridge January to February 2027, ballot box",
  },
  {
    titre: "ET SI L’ASSEMBLÉE REFUSE LA PROROGATION DES LOCALES ?",
    scene: "parliament chamber voting board with red and green lights, ballot box, institutional tension",
  },
  {
    titre: "RÉFÉRENDUM : L’ARTICLE 51 PEUT-IL DÉBLOQUER LE CALENDRIER ÉLECTORAL ?",
    scene: "Constitution Article 51, referendum ballot box, calendar, citizens silhouettes and Senegal institutional building",
  },
  {
    titre: "ORDONNANCES : POURQUOI L’ARTICLE 77 NE PERMET PAS DE CONTOURNER FACILEMENT L’ASSEMBLÉE",
    scene: "ordinance document Article 77, lock and key metaphor, National Assembly and ballot box",
  },
  {
    titre: "PEUT-ON DISSOUDRE TOUS LES CONSEILS MUNICIPAUX POUR REFAIRE LE CALENDRIER ?",
    scene: "several municipal council buildings, prohibition symbol over mass dissolution, legal shield, ballot box and calendar",
  },
  {
    titre: "LOCALES EN JANVIER, LÉGISLATIVES EN FÉVRIER : DEUX ÉLECTIONS À QUELQUES SEMAINES D’INTERVALLE ?",
    scene: "two ballot boxes on timeline January 2027 to February 2027, town hall and National Assembly",
  },
] as const;

export async function GET() {
  const all = await adminListAll();
  const updated = [];

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    const article = all.find((a) => a.titre === item.titre);
    if (!article) continue;
    const imageUrl = visualUrl(item.titre, item.scene, 270100 + i * 47);
    const next = await adminUpdate(article.id, {
      imageUrl,
      credit: "Visuel éditorial — Touba Infos",
      legende: item.titre,
      imageFocalX: 50,
      imageFocalY: 50,
    });
    if (next) updated.push({ id: next.id, slug: next.slug, titre: next.titre, imageUrl: next.imageUrl });
  }

  revalidatePath("/", "layout");
  revalidatePath("/touba-infos", "layout");
  revalidatePath("/touba-infos/fil-info");
  for (const a of updated) revalidatePath(`/${a.slug}`);

  return NextResponse.json({ ok: true, count: updated.length, articles: updated });
}
