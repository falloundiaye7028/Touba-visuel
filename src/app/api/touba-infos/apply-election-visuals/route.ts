import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminListAll, adminUpdate } from "@/lib/touba-infos-store";

export const dynamic = "force-dynamic";

const MAP: Record<string,string> = {
  "ÉLECTIONS 2027 : PEUT-ON VRAIMENT COUPLER LES LÉGISLATIVES ET LES LOCALES ?": "/images/elections-2027/01-couplage.svg",
  "DISSOLUTION EN DÉCEMBRE : CE QUE DIT EXACTEMENT L’ARTICLE 87 DE LA CONSTITUTION": "/images/elections-2027/02-dissolution-article-87.svg",
  "LOCALES 2027 : POURQUOI LE 23 JANVIER 2022 RESTE LA DATE DE RÉFÉRENCE": "/images/elections-2027/03-locales-date-reference.svg",
  "LE PRÉSIDENT PEUT-IL REPORTER LES ÉLECTIONS LOCALES PAR SIMPLE DÉCRET ?": "/images/elections-2027/04-report-par-decret.svg",
  "PROROGER LES MANDATS LOCAUX : POURQUOI UNE LOI SERAIT LA VOIE LA PLUS SOLIDE": "/images/elections-2027/05-prorogation-loi.svg",
  "ET SI L’ASSEMBLÉE REFUSE LA PROROGATION DES LOCALES ?": "/images/elections-2027/06-refus-assemblee.svg",
  "RÉFÉRENDUM : L’ARTICLE 51 PEUT-IL DÉBLOQUER LE CALENDRIER ÉLECTORAL ?": "/images/elections-2027/07-referendum-article-51.svg",
  "ORDONNANCES : POURQUOI L’ARTICLE 77 NE PERMET PAS DE CONTOURNER FACILEMENT L’ASSEMBLÉE": "/images/elections-2027/08-ordonnances-article-77.svg",
  "PEUT-ON DISSOUDRE TOUS LES CONSEILS MUNICIPAUX POUR REFAIRE LE CALENDRIER ?": "/images/elections-2027/09-dissolution-conseils.svg",
  "LOCALES EN JANVIER, LÉGISLATIVES EN FÉVRIER : DEUX ÉLECTIONS À QUELQUES SEMAINES D’INTERVALLE ?": "/images/elections-2027/10-deux-elections.svg",
};

export async function GET() {
  const all = await adminListAll();
  const out:any[] = [];
  for (const [titre,imageUrl] of Object.entries(MAP)) {
    const a = all.find(x => x.titre === titre);
    if (!a) { out.push({titre,ok:false,error:"not-found"}); continue; }
    const u = await adminUpdate(a.id, {
      imageUrl,
      credit: "Visuel éditorial Touba Infos",
      legende: titre,
      imageFocalX: 50,
      imageFocalY: 50,
      miseAJour: new Date().toISOString(),
    });
    out.push({titre,ok:!!u,id:a.id,slug:a.slug,imageUrl});
  }
  revalidatePath("/touba-infos","layout");
  revalidatePath("/","layout");
  return NextResponse.json({ok:out.every(x=>x.ok),count:out.filter(x=>x.ok).length,items:out});
}
