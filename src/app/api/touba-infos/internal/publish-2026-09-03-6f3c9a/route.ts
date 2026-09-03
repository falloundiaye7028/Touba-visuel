import { NextResponse } from "next/server";
import { adminCreate, adminListAll } from "@/lib/touba-infos-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const articles: Parameters<typeof adminCreate>[0][] = [
  {
    titre: "TOUBA : LES BAYE FALL LANCENT UNE GRANDE OPÉRATION « SET SETAL » ET APPELLENT À UNE MOBILISATION GÉNÉRALE",
    slug: "touba-baye-fall-operation-set-setal-mobilisation-generale",
    sousTitre: "Une vaste opération de nettoiement a été lancée le 2 septembre à Touba, avec un appel aux Mourides et à l’ensemble des musulmans à participer à la salubrité de la ville sainte.",
    extrait: "Les Baye Fall ont lancé à Touba une opération Set Setal ouverte à tous. Au-delà de la journée de nettoiement, l’initiative relance la question d’une mobilisation permanente pour la salubrité de la ville.",
    categorie: "Environnement",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:20:00.000Z",
    tempsLecture: "4 min",
    imageEmoji: "🧹",
    imageGradient: "from-green-700 via-emerald-800 to-green-950",
    alaUne: true,
    breaking: false,
    epingle: false,
    vues: 0,
    tags: ["Touba", "Baye Fall", "Set Setal", "Salubrité", "Environnement"],
    contenu: `<p>La mobilisation pour la propreté de Touba reprend de l’ampleur. Le mercredi 2 septembre 2026, les Baye Fall ont lancé une vaste opération de nettoiement dans la cité religieuse, avec un appel adressé bien au-delà de leur propre communauté.</p>
<p>L’initiative, baptisée <strong>« Set Setal »</strong>, vise à mobiliser les populations autour d’un objectif simple : participer collectivement à l’entretien et à la salubrité de la ville sainte.</p>
<p>Selon l’Agence de Presse Sénégalaise (APS), l’appel a été lancé au nom du khalife général des Baye Fall, Serigne Fallou Fall, avec une invitation adressée aux disciples mourides ainsi qu’à l’ensemble des musulmans souhaitant participer à cette opération.</p>
<h2>Un appel qui dépasse les Baye Fall</h2>
<p>L’un des messages importants de cette mobilisation est son caractère ouvert. L’opération ne doit pas être considérée comme une activité réservée aux Baye Fall. L’objectif affiché est de faire de la propreté de Touba une responsabilité collective.</p>
<p>Les disciples présents à Touba sont appelés à participer, mais l’appel concerne également les Mourides établis dans les différentes régions du Sénégal.</p>
<p>Cette démarche intervient dans un contexte où la question de l’entretien de la ville reste un enjeu majeur, particulièrement après les grands rassemblements religieux qui attirent une très forte affluence.</p>
<h2>La salubrité de Touba, une responsabilité permanente</h2>
<p>Au-delà de cette journée de mobilisation, cette opération pose une question plus large : <strong>comment faire de la propreté de Touba une activité permanente et non seulement ponctuelle ?</strong></p>
<p>Une ville de la dimension de Touba nécessite une mobilisation régulière des services compétents, des organisations communautaires, des dahiras, des quartiers, des associations et des citoyens.</p>
<p>Le « Set Setal » lancé par les Baye Fall peut ainsi devenir un nouveau point de départ pour renforcer cette culture de responsabilité collective.</p>
<p>Il ne s’agit pas uniquement de nettoyer les rues pendant quelques heures. Il s’agit aussi de sensibiliser les populations à la gestion des déchets, à l’entretien des espaces publics et au respect du cadre de vie.</p>
<h2>Touba peut devenir une référence</h2>
<p>La mobilisation communautaire a toujours occupé une place importante dans le fonctionnement de Touba. Lorsque cette capacité de mobilisation est orientée vers l’environnement, l’assainissement, le reboisement et l’amélioration du cadre de vie, elle peut produire des résultats considérables.</p>
<p>L’appel lancé à travers cette opération « Set Setal » rappelle donc une évidence : <strong>la propreté de Touba concerne tout le monde.</strong></p>
<p>Habitants, commerçants, dahiras, associations, collectivités, services publics et disciples peuvent tous jouer leur rôle pour faire de la ville sainte un exemple en matière de salubrité.</p>
<p><strong>Source principale :</strong> <a href="https://aps.sn/touba-les-baye-fall-lancent-une-operation-de-nettoiement-apres-le-magal/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 2 septembre 2026</a>.</p>`,
  },
  {
    titre: "DOUBLE DEUIL : SERIGNE MOUNTAKHA MBACKÉ APPELLE LES FIDÈLES À RESTER CHEZ EUX ET À PRIVILÉGIER LES PRIÈRES",
    slug: "double-deuil-serigne-mountakha-appelle-fideles-prieres-sans-deplacement",
    sousTitre: "Après le rappel à Dieu de Cheikh Ibrahima Fall “Lamp” Mbacké, le Khalife général des Mourides a demandé aux fidèles de privilégier les prières depuis leur localité et d’éviter les déplacements vers Touba.",
    extrait: "Après la disparition de son fils Cheikh Ibrahima Fall “Lamp” Mbacké, Serigne Mountakha Mbacké appelle au recueillement et dispense les fidèles de déplacement vers Touba.",
    categorie: "Religion",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:15:00.000Z",
    tempsLecture: "5 min",
    imageEmoji: "🕊️",
    imageGradient: "from-slate-800 via-green-950 to-slate-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    vues: 0,
    tags: ["Touba", "Serigne Mountakha Mbacké", "Cheikh Ibrahima Fall Lamp Mbacké", "Mourides", "Nécrologie"],
    contenu: `<p>Dans l’épreuve, Serigne Mountakha Bassirou Mbacké a délivré un message de foi, de sérénité et de retenue.</p>
<p>Après le rappel à Dieu de son fils <strong>Cheikh Ibrahima Mbacké, plus connu sous le nom de Cheikh Ibrahima Fall « Lamp » Mbacké</strong>, survenu à la suite d’un accident de la circulation dans la région de Louga, le Khalife général des Mourides a demandé aux fidèles de ne pas effectuer de déplacement massif vers Touba pour lui présenter leurs condoléances.</p>
<p>Dans le message rendu public après le décès, les fidèles sont invités à privilégier les prières et le recueillement depuis leur lieu de résidence.</p>
<h2>Une nouvelle épreuve pour le Khalife</h2>
<p>Le décès de Cheikh Ibrahima Fall « Lamp » Mbacké intervient moins d’un mois après celui de <strong>Sokhna Mame Ami Mbacké</strong>, fille du Khalife général des Mourides, rappelée à Dieu le 5 août 2026.</p>
<p>Face à ces épreuves successives, le message transmis insiste surtout sur l’acceptation de la volonté divine, la patience et l’importance de la prière.</p>
<h2>Un accident survenu dans la région de Louga</h2>
<p>Selon l’Agence de Presse Sénégalaise, l’accident ayant coûté la vie à Cheikh Ibrahima Fall « Lamp » Mbacké s’est produit le mardi 1er septembre vers 18 h 30, à hauteur du village de <strong>Dière Wakho</strong>, dans l’arrondissement de Koki, région de Louga.</p>
<p>Le véhicule impliqué a quitté la chaussée après une perte de contrôle. L’accident a fait plusieurs blessés. Grièvement atteint, Cheikh Ibrahima Fall « Lamp » Mbacké a été évacué vers l’hôpital régional de Louga où il a succombé à ses blessures.</p>
<p>Quelques heures auparavant, il avait représenté le Khalife général des Mourides lors d’une cérémonie de distribution de kits alimentaires destinés à vingt écoles coraniques de Touba, organisée par la Société africaine de raffinage.</p>
<h2>La prière plutôt que les déplacements</h2>
<p>À la suite de cette disparition, le Khalife général des Mourides a exprimé sa gratitude envers les musulmans et les citoyens solidaires, tout en demandant à chacun de formuler des prières depuis sa localité.</p>
<p>Cette consigne vise à préserver le calme et le recueillement dans un moment particulièrement douloureux pour la famille.</p>
<p>À travers cette attitude, Serigne Mountakha Mbacké rappelle la place centrale de la foi, de la patience et de l’acceptation de la volonté divine face aux épreuves de la vie.</p>
<p><strong>Sources :</strong> <a href="https://aps.sn/deces-par-accident-de-cheikh-ibrahima-mbacke-lamp-fils-du-khalife-general-des-mourides/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 2 septembre 2026</a> ; <a href="https://www.seneweb.com/fr/news/Societe/touba-the-son-of-the-mouride-caliph-general-has-passed-away-serigne-mountakha-exempts-the-faithful-from-traveling_n_503101.html" target="_blank" rel="noopener noreferrer">Seneweb, 2 septembre 2026</a>.</p>`,
  },
];

export async function GET() {
  const all = await adminListAll();
  const existingSlugs = new Set(all.map((article) => article.slug));
  const created: Array<{ id: string; slug: string }> = [];
  const skipped: string[] = [];

  for (const input of articles) {
    const slug = input.slug || "";
    if (existingSlugs.has(slug)) {
      skipped.push(slug);
      continue;
    }
    const article = await adminCreate(input);
    created.push({ id: article.id, slug: article.slug });
    existingSlugs.add(article.slug);
  }

  return NextResponse.json(
    { ok: true, created, skipped },
    { headers: { "Cache-Control": "no-store" } },
  );
}
