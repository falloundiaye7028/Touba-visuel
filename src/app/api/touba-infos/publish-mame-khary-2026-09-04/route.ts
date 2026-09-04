import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminCreate, adminListAll, adminUpdate } from "@/lib/touba-infos-store";

const SOURCE =
  "https://www.dakaractu.com/TOUBA-Visite-de-Sokhna-Aida-Diallo-Sokhna-Mame-Khary-Mbacke-brise-le-silence-Je-ne-la-connais-pas-et-ne-l-ai-jamais_a275630.html";

const TITLE =
  "TOUBA : SOKHNA MAME KHARY MBACKÉ APPORTE DES ÉCLAIRCISSEMENTS SUR LA VENUE DE AÏDA DIALLO";

const SUBTITLE =
  "Face aux nombreuses réactions suscitées par la récente venue de Sokhna Aïda Diallo à Touba, Sokhna Mame Khary Mbacké a pris la parole pour préciser son rôle et réaffirmer son attachement au respect des orientations du Khalife général des Mourides.";

const EXCERPT =
  "Sokhna Mame Khary Mbacké rejette toute implication dans l’organisation de la visite de Aïda Diallo, explique le contexte de sa participation et appelle au respect du ndigël du Khalife général des Mourides.";

const BODY = `
<p>La récente venue de <strong>Sokhna Aïda Diallo à Touba</strong>, notamment chez <strong>Serigne Sidy Abdou Lahad Mbacké</strong>, continue de susciter commentaires, interrogations et prises de position. Dans ce contexte, <strong>Sokhna Mame Khary Mbacké</strong> a décidé de prendre la parole afin de préciser son rôle, répondre aux accusations qui circulent et rappeler sa position sur le respect des orientations du Khalife général des Mourides.</p>

<h2>Elle nie avoir organisé la venue de Aïda Diallo</h2>
<p>L’un des principaux points de son intervention concerne les accusations selon lesquelles elle aurait participé à l’organisation ou facilité cette visite. Sokhna Mame Khary Mbacké rejette cette version et affirme ne pas avoir été à l’origine de la venue de Aïda Diallo à Touba.</p>
<p>Elle indique également ne pas entretenir de relation personnelle avec cette dernière. À travers cette prise de parole, elle cherche ainsi à distinguer clairement ce qu’elle reconnaît avoir fait de ce qui lui est attribué dans le débat public.</p>

<h2>La question des repas expliquée</h2>
<p>Sokhna Mame Khary Mbacké reconnaît toutefois avoir participé à la préparation des repas servis à l’occasion de la rencontre. Elle précise que cette intervention aurait été effectuée à la demande de <strong>Serigne Sidy Abdou Lahad Mbacké</strong>, qu’elle présente comme son grand frère.</p>
<p>Selon ses explications, l’exécution de cette demande familiale ne signifie donc pas qu’elle était impliquée dans l’organisation de la visite. Cette précision constitue un élément central de sa réponse aux interprétations qui ont circulé.</p>

<h2>Des réserves exprimées avant la rencontre</h2>
<p>Sokhna Mame Khary Mbacké soutient également avoir exprimé des réserves lorsqu’elle a appris qu’une visite de Aïda Diallo était envisagée. Elle affirme avoir insisté sur la nécessité de tenir compte de la position et des orientations du <strong>Khalife général des Mourides, Serigne Mountakha Mbacké</strong>.</p>
<p>Selon son récit, elle souhaitait que toute démarche sur une question aussi sensible soit menée dans le respect de l’autorité du Khalife général et dans une logique d’apaisement.</p>

<h2>Le respect du ndigël au centre de son message</h2>
<p>Au-delà de la controverse sur sa propre responsabilité, Sokhna Mame Khary Mbacké met en avant l’importance du <strong>respect du ndigël du Khalife général des Mourides</strong>. Elle estime que cette référence doit rester centrale dans la gestion des questions touchant directement la communauté mouride.</p>
<p>Son intervention replace ainsi la polémique dans un cadre plus large : celui de l’autorité du Khalife et de la préservation de l’unité au sein de la communauté.</p>

<h2>Des excuses adressées à la communauté</h2>
<p>Au cours de son intervention, Sokhna Mame Khary Mbacké a également exprimé des regrets face à l’ampleur prise par cette affaire et présenté ses excuses au Khalife général des Mourides ainsi qu’aux membres de la communauté qui auraient pu être heurtés ou troublés par les événements.</p>

<h2>Une affaire qui soulève encore des interrogations</h2>
<p>Cette sortie apporte une nouvelle version des faits, mais elle ne met pas automatiquement fin aux interrogations. Plusieurs questions demeurent sur l’initiative de la visite, les conditions envisagées au départ et les engagements éventuellement discutés avant la rencontre.</p>
<p>Sur un sujet aussi sensible, <strong>Touba Infos</strong> rappelle qu’il est essentiel d’attribuer clairement les déclarations aux personnes qui les formulent. Les accusations ou interprétations rapportées dans cette affaire ne doivent pas être présentées comme des faits établis sans éléments de confirmation indépendants.</p>

<h2>Au-delà de la polémique, préserver l’unité</h2>
<p>La prise de parole de Sokhna Mame Khary Mbacké montre à quel point cette affaire dépasse désormais les personnes directement concernées. À Touba, lorsqu’une question touche à l’autorité du Khalife général des Mourides et aux équilibres internes de la communauté, chaque déclaration peut avoir une portée importante.</p>
<p>Dans ce contexte, la recherche de la vérité, la prudence dans les accusations et le respect des institutions religieuses apparaissent essentiels. Touba Infos continuera de suivre cette actualité en donnant la parole aux différentes parties et en privilégiant une information vérifiée, équilibrée et respectueuse.</p>

<h2>Source</h2>
<p>Entretien et déclarations relayés par les médias, notamment <a href="${SOURCE}" target="_blank" rel="noopener noreferrer">DakarActu</a>, le 4 septembre 2026.</p>
`;

async function resolveEditorialImage(): Promise<string | undefined> {
  try {
    const response = await fetch(SOURCE, {
      headers: { "user-agent": "Mozilla/5.0 ToubaInfos/1.0" },
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    const html = await response.text();
    const a = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const b = html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    return (a?.[1] ?? b?.[1])?.replace(/&amp;/g, "&");
  } catch {
    return undefined;
  }
}

export async function GET() {
  const all = await adminListAll();
  const existing = all.find((a) => a.titre === TITLE);

  for (const article of all) {
    if (article.alaUne && article.id !== existing?.id) {
      await adminUpdate(article.id, { alaUne: false });
    }
  }

  const imageUrl = (await resolveEditorialImage()) ?? existing?.imageUrl;

  let article;
  if (existing) {
    article = await adminUpdate(existing.id, {
      sousTitre: SUBTITLE,
      extrait: EXCERPT,
      categorie: "Touba",
      genre: "Actualité",
      statut: "publie",
      auteur: "Rédaction Touba Infos",
      date: "2026-09-04T10:45:00.000Z",
      tempsLecture: "5 min",
      imageEmoji: "📰",
      imageGradient: "from-green-700 via-emerald-800 to-green-900",
      imageUrl,
      imageFocalX: 50,
      imageFocalY: 40,
      credit: "Source éditoriale : entretien public / DakarActu",
      legende: "Sokhna Mame Khary Mbacké apporte des éclaircissements sur la venue de Aïda Diallo à Touba.",
      alaUne: true,
      breaking: false,
      epingle: true,
      tags: ["Touba", "Sokhna Mame Khary Mbacké", "Aïda Diallo", "Mourides", "Serigne Mountakha Mbacké", "4 septembre 2026"],
      contenu: BODY,
    });
  } else {
    article = await adminCreate({
      titre: TITLE,
      sousTitre: SUBTITLE,
      extrait: EXCERPT,
      categorie: "Touba",
      genre: "Actualité",
      statut: "publie",
      auteur: "Rédaction Touba Infos",
      date: "2026-09-04T10:45:00.000Z",
      tempsLecture: "5 min",
      imageEmoji: "📰",
      imageGradient: "from-green-700 via-emerald-800 to-green-900",
      imageUrl,
      imageFocalX: 50,
      imageFocalY: 40,
      credit: "Source éditoriale : entretien public / DakarActu",
      legende: "Sokhna Mame Khary Mbacké apporte des éclaircissements sur la venue de Aïda Diallo à Touba.",
      alaUne: true,
      breaking: false,
      epingle: true,
      vues: 0,
      tags: ["Touba", "Sokhna Mame Khary Mbacké", "Aïda Diallo", "Mourides", "Serigne Mountakha Mbacké", "4 septembre 2026"],
      contenu: BODY,
    });
  }

  revalidatePath("/touba-infos", "layout");
  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    article: article
      ? { id: article.id, slug: article.slug, alaUne: article.alaUne, imageUrl: article.imageUrl }
      : null,
  });
}
