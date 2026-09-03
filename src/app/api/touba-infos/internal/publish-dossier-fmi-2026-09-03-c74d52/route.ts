import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { adminCreate, adminListAll } from "@/lib/touba-infos-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TITLE = "SÉNÉGAL–FMI 2026-2029 : OÙ VONT RÉELLEMENT LES 1 243 MILLIARDS ?";
const SLUG = "senegal-fmi-2026-2029-ou-vont-reellement-les-1243-milliards";
const IMAGE_SOURCE = "https://commons.wikimedia.org/wiki/Special:Redirect/file/IMF_building_HR.jpg";

const content = `
<p><strong>Le chiffre impressionne :</strong> environ 2,2 milliards de dollars, soit autour de 1 243 milliards de FCFA, pourraient être mobilisés par le Fonds monétaire international au profit du Sénégal sur une période de 36 mois. Mais où ira réellement cet argent ?</p>
<p>Servira-t-il à payer les salaires, à rembourser la dette, à financer les hôpitaux, les routes et les écoles ? L’analyse des documents du FMI et des projections budgétaires officielles du Sénégal montre une réalité plus complexe : <strong>les 1 243 milliards ne constituent pas une enveloppe libre que le gouvernement pourra répartir à sa guise entre différents ministères.</strong></p>

<h2>1. D’abord, les 1 243 milliards ne sont pas encore définitivement acquis</h2>
<p>Le 1er septembre 2026, les services du FMI et les autorités sénégalaises ont annoncé un <strong>accord au niveau des services</strong> pour un programme de 36 mois au titre de la Facilité élargie de crédit (FEC).</p>
<p>Le montant annoncé est d’environ <strong>2,2 milliards de dollars</strong>, ou <strong>1 537,1 millions de DTS</strong>, correspondant à 475 % de la quote-part du Sénégal au FMI. Mais l’accord reste soumis à l’approbation de la direction et du Conseil d’administration du Fonds, ainsi qu’à des mesures correctrices liées au dossier des anciennes déclarations erronées de dette.</p>
<p>Il s’agit donc, à ce stade, d’un <strong>accord technique</strong>, et non d’un chèque de 1 243 milliards immédiatement disponible.</p>

<h2>2. Les 1 243 milliards ne seront pas versés en une seule fois</h2>
<p>Une Facilité élargie de crédit fonctionne par décaissements successifs, généralement associés à des revues régulières du programme. Il serait donc trompeur d’imaginer que le FMI verse 1 243 milliards au gouvernement en une seule opération.</p>
<p>Si l’on faisait uniquement une division théorique sur 36 mois, cela représenterait environ <strong>34,5 milliards FCFA par mois</strong>. Les décaissements réels ne suivront toutefois pas nécessairement ce rythme.</p>

<h2>3. Le Sénégal dépense autour de 600 milliards FCFA par mois</h2>
<p>Pour comprendre la taille réelle du programme FMI, il faut le comparer au budget national. Les données budgétaires officielles pour 2026 affichent environ <strong>6 188,8 milliards FCFA de recettes</strong>, <strong>7 433,9 milliards de dépenses</strong> et un déficit de <strong>1 245,1 milliards FCFA</strong>.</p>
<table><thead><tr><th>Année</th><th>Recettes totales</th><th>Dépenses totales</th><th>Déficit</th></tr></thead><tbody>
<tr><td>2026</td><td>6 188,8 Mds</td><td>7 433,9 Mds</td><td>1 245,1 Mds</td></tr>
<tr><td>2027</td><td>6 082,1 Mds</td><td>7 242,3 Mds</td><td>1 160,3 Mds</td></tr>
<tr><td>2028</td><td>6 403,1 Mds</td><td>7 353,3 Mds</td><td>950,2 Mds</td></tr>
<tr><td>2029</td><td>6 742,7 Mds</td><td>7 537,2 Mds</td><td>794,6 Mds</td></tr>
</tbody></table>
<p>En moyenne théorique, les dépenses publiques se situeraient autour de <strong>603 à 628 milliards FCFA par mois</strong> entre 2027 et 2029. Face à cela, l’équivalent mensuel théorique du programme FMI sur trois ans serait d’environ 34,5 milliards.</p>

<h2>4. Alors, où va réellement l’argent du FMI ?</h2>
<p>La FEC n’est pas, à l’origine, un financement destiné à construire directement une autoroute, un hôpital ou une université. Sa fonction est macroéconomique et financière : aider un pays à rétablir une situation soutenable de ses finances publiques, de sa dette et de sa balance des paiements.</p>
<p>Pour le Sénégal, le FMI annonce déjà plusieurs priorités : <strong>restauration de la viabilité des finances publiques et de la dette, augmentation des ressources intérieures, rationalisation des dépenses, renforcement des dépenses sociales, amélioration de la transparence budgétaire et soutien à une croissance tirée par le secteur privé.</strong></p>

<h2>5. Premier candidat : le déficit budgétaire</h2>
<p>Le Sénégal continue de dépenser davantage qu’il ne collecte. Le déficit prévu est de <strong>1 160,3 milliards FCFA en 2027</strong>, <strong>950,2 milliards en 2028</strong>, puis <strong>794,6 milliards en 2029</strong>, soit respectivement environ 4,9 %, 3,8 % et 3 % du PIB.</p>
<p>Les 1 243 milliards du programme FMI sur trois ans sont donc presque équivalents au déficit budgétaire prévu pour la seule année 2027. Cela ne signifie pas pour autant que le FMI financera intégralement ce déficit.</p>

<h2>6. Le véritable problème : près de 19 690 milliards de besoins de financement</h2>
<p>Le déficit n’est qu’une partie des besoins financiers de l’État. Chaque année, le Sénégal doit également refinancer des dettes arrivées à échéance.</p>
<table><thead><tr><th>Année</th><th>Besoin global de financement</th></tr></thead><tbody>
<tr><td>2027</td><td>6 071,1 Mds FCFA</td></tr>
<tr><td>2028</td><td>7 152,2 Mds FCFA</td></tr>
<tr><td>2029</td><td>6 466,2 Mds FCFA</td></tr>
<tr><td><strong>Total</strong></td><td><strong>19 689,5 Mds FCFA</strong></td></tr>
</tbody></table>
<p>Face à environ 19 689,5 milliards de besoins globaux de financement prévus sur 2027-2029, les 1 243 milliards du FMI représentent environ <strong>6,3 %</strong>.</p>
<p><strong>C’est l’un des chiffres centraux de ce dossier :</strong> le financement du FMI est important, mais il ne peut pas régler seul le problème financier du Sénégal.</p>

<h2>7. Pourquoi les besoins atteignent-ils près de 20 000 milliards ?</h2>
<p>Principalement parce que l’État doit rembourser ou refinancer une partie de la dette existante. Les amortissements de dette sont projetés autour de <strong>4 388 milliards en 2027</strong>, <strong>5 679,2 milliards en 2028</strong> et <strong>5 148,7 milliards en 2029</strong>.</p>
<p>Le gouvernement doit donc mobiliser de nouveaux financements pour faire face à des dettes anciennes arrivant à échéance, en plus du nouveau déficit et d’autres opérations de trésorerie.</p>

<h2>8. La dette constitue le cœur du problème</h2>
<p>À fin décembre 2025, l’encours provisoire de la dette de l’administration centrale atteignait environ <strong>25 198,48 milliards FCFA</strong>. Ce montant représente environ vingt fois le financement total annoncé dans le nouveau programme FMI.</p>

<h2>9. Une comparaison spectaculaire : les intérêts de la dette</h2>
<table><thead><tr><th>Année</th><th>Intérêts de la dette</th></tr></thead><tbody>
<tr><td>2027</td><td>1 303,9 Mds FCFA</td></tr>
<tr><td>2028</td><td>1 328,5 Mds FCFA</td></tr>
<tr><td>2029</td><td>1 061,4 Mds FCFA</td></tr>
<tr><td><strong>Total</strong></td><td><strong>3 693,8 Mds FCFA</strong></td></tr>
</tbody></table>
<p>Les <strong>1 243 milliards du FMI sont inférieurs aux seuls intérêts de la dette prévus pour 2027</strong>. Sur 2027-2029, les intérêts représenteraient près de trois fois le montant du programme FMI.</p>

<h2>10. Et les salaires ?</h2>
<p>La masse salariale est projetée à environ <strong>1 587,7 milliards FCFA en 2027</strong>, <strong>1 644,8 milliards en 2028</strong> et <strong>1 704,1 milliards en 2029</strong>.</p>
<p>Le financement total FMI de 1 243 milliards correspond donc à moins d’une année entière de dépenses de personnel prévues en 2027. Là encore, l’échelle du budget national dépasse largement celle du programme.</p>

<h2>11. Le FMI ne vient donc pas « payer le Sénégal »</h2>
<p>L’importance du programme est surtout stratégique. Le FMI indique que son intervention doit également servir de <strong>catalyseur</strong> pour d’autres financements, notamment auprès de la Banque mondiale, de la Banque africaine de développement et d’autres partenaires.</p>
<p>Un accord avec le FMI peut donc contribuer à restaurer la confiance, faciliter l’accès à des financements concessionnels et réduire la dépendance aux ressources plus coûteuses.</p>

<h2>12. En échange, Dakar devra augmenter ses propres recettes</h2>
<p>Le gouvernement prévoit une progression importante des recettes intérieures, notamment à travers les réformes fiscales et douanières et une stratégie de recettes à moyen terme. L’idée est simple : <strong>le Sénégal doit progressivement financer davantage son budget par ses propres ressources.</strong></p>

<h2>13. Il faudra aussi contrôler les dépenses</h2>
<p>La consolidation budgétaire ne consiste pas uniquement à lever davantage d’impôts. Elle implique également une meilleure qualité de la dépense, une rationalisation des dépenses courantes, une meilleure gestion des entreprises publiques et une protection des investissements productifs et sociaux prioritaires.</p>

<h2>14. Le choc de 2026 montre combien cette trajectoire reste fragile</h2>
<p>Le contexte énergétique international a fortement réduit les marges budgétaires. Les subventions énergétiques, initialement prévues à 250 milliards FCFA, ont été réévaluées autour de <strong>729 milliards FCFA</strong>, alors que des moins-values de recettes étaient également anticipées.</p>
<p>Cette situation montre qu’un choc extérieur peut rapidement bouleverser une trajectoire budgétaire pourtant programmée plusieurs années à l’avance.</p>

<h2>15. La question de la dette non déclarée reste centrale</h2>
<p>Le nouveau programme intervient après la crise de confiance née des écarts révélés dans les anciens chiffres des finances publiques. Le FMI a déjà indiqué que le futur programme devait s’accompagner de mesures correctrices, d’un renforcement de la transparence et de garanties pour éviter la répétition de tels problèmes.</p>

<h2>16. Le Sénégal engage parallèlement un traitement de sa dette</h2>
<p>Le 1er septembre 2026, le gouvernement a annoncé le lancement du <strong>Plan de Traitement de la Dette du Sénégal (PTDS)</strong>. L’objectif est de réduire la pression du service de la dette et du refinancement, tout en préservant le marché financier régional.</p>
<p>Le dossier FMI et le traitement de la dette sont donc étroitement liés : l’enjeu est moins de « supprimer » la dette que d’en rendre le profil plus soutenable et de redonner des marges de manœuvre au budget.</p>

<h2>17. Le pétrole et le gaz ne suffiront pas non plus</h2>
<p>Les recettes publiques issues des hydrocarbures sont projetées autour de <strong>703 milliards FCFA sur 2027-2029</strong>. C’est significatif, mais très inférieur aux quelque 19 690 milliards de besoins de financement prévus sur la même période.</p>

<h2>18. Remettre les 1 243 milliards dans leur véritable contexte</h2>
<table><thead><tr><th>Indicateur</th><th>Montant approximatif</th></tr></thead><tbody>
<tr><td>Programme FMI 2026-2029</td><td><strong>1 243 Mds FCFA</strong></td></tr>
<tr><td>Dépenses publiques 2027</td><td>7 242 Mds</td></tr>
<tr><td>Déficit 2027</td><td>1 160 Mds</td></tr>
<tr><td>Intérêts de la dette 2027</td><td>1 304 Mds</td></tr>
<tr><td>Masse salariale 2027</td><td>1 588 Mds</td></tr>
<tr><td>Besoin de financement 2027-2029</td><td><strong>19 690 Mds</strong></td></tr>
<tr><td>Intérêts de la dette 2027-2029</td><td>3 694 Mds</td></tr>
<tr><td>Dette de l’administration centrale fin 2025</td><td>25 198 Mds</td></tr>
</tbody></table>

<h2>19. Alors, où vont réellement les 1 243 milliards ?</h2>
<p>À ce jour, il n’existe pas encore de tableau public attribuant les 1 243 milliards ministère par ministère ou projet par projet. Le programme n’est pas encore définitivement approuvé par le Conseil d’administration du FMI.</p>
<p>Les documents disponibles montrent néanmoins que ces ressources ont pour fonction d’aider à stabiliser les finances publiques, soutenir la balance des paiements, accompagner la réduction du déficit, améliorer la viabilité de la dette et surtout aider le Sénégal à mobiliser d’autres financements.</p>
<p>La bonne question n’est donc pas seulement : <em>« Où le gouvernement va-t-il dépenser 1 243 milliards ? »</em></p>
<p><strong>La question centrale est plutôt : comment 1 243 milliards de financement FMI peuvent-ils servir de levier à un État qui doit mobiliser près de 20 000 milliards de financements entre 2027 et 2029 ?</strong></p>

<h2>20. Le véritable enjeu : ramener le déficit vers 3 % du PIB</h2>
<p>La trajectoire officielle prévoit un déficit d’environ 4,9 % du PIB en 2027, 3,8 % en 2028 et 3 % en 2029. En valeur absolue, le déficit annuel devrait ainsi passer de 1 160,3 milliards à 794,6 milliards FCFA.</p>
<p>Ce redressement dépendra moins du seul argent du FMI que de la capacité du gouvernement à augmenter durablement ses recettes, contrôler ses dépenses, améliorer la gestion de la dette, réduire son coût de financement et préserver suffisamment d’investissements pour soutenir la croissance.</p>

<h2>Conclusion — Les 1 243 milliards sont importants, mais ce n’est pas le vrai sujet</h2>
<p>Le montant annoncé du programme FMI est considérable pour l’opinion publique. Mais en regardant les comptes complets de l’État, le chiffre prend une autre dimension.</p>
<p>Sur 2027-2029, le Sénégal prévoit plus de 22 000 milliards FCFA de dépenses publiques, près de 19 700 milliards de besoins de financement, environ 3 700 milliards d’intérêts de la dette et plus de 15 000 milliards d’amortissements de dette.</p>
<p><strong>Le FMI ne peut donc pas résoudre seul le problème.</strong> Son rôle est surtout de fournir un financement concessionnel, sécuriser une trajectoire de réformes et contribuer à rouvrir la porte aux autres partenaires financiers.</p>
<p>Le véritable enjeu des trois prochaines années sera donc de savoir si ce programme permettra au Sénégal de transformer un financement représentant à peine environ 6,3 % de ses besoins financiers prévus entre 2027 et 2029 en un levier capable de rétablir durablement la confiance, réduire le poids de la dette et préserver les investissements nécessaires au développement.</p>

<p><strong>Sources principales :</strong><br>
<a href="https://www.imf.org/fr/news/articles/2026/09/01/pr26282-senegal-imf-reaches-sla-ecf-arrangement" target="_blank" rel="noopener noreferrer">Fonds monétaire international — Accord au niveau des services avec le Sénégal, 1er septembre 2026</a><br>
<a href="https://www.archives.sn/docs/budget/document-programmation-budgetaire-economique-pluriannuelle-dpbep-2027-2029-senegal" target="_blank" rel="noopener noreferrer">DPBEP 2027-2029 — Ministère de l’Économie, des Finances et du Plan</a><br>
<a href="https://www.finances.gouv.sn/investisseurs" target="_blank" rel="noopener noreferrer">Ministère de l’Économie, des Finances et du Plan — Indicateurs budgétaires 2026</a><br>
<a href="https://www.finances.gouv.sn/actualites/le-senegal-engage-une-etape-decisive-de-sa-strategie-de-gestion-active-de-la-dette-avec-le-lancement-du-plan-de-traitement-de-la-dette-du-senegal-ptds" target="_blank" rel="noopener noreferrer">Plan de Traitement de la Dette du Sénégal (PTDS), 1er septembre 2026</a></p>
`;

async function uploadCover(): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN absent");
  const response = await fetch(IMAGE_SOURCE, { redirect: "follow" });
  if (!response.ok) throw new Error(`Échec image FMI: ${response.status}`);
  const bytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const blob = await put("touba-infos/articles/senegal-fmi-2026-2029-grand-dossier.jpg", bytes, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

export async function GET() {
  try {
    const all = await adminListAll();
    const existing = all.find((a) => a.slug === SLUG || a.titre === TITLE);
    if (existing) {
      return NextResponse.json({ ok: true, created: false, article: existing });
    }

    const imageUrl = await uploadCover();
    const article = await adminCreate({
      slug: SLUG,
      titre: TITLE,
      sousTitre: "Budget, dette, intérêts, déficit et besoins de financement : Touba Infos replace le programme de 2,2 milliards de dollars du FMI dans la véritable échelle des finances publiques sénégalaises.",
      extrait: "Les 1 243 milliards annoncés par le FMI paraissent immenses. Pourtant, ils ne représentent qu’une fraction des besoins de financement du Sénégal d’ici 2029. Voici où se situe réellement l’enjeu.",
      categorie: "Économie",
      genre: "Analyse",
      statut: "publie",
      auteur: "Rédaction Touba Infos",
      date: new Date().toISOString(),
      tempsLecture: "12 min",
      imageEmoji: "📊",
      imageGradient: "from-emerald-800 via-green-950 to-neutral-950",
      imageUrl,
      imageFocalX: 50,
      imageFocalY: 50,
      credit: "Photo : Fonds monétaire international (FMI) — Wikimedia Commons, domaine public",
      legende: "Siège du Fonds monétaire international à Washington. Photo d’illustration pour le dossier Sénégal–FMI 2026-2029.",
      alaUne: false,
      breaking: false,
      epingle: true,
      tags: ["Sénégal", "FMI", "Budget", "Dette publique", "Finances publiques", "Économie", "2029"],
      contenu: content,
    });

    return NextResponse.json({ ok: true, created: true, article });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
