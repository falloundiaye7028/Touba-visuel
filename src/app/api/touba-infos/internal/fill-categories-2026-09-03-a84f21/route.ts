import { NextResponse } from "next/server";
import { adminCreate, adminListAll, type ArticleInput } from "@/lib/touba-infos-store";

const articles: ArticleInput[] = [
  {
    titre: "POUVOIR D’ACHAT : LE SÉNÉGAL VEUT MODERNISER SON SYSTÈME D’INFORMATION SUR LES MARCHÉS",
    sousTitre: "Le ministère de l’Industrie et du Commerce veut renforcer la collecte et l’analyse des données sur les marchés pour mieux orienter les politiques de régulation.",
    extrait: "Le Sénégal veut moderniser son système d’information sur les marchés afin de mieux suivre les prix et d’améliorer les décisions destinées à protéger le pouvoir d’achat.",
    categorie: "Sénégal",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:49:00.000Z",
    tempsLecture: "3 min",
    imageEmoji: "🇸🇳",
    imageGradient: "from-emerald-700 via-green-800 to-emerald-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["Sénégal", "pouvoir d’achat", "commerce", "prix", "marchés", "SIM"],
    contenu: `<p>Pour mieux suivre les prix et protéger le pouvoir d’achat, le Sénégal veut renforcer son système d’information sur les marchés (SIM). Le 2 septembre à Dakar, le secrétaire général du ministère de l’Industrie et du Commerce, Seydina Ababacar Ndiaye, a présenté la modernisation de cet outil comme un enjeu de gouvernance.</p>
<h2>Des données plus fiables pour mieux réguler</h2>
<p>Le SIM sert à collecter et analyser les informations sur les prix, l’offre et l’évolution des marchés. Des données plus rapides et mieux structurées peuvent aider l’État à détecter les tensions, ajuster les mesures de régulation et mieux informer les consommateurs.</p>
<h2>Un enjeu concret pour les ménages</h2>
<p>Dans un contexte où le coût de la vie reste une préoccupation majeure, la qualité de l’information économique devient un outil de décision publique. L’enjeu sera maintenant de transformer cette modernisation en données régulières, exploitables et utiles pour le suivi des prix.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/appel-a-une-modernisation-du-systeme-dinformation-sur-les-marches-pour-proteger-le-pouvoir-dachat/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 2 septembre 2026</a>.</p>`,
  },
  {
    titre: "APRÈS LE MAGAL 2026 : L’ASSAINISSEMENT ET L’EAU RESTENT DES CHANTIERS À ANTICIPER",
    sousTitre: "Les difficultés liées à l’hivernage, à l’assainissement et à l’approvisionnement en eau rappellent la nécessité de préparer le Magal avant, pendant et après l’événement.",
    extrait: "L’édition 2026 rappelle que l’organisation du Grand Magal doit intégrer durablement l’eau, l’assainissement, la voirie et la gestion de l’après-Magal.",
    categorie: "Magal",
    genre: "Analyse",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:48:00.000Z",
    tempsLecture: "4 min",
    imageEmoji: "🕌",
    imageGradient: "from-green-700 via-emerald-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["Grand Magal", "Touba", "assainissement", "hydraulique", "eau", "organisation"],
    contenu: `<p>L’édition 2026 du Grand Magal a une nouvelle fois montré que l’organisation de l’événement ne peut pas se limiter au seul jour de la célébration. Avant le Magal, les responsables du comité d’organisation avaient déjà identifié l’assainissement, la voirie et l’approvisionnement en eau parmi les principaux défis, dans un contexte d’hivernage.</p>
<h2>Penser l’avant, le pendant et l’après</h2>
<p>Quelques semaines après le Magal, l’opération « Set Setal » lancée par les Baye Fall rappelle aussi l’importance de l’après-événement : nettoyage, remise en état des espaces publics et mobilisation collective. Ces besoins gagnent à être intégrés dès la planification.</p>
<h2>Capitaliser sur l’expérience 2026</h2>
<p>Pour les prochaines éditions, l’enjeu sera de consolider les dispositifs liés à l’eau, à l’assainissement, à la circulation, à la gestion des déchets et à la coordination des bénévoles. Une organisation plus continue peut réduire les urgences de dernière minute et améliorer l’accueil des millions de fidèles.</p>
<p><strong>Sources :</strong> <a href="https://aps.sn/grand-magal-lassainissement-et-lhydraulique-defis-au-coeur-des-preparatifs-responsable/" target="_blank" rel="noopener noreferrer">APS, 27 juillet 2026</a> ; <a href="https://aps.sn/touba-les-baye-fall-lancent-une-operation-de-nettoiement-apres-le-magal/" target="_blank" rel="noopener noreferrer">APS, 2 septembre 2026</a>.</p>`,
  },
  {
    titre: "CEDEAO : LE GÉNÉRAL SÉNÉGALAIS BIRAME DIOP PREND LA TÊTE DE LA COMMISSION",
    sousTitre: "L’ancien ministre sénégalais des Forces armées a officiellement été installé à Abuja à la présidence de la Commission de la CEDEAO.",
    extrait: "Le général Birame Diop prend les commandes de la Commission de la CEDEAO dans une période marquée par d’importants défis politiques, économiques et sécuritaires en Afrique de l’Ouest.",
    categorie: "Afrique",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:47:00.000Z",
    tempsLecture: "3 min",
    imageEmoji: "🌍",
    imageGradient: "from-orange-600 via-amber-800 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["CEDEAO", "Afrique de l’Ouest", "Birame Diop", "diplomatie", "Sénégal"],
    contenu: `<p>Le général sénégalais Birame Diop a officiellement pris ses fonctions à la tête de la Commission de la Communauté économique des États de l’Afrique de l’Ouest (CEDEAO), à Abuja. Ancien ministre des Forces armées, il arrive à la direction de l’institution dans une période de défis politiques, économiques et sécuritaires importants pour la sous-région.</p>
<h2>Une fonction au cœur de l’intégration régionale</h2>
<p>La Commission de la CEDEAO accompagne la mise en œuvre des décisions communautaires et intervient sur des dossiers aussi différents que l’intégration économique, la libre circulation, la coopération régionale, la paix et la sécurité.</p>
<h2>Une responsabilité stratégique</h2>
<p>Selon l’APS, l’installation s’est déroulée à Abuja lors de la cérémonie officielle de passation de charges entre les fonctionnaires statutaires sortants et entrants de l’organisation. Le ministre sénégalais Cheikh Niang a procédé à l’installation en sa qualité de président du Conseil des ministres des Affaires étrangères de la CEDEAO.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/le-general-birame-diop-installe-dans-ses-fonctions-de-president-de-la-commission-de-la-cedeao/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 1er septembre 2026</a>.</p>`,
  },
  {
    titre: "TENSIONS USA-IRAN : UNE NOUVELLE ESCALADE FAIT CRAINDRE POUR LES POPULATIONS CIVILES",
    sousTitre: "De nouveaux échanges militaires entre Washington et Téhéran ravivent les inquiétudes humanitaires et les tensions autour du détroit d’Ormuz.",
    extrait: "La reprise des frappes entre les États-Unis et l’Iran alimente les inquiétudes sur les victimes civiles et sur la sécurité d’une zone essentielle au transport mondial de pétrole.",
    categorie: "International",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:46:00.000Z",
    tempsLecture: "4 min",
    imageEmoji: "🌐",
    imageGradient: "from-sky-700 via-blue-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["Iran", "États-Unis", "Moyen-Orient", "ONU", "civils", "détroit d’Ormuz"],
    contenu: `<p>Les tensions entre les États-Unis et l’Iran connaissent une nouvelle phase d’escalade. Reuters rapporte une reprise d’échanges militaires et de nouvelles victimes civiles, tandis que les Nations unies appellent à un cessez-le-feu et au respect du droit international humanitaire.</p>
<h2>Le détroit d’Ormuz sous surveillance</h2>
<p>Une partie de la crise se concentre autour du détroit d’Ormuz, passage majeur pour les exportations mondiales d’hydrocarbures. Toute perturbation durable dans cette zone peut avoir des conséquences sur les marchés de l’énergie et sur les économies bien au-delà du Moyen-Orient.</p>
<h2>Éviter une extension du conflit</h2>
<p>Au-delà des opérations militaires, l’inquiétude porte sur l’impact humanitaire et le risque d’élargissement régional. La situation évoluant rapidement, les bilans humains et opérationnels peuvent encore changer.</p>
<p><strong>Source :</strong> <a href="https://www.reuters.com/world/middle-east/iran-war-escalation-raises-concern-over-civilian-death-toll-2026-09-03/" target="_blank" rel="noopener noreferrer">Reuters, 3 septembre 2026</a>.</p>`,
  },
  {
    titre: "GASTRONOMIE : TROIS CHEFS SÉNÉGALAIS AU BOCUSE D’OR AFRICA 2026",
    sousTitre: "Une équipe sénégalaise participera du 22 au 24 septembre à Agadir avec l’ambition de valoriser le terroir national et de décrocher une qualification mondiale.",
    extrait: "Trois chefs porteront les couleurs du Sénégal au Bocuse d’Or Africa 2026, une compétition qui veut aussi servir de vitrine au patrimoine culinaire national.",
    categorie: "Culture",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:45:00.000Z",
    tempsLecture: "3 min",
    imageEmoji: "🍲",
    imageGradient: "from-fuchsia-700 via-purple-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["gastronomie", "culture", "Bocuse d’Or", "Sénégal", "patrimoine culinaire"],
    contenu: `<p>Le Sénégal participera du 22 au 24 septembre à Agadir, au Maroc, à la phase africaine du Bocuse d’Or 2026. Trois chefs porteront les couleurs nationales : Victor Bassène Gassama en gastronomie, ainsi que Mbaye Mousse Diop et Matar Thiam en pâtisserie.</p>
<h2>Mettre le terroir sénégalais dans l’assiette</h2>
<p>L’objectif sportif est de décrocher une qualification pour la finale mondiale à Lyon. Mais la compétition est aussi une vitrine culturelle : techniques culinaires, produits locaux, créativité et patrimoine gastronomique seront au cœur de la participation sénégalaise.</p>
<h2>La gastronomie comme image du pays</h2>
<p>La Fédération nationale des cuisiniers du Sénégal présente cette participation comme un moyen de valoriser le savoir-faire des professionnels et la richesse du terroir. Une manière de rappeler que la culture d’un pays se raconte aussi par sa cuisine.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/le-senegal-represente-par-trois-chefs-au-bocuse-dor-africa-2026/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 2 septembre 2026</a>.</p>`,
  },
  {
    titre: "UNIVERSITÉ DE MATAM : LE RECTEUR PRESSE L’ENTREPRISE AVANT L’OUVERTURE D’OCTOBRE",
    sousTitre: "Le recteur Mamadou Sidibé demande une accélération du chantier afin que l’Université Souleymane Niang puisse accueillir ses premiers étudiants comme annoncé.",
    extrait: "À quelques semaines de l’ouverture annoncée de l’Université de Matam, le rythme des travaux inquiète son recteur, qui appelle l’entreprise à accélérer le chantier.",
    categorie: "Éducation",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:44:00.000Z",
    tempsLecture: "3 min",
    imageEmoji: "🎓",
    imageGradient: "from-indigo-700 via-blue-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["Université de Matam", "éducation", "enseignement supérieur", "étudiants", "infrastructures"],
    contenu: `<p>À quelques semaines de l’ouverture annoncée de l’Université Souleymane Niang de Matam, son recteur Mamadou Sidibé appelle à accélérer les travaux. Après une visite du chantier, il a exprimé son inquiétude face au rythme d’avancement et aux retards dans l’acheminement de certains matériaux.</p>
<h2>Une ouverture annoncée pour octobre</h2>
<p>L’établissement doit accueillir ses premiers étudiants durant l’année universitaire 2026-2027. Pour le recteur, le calendrier doit être respecté afin que les nouveaux bacheliers orientés à Matam puissent commencer leurs études dans de bonnes conditions.</p>
<h2>Un enjeu pour l’équité territoriale</h2>
<p>L’ouverture de nouvelles universités en région vise notamment à rapprocher l’enseignement supérieur des populations. Le défi est donc double : achever les infrastructures dans les délais et garantir des conditions pédagogiques réellement opérationnelles dès le démarrage.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/universite-de-matam-le-recteur-appelle-a-accelerer-les-travaux-pour-une-ouverture-en-octobre-prochain/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 2 septembre 2026</a>.</p>`,
  },
  {
    titre: "DIASPORA : 60 SÉNÉGALAIS RAPATRIÉS D’AFRIQUE DU SUD ET ACCUEILLIS À DAKAR",
    sousTitre: "Les ressortissants sénégalais ont été accueillis à leur arrivée par les autorités et les services chargés des Sénégalais de l’extérieur.",
    extrait: "Soixante Sénégalais rapatriés d’Afrique du Sud sont arrivés à Dakar, une opération qui remet en lumière l’accompagnement des compatriotes en difficulté à l’étranger.",
    categorie: "Diaspora",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:43:00.000Z",
    tempsLecture: "3 min",
    imageEmoji: "✈️",
    imageGradient: "from-cyan-700 via-sky-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["diaspora", "Sénégalais de l’extérieur", "Afrique du Sud", "rapatriement", "Dakar"],
    contenu: `<p>Soixante Sénégalais rapatriés d’Afrique du Sud ont été accueillis à l’aéroport de Dakar par les autorités et les services chargés des Sénégalais de l’extérieur. Selon l’APS, le groupe comprend notamment 23 enfants et une dizaine de femmes.</p>
<h2>Un retour pris en charge à l’arrivée</h2>
<p>La Direction des Sénégalais de l’extérieur a participé à l’accueil des ressortissants. Cette opération rappelle l’importance des mécanismes d’assistance consulaire et de prise en charge des compatriotes confrontés à des situations difficiles à l’étranger.</p>
<h2>L’accompagnement après le retour</h2>
<p>Pour les personnes concernées, un rapatriement ne s’arrête pas à l’aéroport. Les questions d’accompagnement social, administratif et, selon les situations, économique restent importantes pour faciliter la réinstallation et le retour auprès des familles.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/soixante-senegalais-rapatries-dafrique-du-sud-accueillis-a-laeroport-de-dakar/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 1er septembre 2026</a>.</p>`,
  },
  {
    titre: "CYBERSÉCURITÉ : LE SÉNÉGAL RENFORCE LA PROTECTION DE SES INFRASTRUCTURES NUMÉRIQUES CRITIQUES",
    sousTitre: "L’Assemblée nationale a adopté un projet de loi visant à sécuriser les réseaux et systèmes d’information utilisés pour fournir des services essentiels au Sénégal.",
    extrait: "Le Sénégal se dote d’un cadre juridique renforcé pour protéger ses infrastructures numériques critiques et mieux répondre aux risques cyber.",
    categorie: "Technologies",
    genre: "Actualité",
    statut: "publie",
    auteur: "Rédaction Touba Infos",
    date: "2026-09-03T02:42:00.000Z",
    tempsLecture: "4 min",
    imageEmoji: "💡",
    imageGradient: "from-violet-700 via-indigo-900 to-neutral-950",
    alaUne: false,
    breaking: false,
    epingle: false,
    tags: ["cybersécurité", "numérique", "infrastructures critiques", "Sénégal", "loi", "données"],
    contenu: `<p>Le Sénégal renforce son arsenal juridique face aux risques numériques. L’Assemblée nationale a adopté un projet de loi consacré à la protection des infrastructures d’information critiques et à la sécurité numérique.</p>
<h2>Protéger les services essentiels</h2>
<p>Le texte vise à mettre en place un cadre global pour sécuriser les réseaux et les systèmes d’information utilisés pour fournir des services au Sénégal. Les infrastructures critiques peuvent concerner des secteurs dont l’interruption ou la compromission aurait un impact important sur l’État, l’économie ou les citoyens.</p>
<h2>Le numérique, enjeu de souveraineté</h2>
<p>Lors des débats parlementaires, la cybersécurité a été présentée comme un enjeu de souveraineté nationale. Le défi sera désormais celui de l’application concrète : textes réglementaires, prévention, contrôle, protection des données et capacité de réponse aux incidents.</p>
<p><strong>Source :</strong> <a href="https://aps.sn/le-projet-de-loi-sur-la-protection-des-infrastructures-dinformation-critiques-et-la-securite-numerique-adopte-par-les-deputes/" target="_blank" rel="noopener noreferrer">Agence de Presse Sénégalaise (APS), 20 août 2026</a>.</p>`,
  },
];

export async function GET() {
  try {
    const all = await adminListAll();
    const created: Array<{ id: string; categorie: string; slug: string; titre: string }> = [];
    const skipped: Array<{ categorie: string; reason: string }> = [];

    for (const input of articles) {
      const alreadyPublished = all.some(
        (article) =>
          article.categorie === input.categorie &&
          (article.statut ?? "publie") === "publie",
      );

      if (alreadyPublished) {
        skipped.push({ categorie: input.categorie, reason: "article déjà publié dans cette catégorie" });
        continue;
      }

      const article = await adminCreate(input);
      all.push(article);
      created.push({
        id: article.id,
        categorie: article.categorie,
        slug: article.slug,
        titre: article.titre,
      });
    }

    return NextResponse.json({ ok: true, created, skipped });
  } catch (error) {
    console.error("[touba-infos] fill categories failed", error);
    return NextResponse.json({ ok: false, error: "publication impossible" }, { status: 500 });
  }
}
