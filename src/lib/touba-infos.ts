export type CategorieInfo =
  | "Mouridisme"
  | "Touba"
  | "Sénégal"
  | "Afrique"
  | "International"
  | "Économie"
  | "Sport"
  | "Culture";

export interface ArticleInfo {
  id: string;
  slug: string;
  titre: string;
  sousTitre: string;
  extrait: string;
  categorie: CategorieInfo;
  auteur: string;
  datePublication: string;
  tempsLecture: string;
  imageEmoji: string;
  imageGradient: string;
  alaUne: boolean;
  breaking?: boolean;
  contenu: string;
}

export const COULEURS_CATEGORIES: Record<CategorieInfo, string> = {
  Mouridisme: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Touba: "bg-amber-100 text-amber-800 border border-amber-200",
  Sénégal: "bg-green-100 text-green-800 border border-green-200",
  Afrique: "bg-orange-100 text-orange-800 border border-orange-200",
  International: "bg-blue-100 text-blue-800 border border-blue-200",
  Économie: "bg-purple-100 text-purple-800 border border-purple-200",
  Sport: "bg-red-100 text-red-800 border border-red-200",
  Culture: "bg-pink-100 text-pink-800 border border-pink-200",
};

export const CATEGORIES_INFO: CategorieInfo[] = [
  "Mouridisme",
  "Touba",
  "Sénégal",
  "Afrique",
  "International",
  "Économie",
  "Sport",
  "Culture",
];

export const ARTICLES_INFO: ArticleInfo[] = [
  {
    id: "1",
    slug: "grand-magal-touba-2026-millions-pelerins-ville-sainte",
    titre: "Grand Magal de Touba 2026 : des millions de pèlerins attendus dans la Cité Sainte",
    sousTitre: "La plus grande manifestation religieuse d'Afrique de l'Ouest se prépare dans un élan de ferveur historique",
    extrait:
      "Le Grand Magal de Touba, commémoration du départ en exil de Cheikh Ahmadou Bamba, rassemble chaque année des millions de fidèles mourides venus des quatre coins du monde pour honorer la mémoire du Fondateur de la Mouridiyya.",
    categorie: "Mouridisme",
    auteur: "Ibrahima Mbacké Diop",
    datePublication: "15 mai 2026",
    tempsLecture: "8 min",
    imageEmoji: "🕌",
    imageGradient: "from-emerald-900 via-emerald-800 to-amber-900",
    alaUne: true,
    breaking: false,
    contenu: `
<p>Chaque année, à l'approche du 18 Safar du calendrier islamique, Touba se transforme. La Cité Sainte, fondée par Cheikh Ahmadou Bamba Mbacké en 1887, devient le centre du monde pour des millions de mourides venus du Sénégal, d'Afrique et de la diaspora mondiale. Le <strong>Grand Magal de Touba</strong> n'est pas simplement un pèlerinage — c'est une déclaration de foi, un acte d'allégeance spirituelle, et la plus grande manifestation religieuse d'Afrique de l'Ouest.</p>

<h2>L'histoire derrière le Magal</h2>
<p>Le Magal commémore le départ en exil de <strong>Cheikh Ahmadou Bamba</strong> au Gabon, ordonné par les autorités coloniales françaises en 1895. Ce départ, loin d'être vécu comme une défaite, est perçu par les mourides comme une consécration spirituelle — le Seigneur de Touba, <em>Serigne Touba</em>, avait tenu tête à l'Empire colonial par la seule force de sa foi et de sa poésie mystique.</p>

<p>Depuis la reconnaissance officielle du Magal en 1964 par le premier président sénégalais Léopold Sédar Senghor, l'événement n'a cessé de prendre de l'ampleur. Les estimations les plus récentes évoquent entre <strong>4 et 5 millions de pèlerins</strong> qui convergent vers Touba sur une période de deux à trois jours.</p>

<h2>Une organisation titanesque</h2>
<p>Le Khalife Général des Mourides, <strong>Serigne Mountakha Mbacké</strong>, préside les préparatifs avec l'ensemble des familles mourides et les autorités de l'État. Des milliers de camions de vivres, des milliers de bénévoles, et un dispositif sécuritaire exceptionnel sont mis en place pour accueillir les fidèles.</p>

<p>Les <em>Dahiras</em> — associations mourides présentes dans le monde entier — organisent des convois depuis Paris, New York, Barcelone, Dubaï ou encore Johannesburg. Chaque communauté arrive avec ses propres cuisines ambulantes, ses tentes et ses chants de <em>Khassaïde</em>, les poèmes sacrés du Cheikh.</p>

<h2>La Grande Mosquée au cœur du pèlerinage</h2>
<p>Point focal du Magal, la <strong>Grande Mosquée de Touba</strong> — dont le minaret de 87 mètres en fait l'un des plus hauts d'Afrique — accueille des centaines de milliers de fidèles pour les prières. Construite selon la volonté de Cheikh Ahmadou Bamba lui-même, agrandie par ses successeurs, la mosquée symbolise la grandeur et la pérennité de la Mouridiyya.</p>

<p>La <em>Ziyarra</em>, la visite spirituelle de la tombe du Fondateur située sous la coupole centrale, est le moment le plus sacré du pèlerinage. Des files de fidèles, certains en larmes, s'y succèdent toute la nuit pour se recueillir.</p>

<h2>Un impact économique considérable</h2>
<p>Le Magal représente également un événement économique majeur. Des milliards de francs CFA circulent pendant cette période, profitant aux commerçants de Touba, aux transporteurs, aux artisans et aux prestataires de services. La ville, qui compte plus d'un million d'habitants en temps normal, voit sa population multipliée par cinq pendant le Magal.</p>

<p>Le réseau d'eau, d'électricité et de télécommunication fait l'objet d'investissements constants de la part de l'État sénégalais pour garantir des conditions d'accueil dignes de cet événement mondial.</p>

<h2>Un message universel de paix</h2>
<p>Au-delà de la dimension spirituelle, le Magal de Touba est un symbole de <strong>paix, de tolérance et de fraternité</strong>. Dans une région sahélienne marquée par des tensions, Touba représente un modèle de cohésion sociale où des millions de personnes cohabitent pendant deux jours dans la sérénité et le partage.</p>

<p>Le message de Cheikh Ahmadou Bamba — <em>«&nbsp;Le travail est une forme d'adoration&nbsp;»</em> — résonne encore aujourd'hui dans chaque cœur mouride qui foule la terre de Touba lors de ce Magal historique.</p>
`,
  },
  {
    id: "2",
    slug: "serigne-mountakha-mbacke-khalife-general-vision-touba",
    titre: "Serigne Mountakha Mbacké : la vision d'un Khalife pour Touba et le Mouridisme mondial",
    sousTitre: "Le Guide des Mourides tracé depuis Touba un chemin de développement spirituel et matériel",
    extrait:
      "Depuis sa prise de fonction comme Khalife Général des Mourides, Serigne Mountakha Mbacké incarne une autorité spirituelle et morale qui dépasse les frontières du Sénégal pour toucher les communautés mourides des cinq continents.",
    categorie: "Mouridisme",
    auteur: "Fatou Diallo Kane",
    datePublication: "14 mai 2026",
    tempsLecture: "6 min",
    imageEmoji: "🌙",
    imageGradient: "from-amber-900 via-amber-800 to-emerald-900",
    alaUne: false,
    contenu: `
<p>Le <strong>Khalife Général des Mourides</strong> est bien plus qu'un chef religieux. Il est le successeur spirituel de Cheikh Ahmadou Bamba Mbacké, le garant des valeurs du travail, de la piété et de la fraternité qui fondent l'identité de la Mouridiyya. <strong>Serigne Mountakha Mbacké</strong>, actuellement à la tête de la confrérie, est le 8e Khalife depuis la fondation de la Mouridiyya.</p>

<h2>Une autorité qui transcende les frontières</h2>
<p>La parole du Khalife Général est écoutée avec une attention particulière non seulement au Sénégal, mais dans toutes les communautés mourides à travers le monde. Des États-Unis à la France, de l'Italie à l'Espagne, les Dahiras transmettent en temps réel ses messages et ses directives.</p>

<p>Les <em>Ndigël</em> — orientations données par le Khalife — portent sur la spiritualité, mais aussi sur des questions de citoyenneté, de participation civique et de développement économique. Le vote, la paix sociale, l'éducation : rien n'échappe à la vision holistique du Khalife.</p>

<h2>Touba : une ville en pleine transformation</h2>
<p>Sous l'impulsion du Khalife, Touba continue son développement infrastructurel à un rythme soutenu. Les projets d'extension de la Grande Mosquée, les nouvelles routes, les établissements d'enseignement coranique (Daara) modernisés : la cité sainte évolue tout en préservant son essence spirituelle.</p>

<p>Le <strong>Daara Serigne Touba</strong>, avec ses milliers d'élèves qui mémorisent le Coran et apprennent les Khassaïdes du Fondateur, reste le symbole de l'attachement à la transmission de l'héritage mouride aux nouvelles générations.</p>
`,
  },
  {
    id: "3",
    slug: "senegal-election-presidentielle-bilan-premier-ministre",
    titre: "Sénégal : le bilan des 100 premiers jours du gouvernement fait débat à l'Assemblée nationale",
    sousTitre: "L'opposition interpelle l'exécutif sur les promesses de campagne et les résultats économiques",
    extrait:
      "Cent jours après la formation du nouveau gouvernement, les députés sénégalais ont engagé un vif débat sur les résultats obtenus, notamment en matière de coût de la vie, d'emploi des jeunes et de gouvernance.",
    categorie: "Sénégal",
    auteur: "Moussa Thiaw",
    datePublication: "13 mai 2026",
    tempsLecture: "5 min",
    imageEmoji: "🇸🇳",
    imageGradient: "from-green-900 via-green-800 to-yellow-900",
    alaUne: false,
    breaking: true,
    contenu: `
<p>L'Assemblée nationale du Sénégal a été le théâtre, cette semaine, de débats houleux autour du bilan des <strong>100 premiers jours du gouvernement</strong>. L'opposition, regroupée autour de plusieurs groupes parlementaires, a pointé du doigt les difficultés persistantes que connaissent les Sénégalais au quotidien.</p>

<h2>Le coût de la vie au centre des préoccupations</h2>
<p>Le prix des denrées alimentaires de base — riz, huile, sucre — reste élevé selon les représentants de l'opposition. Plusieurs députés ont cité des témoignages de leurs électeurs de Dakar, Saint-Louis, Ziguinchor et de l'intérieur du pays.</p>

<p>Le gouvernement, par la voix du <strong>Premier Ministre</strong>, a défendu les mesures prises pour stabiliser les prix, notamment les subventions sur certains produits essentiels et les négociations en cours avec les fournisseurs.</p>

<h2>L'emploi des jeunes : une priorité réaffirmée</h2>
<p>Avec plus de <strong>60% de la population âgée de moins de 35 ans</strong>, le Sénégal fait face à un défi démographique considérable. La création d'emplois, en particulier dans les secteurs du numérique, de l'agriculture et de la pêche, a été présentée comme une priorité absolue.</p>

<p>Le programme <em>Emploi Jeunes</em>, lancé en début d'année, a déjà permis selon le gouvernement de créer plusieurs milliers d'emplois directs et indirects dans diverses régions du pays.</p>
`,
  },
  {
    id: "4",
    slug: "coupe-afrique-nations-2027-senegal-preparation",
    titre: "CAN 2027 : le Sénégal champion en titre prépare sa défense dans une ambiance de ferveur nationale",
    sousTitre: "Les Lions de la Téranga peaufinent leur stratégie pour conserver le trophée continental",
    extrait:
      "Deux ans après leur sacre historique, les Lions de la Téranga reprennent leurs entraînements sous les ordres du sélectionneur avec l'ambition de conserver leur titre à la Coupe d'Afrique des Nations 2027.",
    categorie: "Sport",
    auteur: "Pape Demba Sarr",
    datePublication: "12 mai 2026",
    tempsLecture: "4 min",
    imageEmoji: "🦁",
    imageGradient: "from-red-900 via-red-800 to-green-900",
    alaUne: false,
    contenu: `
<p>La <strong>Fédération Sénégalaise de Football (FSF)</strong> a annoncé le calendrier de préparation des <em>Lions de la Téranga</em> pour la CAN 2027. Après leur sacre lors de la précédente édition, les joueurs sénégalais abordent cette nouvelle compétition avec la pression du tenant du titre.</p>

<h2>Un groupe expérimenté mais renouvelé</h2>
<p>Le sélectionneur a convoqué un groupe mêlant des joueurs expérimentés et de jeunes talents issus du football sénégalais local et de la diaspora. Les clubs européens ont fourni une nouvelle génération de joueurs formés à l'étranger mais profondément attachés au maillot national.</p>

<h2>Les matchs de préparation</h2>
<p>Plusieurs matchs amicaux sont programmés contre des adversaires africains et européens pour tester les combinaisons tactiques et affiner le schéma de jeu. Le staff technique mise sur une approche physique et technique adaptée aux conditions climatiques du pays hôte.</p>
`,
  },
  {
    id: "5",
    slug: "touba-infrastructure-extension-grande-mosquee-2026",
    titre: "Touba : l'extension de la Grande Mosquée franchit une nouvelle étape historique",
    sousTitre: "Les travaux du cinquième minaret avancent sous la supervision directe du Khalife Général",
    extrait:
      "La Grande Mosquée de Touba, joyau de l'architecture islamique en Afrique de l'Ouest, s'agrandit encore pour accueillir dignement les millions de fidèles qui convergent chaque année vers la Cité Sainte.",
    categorie: "Touba",
    auteur: "Serigne Fallou Mbacké Jr",
    datePublication: "11 mai 2026",
    tempsLecture: "5 min",
    imageEmoji: "🕌",
    imageGradient: "from-amber-900 via-stone-800 to-emerald-950",
    alaUne: false,
    contenu: `
<p>La <strong>Grande Mosquée de Touba</strong> est bien plus qu'un lieu de culte : elle est le symbole vivant de la foi mouride et de la volonté de Cheikh Ahmadou Bamba de doter l'Afrique de l'Ouest d'un centre spirituel de rayonnement mondial. Depuis sa première construction, initiée du vivant du Fondateur, la mosquée n'a cessé de s'agrandir sous l'impulsion des successeurs du Cheikh.</p>

<h2>Un chantier permanent, une foi inébranlable</h2>
<p>Les travaux en cours concernent l'extension des galeries de prière, l'amélioration du système de climatisation et d'acoustique, ainsi que la construction d'espaces d'accueil pour les pèlerins lors du Grand Magal. Des ingénieurs sénégalais et étrangers collaborent sur ce chantier exceptionnel.</p>

<h2>La bibliothèque Serigne Touba</h2>
<p>Un projet phare accompagnant l'extension est la création d'une grande bibliothèque dédiée à la conservation et à la numérisation des manuscrits de Cheikh Ahmadou Bamba. Des milliers de <em>Khassaïdes</em> manuscrits, certains vieux de plus d'un siècle, seront préservés pour les générations futures.</p>

<p>Cette bibliothèque, qui devrait accueillir des chercheurs du monde entier, positionnera Touba comme un centre académique du savoir islamique soufi en Afrique.</p>
`,
  },
  {
    id: "6",
    slug: "diaspora-mouride-new-york-dahira-journee-cheikh-bamba",
    titre: "New York célèbre Cheikh Ahmadou Bamba : la diaspora mouride en marche dans Manhattan",
    sousTitre: "Des milliers de mourides ont défilé dans les rues de New York pour la Journée annuelle du Cheikh",
    extrait:
      "La communauté mouride de New York a organisé sa traditionnelle marche annuelle en l'honneur de Cheikh Ahmadou Bamba, rassemblant des milliers de fidèles venus de tous les États-Unis et du Canada.",
    categorie: "Mouridisme",
    auteur: "Aminata Sy Ndiaye",
    datePublication: "10 mai 2026",
    tempsLecture: "4 min",
    imageEmoji: "🗽",
    imageGradient: "from-blue-900 via-emerald-900 to-amber-900",
    alaUne: false,
    contenu: `
<p>Chaque année, les rues de <strong>Harlem et Midtown Manhattan</strong> résonnent des chants de <em>Khassaïde</em> et des couleurs blanche et verte du mouridisme. La <strong>Journée de Cheikh Ahmadou Bamba</strong>, officiellement reconnue par la ville de New York depuis les années 1990, est devenue l'un des événements culturels et religieux les plus importants de la diaspora africaine aux États-Unis.</p>

<h2>Une marche qui dépasse les frontières</h2>
<p>Cette année, la marche a réuni des représentants de Dahiras venus de Boston, Philadelphie, Atlanta, Chicago, Houston et Toronto. Des délégations d'Europe — Paris, Milan, Madrid — ont spécialement fait le déplacement pour participer à cet événement emblématique.</p>

<p>La marche commence toujours par des prières collectives, suivies d'un défilé coloré où dominent les portraits du Fondateur et les bannières des différentes familles mourides. Des conférences et des expositions culturelles complètent la journée.</p>

<h2>Ambassadeurs de la paix</h2>
<p>Les élus new-yorkais participent régulièrement à cet événement, soulignant la contribution de la communauté sénégalaise mouride à la vie économique et sociale de la ville. Des centaines de commerçants, artisans et entrepreneurs mourides sont établis à New York depuis les années 1980.</p>
`,
  },
  {
    id: "7",
    slug: "afrique-sommet-union-africaine-developpement-durable",
    titre: "Sommet de l'Union Africaine : les chefs d'État s'accordent sur un plan de développement durable 2030",
    sousTitre: "Addis-Abeba a accueilli des décisions historiques sur l'énergie, l'agriculture et la jeunesse",
    extrait:
      "Les 55 États membres de l'Union Africaine ont adopté un plan continental ambitieux pour accélérer la transition énergétique, renforcer la sécurité alimentaire et créer des millions d'emplois pour la jeunesse africaine.",
    categorie: "Afrique",
    auteur: "Cheikh Omar Fall",
    datePublication: "9 mai 2026",
    tempsLecture: "6 min",
    imageEmoji: "🌍",
    imageGradient: "from-orange-900 via-yellow-900 to-green-900",
    alaUne: false,
    contenu: `
<p>Le <strong>Sommet extraordinaire de l'Union Africaine</strong> tenu à Addis-Abeba a marqué un tournant dans la politique continentale de développement. Les 55 chefs d'État et de gouvernement membres ont adopté à l'unanimité le <em>Plan Africa 2030</em>, un document programmatique qui engage le continent sur la voie d'un développement accéléré et durable.</p>

<h2>L'énergie au centre des priorités</h2>
<p>L'Afrique dispose de ressources renouvelables — solaire, éolien, hydraulique — parmi les plus importantes au monde. Le plan prévoit d'atteindre <strong>100% d'électricité renouvelable</strong> dans les zones urbaines d'ici 2030, et d'étendre l'accès à l'électricité à 95% de la population rurale.</p>

<h2>Sécurité alimentaire et agriculture</h2>
<p>Face aux défis posés par le changement climatique, le sommet a adopté des mesures concrètes pour moderniser l'agriculture africaine, développer les systèmes d'irrigation et créer des chaînes de valeur agro-alimentaires intégrées.</p>

<p>Le Sénégal, représenté par le Président de la République, a particulièrement plaidé pour le développement du corridor agricole dans la vallée du fleuve Sénégal, qui pourrait nourrir des millions de personnes en Afrique de l'Ouest.</p>
`,
  },
  {
    id: "8",
    slug: "economie-senegal-petrole-gaz-retombees-populations",
    titre: "Pétrole et gaz : le Sénégal entre dans l'ère des hydrocarbures, quelles retombées pour les populations ?",
    sousTitre: "Les premières productions commerciales soulèvent des questions sur la distribution équitable des revenus",
    extrait:
      "Avec le démarrage de la production pétrolière et gazière, le Sénégal entre dans une nouvelle ère économique. Mais les populations, notamment les plus vulnérables, attendent des preuves concrètes que cette manne profitera à tous.",
    categorie: "Économie",
    auteur: "Ndèye Fatou Dieng",
    datePublication: "8 mai 2026",
    tempsLecture: "7 min",
    imageEmoji: "⛽",
    imageGradient: "from-purple-900 via-slate-800 to-emerald-900",
    alaUne: false,
    contenu: `
<p>Le Sénégal est désormais un pays producteur d'hydrocarbures. Cette réalité, longtemps attendue, soulève autant d'espoirs que de questions légitimes sur la gestion des revenus pétroliers et gaziers, et sur leur redistribution au profit des populations.</p>

<h2>Les chiffres de la production</h2>
<p>Les gisements de <strong>Sangomar</strong> (pétrole) et de <strong>Grand Tortue Ahmeyim</strong> (gaz naturel liquéfié, en partenariat avec la Mauritanie) représentent des réserves significatives estimées à plusieurs milliards de barils équivalent pétrole.</p>

<p>Les revenus attendus se chiffrent en centaines de milliards de francs CFA par an, ce qui pourrait transformer radicalement les finances publiques sénégalaises et financer des infrastructures majeures.</p>

<h2>Le fonds souverain : garantie pour les générations futures</h2>
<p>La loi sur le partage des revenus pétroliers, adoptée par l'Assemblée nationale, prévoit la création d'un fonds souverain intergénérationnel. Une partie des revenus sera consacrée au développement immédiat, une autre sera épargnée pour les générations futures.</p>

<p>Des organisations de la société civile surveillent de près l'application de ces dispositions, rappelant les exemples africains où la malédiction des ressources a appauvri des pays pourtant riches en matières premières.</p>
`,
  },
  {
    id: "9",
    slug: "international-intelligence-artificielle-afrique-opportunites",
    titre: "Intelligence Artificielle : l'Afrique peut-elle devenir un acteur mondial de l'IA d'ici 2030 ?",
    sousTitre: "Des startups africaines et des investisseurs internationaux misent sur le potentiel technologique du continent",
    extrait:
      "Alors que l'intelligence artificielle redéfinit l'économie mondiale, des voix de plus en plus nombreuses défendent l'idée que l'Afrique a les atouts pour ne pas rater ce tournant technologique historique.",
    categorie: "International",
    auteur: "Babacar Ndiaye Tech",
    datePublication: "7 mai 2026",
    tempsLecture: "5 min",
    imageEmoji: "🤖",
    imageGradient: "from-blue-900 via-indigo-900 to-slate-900",
    alaUne: false,
    contenu: `
<p>L'<strong>intelligence artificielle</strong> est en train de remodeler les économies mondiales à une vitesse sans précédent. Selon les experts, les pays qui maîtriseront cette technologie dans les prochaines années bénéficieront d'avantages concurrentiels déterminants pour les décennies à venir. L'Afrique, longtemps exclue des grandes révolutions technologiques, se trouve aujourd'hui à un carrefour historique.</p>

<h2>Les atouts méconnus du continent</h2>
<p>L'Afrique dispose d'atouts souvent sous-estimés dans la course à l'IA : une population jeune et de plus en plus connectée, des données linguistiques et culturelles encore peu exploitées par les grands modèles occidentaux, et un écosystème de startups en pleine effervescence.</p>

<p>Des hubs technologiques à Dakar, Lagos, Nairobi et Le Cap produisent des solutions d'IA adaptées aux réalités locales — agriculture intelligente, santé connectée, fintech mobile.</p>

<h2>Le Sénégal dans la course</h2>
<p>Le Sénégal a lancé sa <em>Stratégie Nationale d'Intelligence Artificielle</em>, avec des investissements dans la formation d'ingénieurs spécialisés et la création d'un centre d'excellence IA à Dakar. Des partenariats avec des universités européennes et américaines permettront de former une nouvelle génération de talents africains de l'IA.</p>
`,
  },
  {
    id: "10",
    slug: "culture-sabar-patrimoine-senegal-unesco",
    titre: "Le Sabar sénégalais candidat au patrimoine immatériel de l'UNESCO",
    sousTitre: "La danse et la musique du Sabar, symboles de l'identité wolof, méritent une reconnaissance mondiale",
    extrait:
      "Le Sénégal a officiellement soumis le dossier de candidature du Sabar — tambour rituel et danse emblématique — à la liste du patrimoine culturel immatériel de l'UNESCO, une reconnaissance qui sacraliserait cette tradition millénaire.",
    categorie: "Culture",
    auteur: "Mariama Diouf",
    datePublication: "6 mai 2026",
    tempsLecture: "4 min",
    imageEmoji: "🥁",
    imageGradient: "from-pink-900 via-rose-900 to-orange-900",
    alaUne: false,
    contenu: `
<p>Le <strong>Sabar</strong> est bien plus qu'un simple tambour. C'est le langage secret du Sénégal, la voix de la célébration, du deuil, de la fête et de la résistance. La candidature officielle du Sabar à l'UNESCO représente une reconnaissance historique pour la culture sénégalaise.</p>

<h2>Une tradition millénaire</h2>
<p>Le Sabar est au cœur de la culture wolof depuis des siècles. Chaque rythme — le Ceebu Jën, le Gëwël, le Kaolack — raconte une histoire, célèbre un événement, convoque les esprits ou annonce une naissance. Les griots, gardiens de cette tradition, transmettent leur art de génération en génération.</p>

<h2>Un dossier solide</h2>
<p>Le ministère sénégalais de la Culture a travaillé pendant plusieurs années à la constitution d'un dossier documentaire complet : archives vidéo, entretiens avec les maîtres-tambourinaires, études ethnomusicologiques et cartographie des pratiques régionales.</p>

<p>Si la candidature aboutit, le Sabar rejoindrait d'autres patrimoines africains déjà inscrits sur la liste UNESCO, comme le Gnawa du Maroc ou le Khoomei de Mongolie pour la musique.</p>
`,
  },
  {
    id: "11",
    slug: "khassaides-cheikh-ahmadou-bamba-traduction-mondiale",
    titre: "Les Khassaïdes de Cheikh Ahmadou Bamba traduits en 12 langues : un rayonnement universel",
    sousTitre: "Une initiative internationale vise à rendre accessibles les poèmes mystiques du Fondateur de la Mouridiyya",
    extrait:
      "Un collectif d'universitaires et de chercheurs mourides du monde entier travaille à la traduction et à la diffusion des Khassaïdes, les œuvres poétiques et spirituelles de Cheikh Ahmadou Bamba, dans une douzaine de langues.",
    categorie: "Mouridisme",
    auteur: "Prof. Abdou Lahad Mbacké",
    datePublication: "5 mai 2026",
    tempsLecture: "5 min",
    imageEmoji: "📖",
    imageGradient: "from-emerald-900 via-teal-900 to-amber-900",
    alaUne: false,
    contenu: `
<p>Les <strong>Khassaïdes</strong> — du wolof <em>Xasaay</em>, signifiant «&nbsp;poème&nbsp;» — constituent l'œuvre littéraire et spirituelle majeure de Cheikh Ahmadou Bamba Mbacké. Composés principalement en arabe classique, avec des influences du peul et du wolof, ces poèmes mystiques sont récités quotidiennement par des millions de mourides à travers le monde.</p>

<h2>Un trésor littéraire reconnu</h2>
<p>Des islamologues et des orientalistes non-mourides ont reconnu la valeur littéraire exceptionnelle des Khassaïdes. Leur richesse métaphorique, leur profondeur théologique et leur beauté formelle les placent parmi les grandes œuvres de la poésie islamique du 19e et 20e siècle.</p>

<p>Le Cheikh a produit une œuvre estimée à plus de <strong>80 000 vers</strong> pendant sa vie, dont une grande partie composée dans des conditions d'exil et d'emprisonnement par les autorités coloniales.</p>

<h2>Le projet de traduction</h2>
<p>Le collectif international, coordonné depuis l'Université de Dakar, travaille sur des traductions en français, anglais, espagnol, portugais, arabe dialectal, haoussa, swahili, mandingue, peul, bambara, italien et allemand.</p>

<p>Chaque traduction est accompagnée d'un commentaire exégétique permettant aux non-initiés de comprendre les références coraniques, les allusions soufies et les subtilités de la pensée du Cheikh. Un site web multilingue sera lancé pour diffuser ces traductions librement.</p>
`,
  },
  {
    id: "12",
    slug: "touba-eau-potable-projet-hydraulique-communaute",
    titre: "Touba : un projet hydraulique d'envergure pour garantir l'eau potable à toute la Cité Sainte",
    sousTitre: "Avec une population en constante expansion, Touba investit massivement dans ses infrastructures d'eau",
    extrait:
      "Face à la croissance démographique rapide de Touba et aux besoins exponentiels lors du Grand Magal, les autorités religieuses et l'État sénégalais conjuguent leurs efforts pour garantir l'accès à l'eau potable.",
    categorie: "Touba",
    auteur: "Samba Guèye",
    datePublication: "4 mai 2026",
    tempsLecture: "4 min",
    imageEmoji: "💧",
    imageGradient: "from-cyan-900 via-blue-900 to-emerald-900",
    alaUne: false,
    contenu: `
<p>Touba est l'une des villes africaines à la croissance la plus rapide. Avec une population permanente qui dépasse le million d'habitants et des pics à plusieurs millions lors du Grand Magal, les besoins en eau potable représentent un défi logistique et technique de premier ordre.</p>

<h2>Un nouveau réseau hydraulique</h2>
<p>Le projet en cours, financé conjointement par l'État sénégalais, des partenaires internationaux et les contributions de la communauté mouride, prévoit la construction de nouveaux forages profonds, de châteaux d'eau supplémentaires et l'extension du réseau de distribution.</p>

<p>Des technologies modernes de traitement et de purification de l'eau sont intégrées dans ce projet pour garantir des normes sanitaires élevées.</p>

<h2>La gestion communautaire de l'eau</h2>
<p>Une des spécificités de Touba est la gestion communautaire de nombreux services, dont l'eau. Des associations de quartier, sous la supervision des autorités religieuses, assurent la distribution et l'entretien des infrastructures dans de nombreux secteurs de la ville.</p>

<p>Ce modèle de gestion participative, souvent cité en exemple, a permis à Touba de développer une culture de responsabilité collective dans la gestion des ressources communes.</p>
`,
  },
  {
    id: "13",
    slug: "hizbut-tarqiyyah-milliard-renovation-grande-mosquee-touba-2026",
    titre: "Hizbut-Tarqiyyah remet 1 milliard FCFA pour la rénovation de la Grande Mosquée de Touba",
    sousTitre: "La daara mouride célèbre son cinquantenaire en offrant une hadiya historique au Khalife Général",
    extrait:
      "Dans un élan de ferveur spirituelle, le Dahira Hizbut-Tarqiyyah a remis ce samedi 16 mai 2026 une contribution d'un milliard de francs CFA au Khalife Général des Mourides, Serigne Mountakha Mbacké, pour les travaux de rénovation de la Grande Mosquée de Touba.",
    categorie: "Mouridisme",
    auteur: "Ibrahima Mbacké Diop",
    datePublication: "17 mai 2026",
    tempsLecture: "5 min",
    imageEmoji: "🕌",
    imageGradient: "from-emerald-900 via-teal-800 to-amber-900",
    alaUne: false,
    breaking: true,
    contenu: `<p>La <strong>Grande Ziara du Cinquantenaire de Hizbut-Tarqiyyah</strong> (1976-2026) a été marquée par un geste d'une générosité exceptionnelle. Ce samedi 16 mai 2026, à la résidence du Khalife Général à Touba Darou Minane, les responsables du Dahira ont remis une <strong>hadiya d'un milliard de francs CFA</strong> à Serigne Mountakha Mbacké pour soutenir les travaux de rénovation de la Grande Mosquée de Touba.</p><h2>Un cinquantenaire sous le signe du service</h2><p>Fondée en 1976 à l'Université Cheikh Anta Diop de Dakar sous le nom de Dahira des Étudiants Mourides (DEM), Hizbut-Tarqiyyah a choisi de marquer ses 50 ans d'existence par un acte concret de dévouement envers la cité sainte. La daara a mobilisé ses membres des cinq continents pour réunir cette somme historique.</p><h2>La réponse du Khalife</h2><p>Le Khalife Général des Mourides, <strong>Serigne Mountakha Mbacké</strong>, a chaleureusement salué l'engagement constant de Hizbut-Tarqiyyah. <em>"Vous êtes sur la voie tracée par le Cheikh"</em>, a-t-il lancé aux membres de l'organisation.</p>`,
  },
  {
    id: "14",
    slug: "cinquantenaire-hizbut-tarqiyyah-1976-2026-touba",
    titre: "Cinquantenaire de Hizbut-Tarqiyyah : 50 ans au service de Cheikh Ahmadou Bamba",
    sousTitre: "La daara mouride fondée par des étudiants célèbre un demi-siècle d'engagement spirituel et communautaire",
    extrait:
      "De 1976 à 2026, Hizbut-Tarqiyyah est passée d'un petit groupe d'étudiants mourides à l'Université de Dakar à un réseau mondial comptant des membres sur les cinq continents. Retour sur 50 ans d'histoire mouride.",
    categorie: "Mouridisme",
    auteur: "Fatou Diallo Kane",
    datePublication: "17 mai 2026",
    tempsLecture: "6 min",
    imageEmoji: "🌙",
    imageGradient: "from-amber-900 via-emerald-900 to-teal-900",
    alaUne: false,
    breaking: false,
    contenu: `<p>Le <strong>16 mai 2026</strong> restera gravé dans l'histoire du mouridisme comme le jour où Hizbut-Tarqiyyah a célébré ses cinquante ans d'existence avec une Grande Ziara à la résidence du Khalife Général à Touba Darou Minane.</p><h2>Des origines estudiantines</h2><p>Tout a commencé en <strong>1976 à l'Université Cheikh Anta Diop de Dakar</strong>, lorsqu'un groupe d'étudiants mourides décide de créer un dahira pour perpétuer les valeurs du mouridisme dans le milieu académique. Sous l'impulsion de son responsable moral historique, <strong>Serigne Atou Diagne</strong>, la daara a progressivement élargi son audience.</p><h2>Un rayonnement mondial</h2><p>Aujourd'hui, Hizbut-Tarqiyyah est présente dans plus de trente pays à travers le monde. Des sections actives fonctionnent en Europe, en Amérique du Nord et dans toute l'Afrique subsaharienne.</p>`,
  },
  {
    id: "15",
    slug: "deces-serigne-touba-mbacke-fils-serigne-modou-mbacke-yoni",
    titre: "Touba en deuil : rappel à Dieu de Serigne Touba Mbacké, fils de Serigne Modou Mbacké Yoni",
    sousTitre: "La communauté mouride pleure la disparition d'un érudit de l'Islam, héritier de la lignée Khadim Rassoul",
    extrait:
      "La communauté mouride est endeuillée par le rappel à Dieu de Serigne Touba Mbacké, fils de Serigne Modou Mbacké Yoni Ibn Khadim Rassoul. Cet érudit de l'Islam a consacré sa vie à l'enseignement du Coran et à la transmission des valeurs de la Mouridiyya.",
    categorie: "Mouridisme",
    auteur: "Moussa Thiaw",
    datePublication: "17 mai 2026",
    tempsLecture: "4 min",
    imageEmoji: "🤲",
    imageGradient: "from-slate-900 via-emerald-950 to-amber-950",
    alaUne: false,
    breaking: true,
    contenu: `<p>La communauté mouride est en deuil. <strong>Serigne Touba Mbacké</strong>, fils de Serigne Modou Mbacké Yoni Ibn Khadim Rassoul, a été rappelé à la Miséricorde divine. La nouvelle de son rappel à Dieu a suscité une vague d'émotion et de tristesse au sein de la famille mouride au Sénégal et dans la diaspora.</p><h2>Un héritier de la lignée sacrée</h2><p>Descendant direct de <strong>Cheikh Ahmadou Bamba Mbacké</strong>, le Fondateur de la Mouridiyya, Serigne Touba Mbacké était un dépositaire de l'héritage spirituel et intellectuel du mouridisme. Érudit reconnu, il s'était consacré toute sa vie à l'enseignement des sciences islamiques et à l'encadrement des disciples.</p><h2>Prières et condoléances</h2><p>Des milliers de fidèles à travers le monde ont exprimé leurs condoléances. <em>Inna lillahi wa inna ilayhi raji'un</em> — Nous venons de Dieu et à Lui nous retournons.</p>`,
  },
];

export function getArticleInfoBySlug(slug: string): ArticleInfo | undefined {
  return ARTICLES_INFO.find((a) => a.slug === slug);
}

export function getArticlesInfoSimilaires(article: ArticleInfo): ArticleInfo[] {
  return ARTICLES_INFO.filter(
    (a) => a.id !== article.id && a.categorie === article.categorie
  ).slice(0, 3);
}

export function getArticlesInfoByCategorie(categorie: CategorieInfo): ArticleInfo[] {
  return ARTICLES_INFO.filter((a) => a.categorie === categorie);
}
