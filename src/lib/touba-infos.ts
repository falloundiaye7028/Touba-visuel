// ============================================================================
//  TOUBA INFOS — Couche de données (contenus de démonstration)
//  Média numérique : Touba • Sénégal • Afrique • Monde
//  NB : contenus de DÉMONSTRATION réalistes — ne pas présenter comme réels.
// ============================================================================

export type CategorieInfo =
  | "Touba"
  | "Sénégal"
  | "Politique"
  | "Société"
  | "Économie"
  | "Religion"
  | "Magal"
  | "Afrique"
  | "International"
  | "Sport"
  | "Culture"
  | "Santé"
  | "Éducation"
  | "Environnement"
  | "Diaspora"
  | "Technologies";

export type GenreInfo =
  | "Actualité"
  | "Interview"
  | "Analyse"
  | "Tribune"
  | "Reportage"
  | "Communiqué"
  | "Vidéo";

/** Statut éditorial (workflow). Un article sans statut est considéré publié. */
export type StatutInfo = "brouillon" | "publie" | "programme";

export const GENRES_INFO: GenreInfo[] = [
  "Actualité",
  "Interview",
  "Analyse",
  "Tribune",
  "Reportage",
  "Communiqué",
  "Vidéo",
];

export interface AuteurInfo {
  slug: string;
  nom: string;
  role: string;
  bio: string;
  initiales: string;
}

export interface ArticleInfo {
  id: string;
  slug: string;
  titre: string;
  sousTitre: string;
  extrait: string;
  categorie: CategorieInfo;
  genre: GenreInfo;
  /** Statut éditorial. Absent = publié (contenus de démonstration). */
  statut?: StatutInfo;
  auteur: string;
  /** ISO 8601 — sert au SEO (datePublished) et au tri */
  date: string;
  /** Mise à jour éventuelle (ISO) */
  miseAJour?: string;
  tempsLecture: string;
  imageEmoji: string;
  imageGradient: string;
  /** Photo réelle si disponible (sinon tuile éditoriale) */
  imageUrl?: string;
  credit?: string;
  legende?: string;
  alaUne: boolean;
  breaking?: boolean;
  epingle?: boolean;
  vues: number;
  tags: string[];
  contenu: string;
  /** Pour les contenus vidéo — id YouTube éventuel */
  youtubeId?: string;
}

export interface VideoInfo {
  id: string;
  slug: string;
  titre: string;
  categorie: CategorieInfo;
  duree: string;
  date: string;
  imageEmoji: string;
  imageGradient: string;
  youtubeId?: string;
  description: string;
}

// ── Rubriques principales (ordre de navigation) ───────────────────────────
export const CATEGORIES_INFO: CategorieInfo[] = [
  "Touba",
  "Sénégal",
  "Politique",
  "Société",
  "Économie",
  "Religion",
  "Magal",
  "Afrique",
  "International",
  "Sport",
  "Culture",
];

export const CATEGORIES_PLUS: CategorieInfo[] = [
  "Santé",
  "Éducation",
  "Environnement",
  "Diaspora",
  "Technologies",
];

// ── Couleurs des rubriques (chips clairs, sobres) ─────────────────────────
export const COULEURS_CATEGORIES: Record<CategorieInfo, string> = {
  Touba: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  Sénégal: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  Politique: "bg-slate-100 text-slate-700 ring-1 ring-slate-600/15",
  Société: "bg-teal-50 text-teal-700 ring-1 ring-teal-600/20",
  Économie: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  Religion: "bg-green-100 text-green-800 ring-1 ring-green-700/20",
  Magal: "bg-green-600 text-white",
  Afrique: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20",
  International: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  Sport: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  Culture: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-600/20",
  Santé: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
  Éducation: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20",
  Environnement: "bg-lime-50 text-lime-700 ring-1 ring-lime-600/20",
  Diaspora: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/20",
  Technologies: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20",
};

export const EMOJI_CATEGORIES: Record<CategorieInfo, string> = {
  Touba: "🕌",
  Sénégal: "🇸🇳",
  Politique: "🏛️",
  Société: "👥",
  Économie: "📈",
  Religion: "🌙",
  Magal: "🕌",
  Afrique: "🌍",
  International: "🌐",
  Sport: "🏆",
  Culture: "🎭",
  Santé: "🩺",
  Éducation: "🎓",
  Environnement: "🌱",
  Diaspora: "✈️",
  Technologies: "💡",
};

// ── Slugs de rubriques (URLs propres) ─────────────────────────────────────
const SLUG_MAP: Record<CategorieInfo, string> = {
  Touba: "touba",
  Sénégal: "senegal",
  Politique: "politique",
  Société: "societe",
  Économie: "economie",
  Religion: "religion",
  Magal: "magal",
  Afrique: "afrique",
  International: "international",
  Sport: "sport",
  Culture: "culture",
  Santé: "sante",
  Éducation: "education",
  Environnement: "environnement",
  Diaspora: "diaspora",
  Technologies: "technologies",
};

export function slugCategorie(cat: CategorieInfo): string {
  return SLUG_MAP[cat];
}

export function categorieFromSlug(slug: string): CategorieInfo | undefined {
  return (Object.keys(SLUG_MAP) as CategorieInfo[]).find(
    (c) => SLUG_MAP[c] === slug,
  );
}

// ── Genres éditoriaux → slug ──────────────────────────────────────────────
const GENRE_SLUG: Partial<Record<GenreInfo, string>> = {
  Interview: "interviews",
  Analyse: "analyses",
  Tribune: "tribunes",
  Communiqué: "communiques",
  Reportage: "reportages",
};

export function genreFromSlug(slug: string): GenreInfo | undefined {
  const entry = (Object.keys(GENRE_SLUG) as GenreInfo[]).find(
    (g) => GENRE_SLUG[g] === slug,
  );
  return entry;
}

export const GENRE_LABEL_PLURIEL: Record<string, string> = {
  interviews: "Interviews",
  analyses: "Analyses",
  tribunes: "Tribunes",
  communiques: "Communiqués",
  reportages: "Reportages",
};

// ── Auteurs / contributeurs ───────────────────────────────────────────────
export const AUTEURS: AuteurInfo[] = [
  {
    slug: "ibrahima-mbacke-diop",
    nom: "Ibrahima Mbacké Diop",
    role: "Rédacteur en chef",
    bio: "Journaliste, spécialiste des questions religieuses et du fait mouride. Couvre Touba et le Grand Magal depuis plus de dix ans.",
    initiales: "IM",
  },
  {
    slug: "fatou-diallo-kane",
    nom: "Fatou Diallo Kane",
    role: "Grand reporter",
    bio: "Reportages de société, religion et diaspora. Passionnée par les récits de terrain.",
    initiales: "FK",
  },
  {
    slug: "moussa-thiaw",
    nom: "Moussa Thiaw",
    role: "Journaliste politique",
    bio: "Suit l'actualité institutionnelle, l'Assemblée nationale et la vie des partis.",
    initiales: "MT",
  },
  {
    slug: "ndeye-fatou-dieng",
    nom: "Ndèye Fatou Dieng",
    role: "Journaliste économique",
    bio: "Économie, énergie et entrepreneuriat. Décrypte les grands dossiers financiers du Sénégal.",
    initiales: "ND",
  },
  {
    slug: "pape-demba-sarr",
    nom: "Pape Demba Sarr",
    role: "Journaliste sportif",
    bio: "Football, Lions de la Téranga et sport national. Couvre les grandes compétitions africaines.",
    initiales: "PS",
  },
  {
    slug: "aminata-sy-ndiaye",
    nom: "Aminata Sy Ndiaye",
    role: "Correspondante diaspora",
    bio: "Basée entre Dakar et New York, elle suit les communautés sénégalaises à travers le monde.",
    initiales: "AS",
  },
  {
    slug: "cheikh-omar-fall",
    nom: "Cheikh Omar Fall",
    role: "Rédaction Afrique",
    bio: "Géopolitique africaine, Union africaine et intégration régionale.",
    initiales: "CF",
  },
  {
    slug: "mariama-diouf",
    nom: "Mariama Diouf",
    role: "Journaliste culture",
    bio: "Arts, patrimoine et musiques du Sénégal.",
    initiales: "MD",
  },
  {
    slug: "mamadou-falilou-ndiaye",
    nom: "Mamadou Falilou Ndiaye",
    role: "Président fondateur de Touba Ça Kanam",
    bio: "Acteur du développement territorial de Touba. Auteur de « Comment Touba peut-elle mieux profiter de l'économie du Magal ? » (Édition 2026), contribution au débat sur l'économie du Grand Magal, l'emploi des jeunes et la modernisation de l'action locale.",
    initiales: "MN",
  },
];

export function getAuteur(nom: string): AuteurInfo | undefined {
  return AUTEURS.find((a) => a.nom === nom);
}

// ── Articles (démonstration) ──────────────────────────────────────────────
export const ARTICLES_INFO: ArticleInfo[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1683490485928-e96b2e429836",
    slug: "grand-magal-touba-2026-millions-pelerins-ville-sainte",
    titre:
      "Grand Magal de Touba : des millions de pèlerins attendus dans la Cité Sainte",
    sousTitre:
      "La plus grande manifestation religieuse d'Afrique de l'Ouest se prépare dans un élan de ferveur historique.",
    extrait:
      "Le Grand Magal de Touba, commémoration du départ en exil de Cheikh Ahmadou Bamba, rassemble chaque année des millions de fidèles mourides venus des quatre coins du monde pour honorer la mémoire du Fondateur de la Mouridiyya.",
    categorie: "Magal",
    genre: "Actualité",
    auteur: "Ibrahima Mbacké Diop",
    date: "2026-08-10T09:30:00+00:00",
    tempsLecture: "8 min",
    imageEmoji: "🕌",
    imageGradient: "from-green-700 via-emerald-800 to-green-900",
    legende: "La Grande Mosquée de Touba, cœur du pèlerinage annuel.",
    credit: "Photo de démonstration",
    alaUne: false,
    epingle: true,
    vues: 48210,
    tags: ["Magal", "Touba", "Mouridisme", "Cheikh Ahmadou Bamba"],
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

<h2>Un impact économique considérable</h2>
<p>Le Magal représente également un événement économique majeur. Des milliards de francs CFA circulent pendant cette période, profitant aux commerçants de Touba, aux transporteurs, aux artisans et aux prestataires de services. La ville, qui compte plus d'un million d'habitants en temps normal, voit sa population multipliée par cinq pendant le Magal.</p>

<h2>Un message universel de paix</h2>
<p>Au-delà de la dimension spirituelle, le Magal de Touba est un symbole de <strong>paix, de tolérance et de fraternité</strong>. Le message de Cheikh Ahmadou Bamba — <em>«&nbsp;Le travail est une forme d'adoration&nbsp;»</em> — résonne encore aujourd'hui dans chaque cœur mouride qui foule la terre de Touba lors de ce Magal historique.</p>
`,
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae",
    credit: "Photo Unsplash",
    slug: "serigne-mountakha-mbacke-khalife-general-vision-touba",
    titre:
      "Serigne Mountakha Mbacké : la vision d'un Khalife pour Touba et le Mouridisme mondial",
    sousTitre:
      "Le Guide des Mourides trace depuis Touba un chemin de développement spirituel et matériel.",
    extrait:
      "Depuis sa prise de fonction comme Khalife Général des Mourides, Serigne Mountakha Mbacké incarne une autorité spirituelle et morale qui dépasse les frontières du Sénégal pour toucher les communautés mourides des cinq continents.",
    categorie: "Religion",
    genre: "Actualité",
    auteur: "Fatou Diallo Kane",
    date: "2026-08-08T14:00:00+00:00",
    tempsLecture: "6 min",
    imageEmoji: "🌙",
    imageGradient: "from-emerald-700 via-green-800 to-teal-900",
    alaUne: false,
    vues: 21870,
    tags: ["Mouridisme", "Khalife", "Touba"],
    contenu: `
<p>Le <strong>Khalife Général des Mourides</strong> est bien plus qu'un chef religieux. Il est le successeur spirituel de Cheikh Ahmadou Bamba Mbacké, le garant des valeurs du travail, de la piété et de la fraternité qui fondent l'identité de la Mouridiyya.</p>

<h2>Une autorité qui transcende les frontières</h2>
<p>La parole du Khalife Général est écoutée avec une attention particulière non seulement au Sénégal, mais dans toutes les communautés mourides à travers le monde. Des États-Unis à la France, de l'Italie à l'Espagne, les Dahiras transmettent en temps réel ses messages et ses directives.</p>

<h2>Touba : une ville en pleine transformation</h2>
<p>Sous l'impulsion du Khalife, Touba continue son développement infrastructurel à un rythme soutenu. Les projets d'extension de la Grande Mosquée, les nouvelles routes, les établissements d'enseignement coranique (Daara) modernisés : la cité sainte évolue tout en préservant son essence spirituelle.</p>
`,
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1768213022263-0414dc145dfd",
    credit: "Photo Unsplash",
    slug: "senegal-bilan-cent-jours-gouvernement-assemblee-nationale",
    titre:
      "Sénégal : le bilan des 100 premiers jours du gouvernement fait débat à l'Assemblée nationale",
    sousTitre:
      "L'opposition interpelle l'exécutif sur les promesses de campagne et les résultats économiques.",
    extrait:
      "Cent jours après la formation du nouveau gouvernement, les députés sénégalais ont engagé un vif débat sur les résultats obtenus, notamment en matière de coût de la vie, d'emploi des jeunes et de gouvernance.",
    categorie: "Politique",
    genre: "Actualité",
    auteur: "Moussa Thiaw",
    date: "2026-08-14T18:15:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "🏛️",
    imageGradient: "from-slate-700 via-slate-800 to-green-900",
    alaUne: false,
    breaking: true,
    vues: 33540,
    tags: ["Assemblée nationale", "Gouvernement", "Économie"],
    contenu: `
<p>L'Assemblée nationale du Sénégal a été le théâtre, cette semaine, de débats houleux autour du bilan des <strong>100 premiers jours du gouvernement</strong>. L'opposition, regroupée autour de plusieurs groupes parlementaires, a pointé du doigt les difficultés persistantes que connaissent les Sénégalais au quotidien.</p>

<h2>Le coût de la vie au centre des préoccupations</h2>
<p>Le prix des denrées alimentaires de base — riz, huile, sucre — reste élevé selon les représentants de l'opposition. Plusieurs députés ont cité des témoignages de leurs électeurs de Dakar, Saint-Louis, Ziguinchor et de l'intérieur du pays.</p>

<h2>L'emploi des jeunes : une priorité réaffirmée</h2>
<p>Avec plus de <strong>60&nbsp;% de la population âgée de moins de 35 ans</strong>, le Sénégal fait face à un défi démographique considérable. La création d'emplois, en particulier dans les secteurs du numérique, de l'agriculture et de la pêche, a été présentée comme une priorité absolue.</p>
`,
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9",
    credit: "Photo Unsplash",
    slug: "can-2027-senegal-champion-preparation-lions-teranga",
    titre:
      "CAN 2027 : le Sénégal champion en titre prépare sa défense dans une ferveur nationale",
    sousTitre:
      "Les Lions de la Téranga peaufinent leur stratégie pour conserver le trophée continental.",
    extrait:
      "Deux ans après leur sacre historique, les Lions de la Téranga reprennent leurs entraînements avec l'ambition de conserver leur titre à la Coupe d'Afrique des Nations 2027.",
    categorie: "Sport",
    genre: "Actualité",
    auteur: "Pape Demba Sarr",
    date: "2026-08-12T11:00:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🦁",
    imageGradient: "from-red-700 via-red-800 to-green-900",
    alaUne: false,
    vues: 27410,
    tags: ["CAN 2027", "Lions", "Football"],
    contenu: `
<p>La <strong>Fédération Sénégalaise de Football (FSF)</strong> a annoncé le calendrier de préparation des <em>Lions de la Téranga</em> pour la CAN 2027. Après leur sacre lors de la précédente édition, les joueurs sénégalais abordent cette nouvelle compétition avec la pression du tenant du titre.</p>

<h2>Un groupe expérimenté mais renouvelé</h2>
<p>Le sélectionneur a convoqué un groupe mêlant des joueurs expérimentés et de jeunes talents issus du football sénégalais local et de la diaspora.</p>

<h2>Les matchs de préparation</h2>
<p>Plusieurs matchs amicaux sont programmés contre des adversaires africains et européens pour tester les combinaisons tactiques et affiner le schéma de jeu.</p>
`,
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1603565671981-5d4986360d6a",
    credit: "Photo Unsplash",
    slug: "touba-extension-grande-mosquee-nouvelle-etape",
    titre:
      "Touba : l'extension de la Grande Mosquée franchit une nouvelle étape historique",
    sousTitre:
      "Les travaux avancent sous la supervision directe du Khalife Général.",
    extrait:
      "La Grande Mosquée de Touba, joyau de l'architecture islamique en Afrique de l'Ouest, s'agrandit encore pour accueillir dignement les millions de fidèles qui convergent chaque année vers la Cité Sainte.",
    categorie: "Touba",
    genre: "Actualité",
    auteur: "Ibrahima Mbacké Diop",
    date: "2026-08-11T08:45:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "🕌",
    imageGradient: "from-amber-700 via-stone-700 to-emerald-900",
    alaUne: false,
    vues: 18930,
    tags: ["Touba", "Infrastructures", "Grande Mosquée"],
    contenu: `
<p>La <strong>Grande Mosquée de Touba</strong> est bien plus qu'un lieu de culte : elle est le symbole vivant de la foi mouride et de la volonté de Cheikh Ahmadou Bamba de doter l'Afrique de l'Ouest d'un centre spirituel de rayonnement mondial.</p>

<h2>Un chantier permanent, une foi inébranlable</h2>
<p>Les travaux en cours concernent l'extension des galeries de prière, l'amélioration du système de climatisation et d'acoustique, ainsi que la construction d'espaces d'accueil pour les pèlerins lors du Grand Magal.</p>

<h2>La bibliothèque Serigne Touba</h2>
<p>Un projet phare accompagnant l'extension est la création d'une grande bibliothèque dédiée à la conservation et à la numérisation des manuscrits de Cheikh Ahmadou Bamba.</p>
`,
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1529776264670-2ed1e56cfe6b",
    credit: "Photo Unsplash",
    slug: "diaspora-mouride-new-york-marche-cheikh-ahmadou-bamba",
    titre:
      "New York célèbre Cheikh Ahmadou Bamba : la diaspora mouride en marche dans Manhattan",
    sousTitre:
      "Des milliers de mourides ont défilé dans les rues de New York pour la Journée annuelle du Cheikh.",
    extrait:
      "La communauté mouride de New York a organisé sa traditionnelle marche annuelle en l'honneur de Cheikh Ahmadou Bamba, rassemblant des milliers de fidèles venus de tous les États-Unis et du Canada.",
    categorie: "Diaspora",
    genre: "Reportage",
    auteur: "Aminata Sy Ndiaye",
    date: "2026-08-06T16:20:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🗽",
    imageGradient: "from-cyan-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 15420,
    tags: ["Diaspora", "New York", "Mouridisme"],
    contenu: `
<p>Chaque année, les rues de <strong>Harlem et Midtown Manhattan</strong> résonnent des chants de <em>Khassaïde</em> et des couleurs blanche et verte du mouridisme.</p>

<h2>Une marche qui dépasse les frontières</h2>
<p>Cette année, la marche a réuni des représentants de Dahiras venus de Boston, Philadelphie, Atlanta, Chicago, Houston et Toronto.</p>

<h2>Ambassadeurs de la paix</h2>
<p>Les élus new-yorkais participent régulièrement à cet événement, soulignant la contribution de la communauté sénégalaise mouride à la vie économique et sociale de la ville.</p>
`,
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    credit: "Photo Unsplash",
    slug: "union-africaine-plan-developpement-durable-2030",
    titre:
      "Sommet de l'Union africaine : les chefs d'État s'accordent sur un plan de développement durable 2030",
    sousTitre:
      "Addis-Abeba a accueilli des décisions sur l'énergie, l'agriculture et la jeunesse.",
    extrait:
      "Les 55 États membres de l'Union africaine ont adopté un plan continental ambitieux pour accélérer la transition énergétique, renforcer la sécurité alimentaire et créer des millions d'emplois pour la jeunesse africaine.",
    categorie: "Afrique",
    genre: "Actualité",
    auteur: "Cheikh Omar Fall",
    date: "2026-08-09T10:00:00+00:00",
    tempsLecture: "6 min",
    imageEmoji: "🌍",
    imageGradient: "from-orange-700 via-amber-800 to-green-900",
    alaUne: false,
    vues: 12980,
    tags: ["Union africaine", "Développement", "Énergie"],
    contenu: `
<p>Le <strong>Sommet extraordinaire de l'Union africaine</strong> tenu à Addis-Abeba a marqué un tournant dans la politique continentale de développement.</p>

<h2>L'énergie au centre des priorités</h2>
<p>Le plan prévoit d'atteindre <strong>100&nbsp;% d'électricité renouvelable</strong> dans les zones urbaines d'ici 2030, et d'étendre l'accès à l'électricité à 95&nbsp;% de la population rurale.</p>

<h2>Sécurité alimentaire et agriculture</h2>
<p>Le Sénégal a particulièrement plaidé pour le développement du corridor agricole dans la vallée du fleuve Sénégal, qui pourrait nourrir des millions de personnes en Afrique de l'Ouest.</p>
`,
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589",
    credit: "Photo Unsplash",
    slug: "senegal-petrole-gaz-retombees-populations",
    titre:
      "Pétrole et gaz : le Sénégal dans l'ère des hydrocarbures, quelles retombées pour les populations ?",
    sousTitre:
      "Les productions commerciales soulèvent des questions sur la distribution équitable des revenus.",
    extrait:
      "Avec la production pétrolière et gazière, le Sénégal entre dans une nouvelle ère économique. Mais les populations attendent des preuves concrètes que cette manne profitera à tous.",
    categorie: "Économie",
    genre: "Actualité",
    auteur: "Ndèye Fatou Dieng",
    date: "2026-08-07T09:00:00+00:00",
    tempsLecture: "7 min",
    imageEmoji: "⛽",
    imageGradient: "from-amber-700 via-slate-700 to-emerald-900",
    alaUne: false,
    vues: 20110,
    tags: ["Pétrole", "Gaz", "Sangomar", "Économie"],
    contenu: `
<p>Le Sénégal est désormais un pays producteur d'hydrocarbures. Cette réalité, longtemps attendue, soulève autant d'espoirs que de questions légitimes sur la gestion des revenus pétroliers et gaziers.</p>

<h2>Les chiffres de la production</h2>
<p>Les gisements de <strong>Sangomar</strong> (pétrole) et de <strong>Grand Tortue Ahmeyim</strong> (gaz naturel liquéfié) représentent des réserves significatives.</p>

<h2>Le fonds souverain : garantie pour les générations futures</h2>
<p>La loi sur le partage des revenus pétroliers prévoit la création d'un fonds souverain intergénérationnel.</p>
`,
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf",
    credit: "Photo Unsplash",
    slug: "intelligence-artificielle-afrique-acteur-mondial-2030",
    titre:
      "Intelligence artificielle : l'Afrique peut-elle devenir un acteur mondial de l'IA d'ici 2030 ?",
    sousTitre:
      "Des startups africaines et des investisseurs internationaux misent sur le potentiel technologique du continent.",
    extrait:
      "Alors que l'intelligence artificielle redéfinit l'économie mondiale, des voix de plus en plus nombreuses défendent l'idée que l'Afrique a les atouts pour ne pas rater ce tournant technologique historique.",
    categorie: "Technologies",
    genre: "Analyse",
    auteur: "Ndèye Fatou Dieng",
    date: "2026-08-05T13:00:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "🤖",
    imageGradient: "from-violet-700 via-indigo-800 to-slate-900",
    alaUne: false,
    vues: 9870,
    tags: ["IA", "Technologies", "Innovation"],
    contenu: `
<p>L'<strong>intelligence artificielle</strong> est en train de remodeler les économies mondiales à une vitesse sans précédent. L'Afrique, longtemps exclue des grandes révolutions technologiques, se trouve aujourd'hui à un carrefour historique.</p>

<h2>Les atouts méconnus du continent</h2>
<p>Une population jeune et de plus en plus connectée, des données linguistiques et culturelles encore peu exploitées, et un écosystème de startups en pleine effervescence.</p>

<h2>Le Sénégal dans la course</h2>
<p>Le Sénégal a lancé sa <em>Stratégie nationale d'intelligence artificielle</em>, avec des investissements dans la formation d'ingénieurs spécialisés.</p>
`,
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1523689119443-df96632084a1",
    credit: "Photo Unsplash",
    slug: "sabar-senegalais-candidat-patrimoine-unesco",
    titre:
      "Le Sabar sénégalais candidat au patrimoine immatériel de l'UNESCO",
    sousTitre:
      "La danse et la musique du Sabar, symboles de l'identité wolof, méritent une reconnaissance mondiale.",
    extrait:
      "Le Sénégal a officiellement soumis le dossier de candidature du Sabar — tambour rituel et danse emblématique — à la liste du patrimoine culturel immatériel de l'UNESCO.",
    categorie: "Culture",
    genre: "Actualité",
    auteur: "Mariama Diouf",
    date: "2026-08-04T15:30:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🥁",
    imageGradient: "from-fuchsia-700 via-rose-800 to-orange-900",
    alaUne: false,
    vues: 8450,
    tags: ["Sabar", "Culture", "UNESCO", "Patrimoine"],
    contenu: `
<p>Le <strong>Sabar</strong> est bien plus qu'un simple tambour. C'est le langage secret du Sénégal, la voix de la célébration, du deuil, de la fête et de la résistance.</p>

<h2>Une tradition millénaire</h2>
<p>Le Sabar est au cœur de la culture wolof depuis des siècles. Les griots, gardiens de cette tradition, transmettent leur art de génération en génération.</p>

<h2>Un dossier solide</h2>
<p>Le ministère de la Culture a travaillé pendant plusieurs années à la constitution d'un dossier documentaire complet.</p>
`,
  },
  {
    id: "11",
    imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53",
    credit: "Photo Unsplash",
    slug: "khassaides-cheikh-ahmadou-bamba-traduction-mondiale",
    titre:
      "Les Khassaïdes de Cheikh Ahmadou Bamba traduits en 12 langues : un rayonnement universel",
    sousTitre:
      "Une initiative internationale vise à rendre accessibles les poèmes mystiques du Fondateur de la Mouridiyya.",
    extrait:
      "Un collectif d'universitaires et de chercheurs mourides du monde entier travaille à la traduction et à la diffusion des Khassaïdes, les œuvres poétiques et spirituelles de Cheikh Ahmadou Bamba.",
    categorie: "Religion",
    genre: "Actualité",
    auteur: "Ibrahima Mbacké Diop",
    date: "2026-08-05T09:15:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "📖",
    imageGradient: "from-emerald-700 via-teal-800 to-green-900",
    alaUne: false,
    vues: 11230,
    tags: ["Khassaïdes", "Mouridisme", "Culture"],
    contenu: `
<p>Les <strong>Khassaïdes</strong> — du wolof <em>Xasaay</em>, signifiant «&nbsp;poème&nbsp;» — constituent l'œuvre littéraire et spirituelle majeure de Cheikh Ahmadou Bamba Mbacké.</p>

<h2>Un trésor littéraire reconnu</h2>
<p>Le Cheikh a produit une œuvre estimée à plus de <strong>80&nbsp;000 vers</strong> pendant sa vie, dont une grande partie composée dans des conditions d'exil.</p>

<h2>Le projet de traduction</h2>
<p>Le collectif international travaille sur des traductions en français, anglais, espagnol, portugais, arabe, haoussa, swahili, mandingue, peul, bambara, italien et allemand.</p>
`,
  },
  {
    id: "12",
    imageUrl: "https://images.unsplash.com/photo-1588011930968-eadac80e6a5a",
    credit: "Photo Unsplash",
    slug: "touba-projet-hydraulique-eau-potable-cite-sainte",
    titre:
      "Touba : un projet hydraulique d'envergure pour garantir l'eau potable à toute la Cité Sainte",
    sousTitre:
      "Avec une population en constante expansion, Touba investit massivement dans ses infrastructures d'eau.",
    extrait:
      "Face à la croissance démographique rapide de Touba et aux besoins exponentiels lors du Grand Magal, les autorités religieuses et l'État sénégalais conjuguent leurs efforts pour garantir l'accès à l'eau potable.",
    categorie: "Touba",
    genre: "Actualité",
    auteur: "Moussa Thiaw",
    date: "2026-08-03T10:40:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "💧",
    imageGradient: "from-cyan-700 via-sky-800 to-emerald-900",
    alaUne: false,
    vues: 7620,
    tags: ["Touba", "Eau", "Infrastructures"],
    contenu: `
<p>Touba est l'une des villes africaines à la croissance la plus rapide. Avec une population permanente qui dépasse le million d'habitants, les besoins en eau potable représentent un défi logistique et technique de premier ordre.</p>

<h2>Un nouveau réseau hydraulique</h2>
<p>Le projet prévoit la construction de nouveaux forages profonds, de châteaux d'eau supplémentaires et l'extension du réseau de distribution.</p>

<h2>La gestion communautaire de l'eau</h2>
<p>Une des spécificités de Touba est la gestion communautaire de nombreux services, dont l'eau, sous la supervision des autorités religieuses.</p>
`,
  },
  {
    id: "13",
    imageUrl: "https://images.unsplash.com/photo-1683490485928-e96b2e429836",
    credit: "Photo Unsplash",
    slug: "hizbut-tarqiyyah-milliard-renovation-grande-mosquee-touba",
    titre:
      "Hizbut-Tarqiyyah remet 1 milliard FCFA pour la rénovation de la Grande Mosquée de Touba",
    sousTitre:
      "La daara mouride célèbre son cinquantenaire en offrant une hadiya historique au Khalife Général.",
    extrait:
      "Dans un élan de ferveur spirituelle, le Dahira Hizbut-Tarqiyyah a remis une contribution d'un milliard de francs CFA au Khalife Général des Mourides pour les travaux de rénovation de la Grande Mosquée de Touba.",
    categorie: "Religion",
    genre: "Actualité",
    auteur: "Ibrahima Mbacké Diop",
    date: "2026-08-15T12:00:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "🕌",
    imageGradient: "from-emerald-700 via-teal-800 to-green-900",
    alaUne: false,
    breaking: true,
    vues: 41200,
    tags: ["Hizbut-Tarqiyyah", "Touba", "Mouridisme"],
    contenu: `
<p>La <strong>Grande Ziara du Cinquantenaire de Hizbut-Tarqiyyah</strong> a été marquée par un geste d'une générosité exceptionnelle : une <strong>hadiya d'un milliard de francs CFA</strong> remise au Khalife Général pour soutenir les travaux de rénovation de la Grande Mosquée de Touba.</p>

<h2>Un cinquantenaire sous le signe du service</h2>
<p>Fondée en 1976 à l'Université Cheikh Anta Diop de Dakar, Hizbut-Tarqiyyah a choisi de marquer ses 50 ans d'existence par un acte concret de dévouement envers la cité sainte.</p>

<h2>La réponse du Khalife</h2>
<p>Le Khalife Général des Mourides a chaleureusement salué l'engagement constant de Hizbut-Tarqiyyah. <em>«&nbsp;Vous êtes sur la voie tracée par le Cheikh&nbsp;»</em>, a-t-il lancé.</p>
`,
  },
  {
    id: "14",
    slug: "cinquantenaire-hizbut-tarqiyyah-50-ans-service",
    titre:
      "Cinquantenaire de Hizbut-Tarqiyyah : 50 ans au service de Cheikh Ahmadou Bamba",
    sousTitre:
      "La daara mouride fondée par des étudiants célèbre un demi-siècle d'engagement spirituel et communautaire.",
    extrait:
      "De 1976 à 2026, Hizbut-Tarqiyyah est passée d'un petit groupe d'étudiants mourides à l'Université de Dakar à un réseau mondial comptant des membres sur les cinq continents.",
    categorie: "Religion",
    genre: "Reportage",
    auteur: "Fatou Diallo Kane",
    date: "2026-08-15T15:00:00+00:00",
    tempsLecture: "6 min",
    imageEmoji: "🌙",
    imageGradient: "from-green-700 via-emerald-800 to-teal-900",
    alaUne: false,
    vues: 13760,
    tags: ["Hizbut-Tarqiyyah", "Mouridisme", "Histoire"],
    contenu: `
<p>Le mouvement <strong>Hizbut-Tarqiyyah</strong> a célébré ses cinquante ans d'existence avec une Grande Ziara à la résidence du Khalife Général à Touba Darou Minane.</p>

<h2>Des origines estudiantines</h2>
<p>Tout a commencé en <strong>1976 à l'Université Cheikh Anta Diop de Dakar</strong>, lorsqu'un groupe d'étudiants mourides décide de créer un dahira pour perpétuer les valeurs du mouridisme dans le milieu académique.</p>

<h2>Un rayonnement mondial</h2>
<p>Aujourd'hui, Hizbut-Tarqiyyah est présente dans plus de trente pays à travers le monde.</p>
`,
  },
  {
    id: "15",
    imageUrl: "https://images.unsplash.com/photo-1485808269728-77bb07c059a8",
    credit: "Photo Unsplash",
    slug: "touba-deuil-rappel-a-dieu-serigne-touba-mbacke",
    titre:
      "Touba en deuil : rappel à Dieu de Serigne Touba Mbacké, fils de Serigne Modou Mbacké Yoni",
    sousTitre:
      "La communauté mouride pleure la disparition d'un érudit de l'Islam, héritier de la lignée Khadim Rassoul.",
    extrait:
      "La communauté mouride est endeuillée par le rappel à Dieu de Serigne Touba Mbacké. Cet érudit de l'Islam a consacré sa vie à l'enseignement du Coran et à la transmission des valeurs de la Mouridiyya.",
    categorie: "Religion",
    genre: "Actualité",
    auteur: "Moussa Thiaw",
    date: "2026-08-16T08:00:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🤲",
    imageGradient: "from-slate-700 via-emerald-900 to-green-950",
    alaUne: false,
    breaking: true,
    vues: 52340,
    tags: ["Touba", "Mouridisme", "Nécrologie"],
    contenu: `
<p>La communauté mouride est en deuil. <strong>Serigne Touba Mbacké</strong>, fils de Serigne Modou Mbacké Yoni Ibn Khadim Rassoul, a été rappelé à la Miséricorde divine.</p>

<h2>Un héritier de la lignée sacrée</h2>
<p>Descendant direct de <strong>Cheikh Ahmadou Bamba Mbacké</strong>, le Fondateur de la Mouridiyya, il s'était consacré toute sa vie à l'enseignement des sciences islamiques.</p>

<h2>Prières et condoléances</h2>
<p>Des milliers de fidèles à travers le monde ont exprimé leurs condoléances. <em>Inna lillahi wa inna ilayhi raji'un</em>.</p>
`,
  },
  {
    id: "16",
    slug: "touba-assainissement-grand-magal-dispositif-proprete",
    titre:
      "Assainissement de Touba : un dispositif renforcé de propreté à l'approche du Grand Magal",
    sousTitre:
      "Autorités locales et bénévoles se mobilisent pour une Cité Sainte propre et accueillante.",
    extrait:
      "À quelques semaines du Grand Magal, un vaste plan d'assainissement se déploie à Touba : collecte des déchets, curage des canaux et sensibilisation des populations.",
    categorie: "Société",
    genre: "Actualité",
    auteur: "Fatou Diallo Kane",
    date: "2026-08-13T09:20:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🧹",
    imageGradient: "from-teal-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 6740,
    tags: ["Touba", "Société", "Assainissement", "Magal"],
    contenu: `
<p>À l'approche du Grand Magal, la question de l'<strong>assainissement de Touba</strong> devient une priorité absolue pour les autorités locales et la communauté mouride.</p>

<h2>Une mobilisation générale</h2>
<p>Des milliers de bénévoles, encadrés par les services techniques, participent au nettoyage des grandes artères et au curage des canaux d'évacuation.</p>

<h2>Sensibiliser durablement</h2>
<p>Au-delà de l'événement, les organisateurs insistent sur l'importance d'ancrer durablement une culture de la propreté au sein de la Cité Sainte.</p>
`,
  },
  {
    id: "17",
    imageUrl: "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13",
    credit: "Photo Unsplash",
    slug: "interview-entrepreneure-touba-economie-locale-diaspora",
    titre:
      "« Touba est un immense marché » : entretien avec une entrepreneure qui mise sur l'économie locale",
    sousTitre:
      "Rencontre avec une cheffe d'entreprise qui relie les commerçants de Touba à la diaspora.",
    extrait:
      "Elle a quitté un poste confortable à l'étranger pour bâtir, depuis Touba, une plateforme reliant les commerçants locaux à la diaspora. Entretien.",
    categorie: "Économie",
    genre: "Interview",
    auteur: "Ndèye Fatou Dieng",
    date: "2026-08-12T14:30:00+00:00",
    tempsLecture: "6 min",
    imageEmoji: "💼",
    imageGradient: "from-amber-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 9210,
    tags: ["Économie", "Entrepreneuriat", "Diaspora", "Touba"],
    contenu: `
<p><em>Touba Infos&nbsp;: Qu'est-ce qui vous a décidée à rentrer entreprendre à Touba&nbsp;?</em></p>
<p>«&nbsp;J'ai toujours su que Touba est un immense marché, encore largement informel. En reliant les commerçants à la diaspora, on crée de la valeur ici, chez nous.&nbsp;»</p>

<p><em>Touba Infos&nbsp;: Quels sont les principaux défis&nbsp;?</em></p>
<p>«&nbsp;La logistique et la confiance. Il faut du temps pour convaincre, mais les résultats sont là. Le travail, comme le disait Serigne Touba, est une forme d'adoration.&nbsp;»</p>
`,
  },
  {
    id: "18",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    credit: "Photo Unsplash",
    slug: "analyse-decentralisation-touba-modele-gouvernance-locale",
    titre:
      "Analyse : Touba, un modèle singulier de gouvernance locale à l'épreuve de la croissance",
    sousTitre:
      "Entre autorité religieuse et administration publique, la Cité Sainte invente sa propre organisation.",
    extrait:
      "Comment une ville de plus d'un million d'habitants, sans être un chef-lieu de région classique, gère-t-elle ses services ? Éléments d'analyse.",
    categorie: "Société",
    genre: "Analyse",
    auteur: "Moussa Thiaw",
    date: "2026-08-10T17:00:00+00:00",
    tempsLecture: "7 min",
    imageEmoji: "🏙️",
    imageGradient: "from-slate-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 8130,
    tags: ["Touba", "Gouvernance", "Analyse", "Société"],
    contenu: `
<p>Touba fascine les urbanistes et les politologues. La ville combine une <strong>autorité religieuse structurante</strong> et une administration publique en cours de renforcement.</p>

<h2>Un modèle hybride</h2>
<p>La gestion communautaire, héritée de l'organisation des daaras et des dahiras, complète l'action de l'État dans de nombreux domaines.</p>

<h2>Les défis de la croissance</h2>
<p>La rapidité de l'urbanisation impose de repenser en continu les services de base : eau, voirie, santé, éducation.</p>
`,
  },
  {
    id: "19",
    slug: "communique-comite-organisation-grand-magal-circulation",
    titre:
      "Communiqué : le Comité d'organisation du Grand Magal précise le plan de circulation",
    sousTitre:
      "Les axes prioritaires, les zones de stationnement et les consignes de sécurité sont dévoilés.",
    extrait:
      "Le Comité d'organisation du Grand Magal de Touba a publié un communiqué détaillant le plan de circulation et les mesures de sécurité pour l'édition à venir.",
    categorie: "Magal",
    genre: "Communiqué",
    auteur: "Ibrahima Mbacké Diop",
    date: "2026-08-14T07:30:00+00:00",
    tempsLecture: "3 min",
    imageEmoji: "🚧",
    imageGradient: "from-green-700 via-emerald-800 to-teal-900",
    alaUne: false,
    vues: 17650,
    tags: ["Magal", "Circulation", "Sécurité", "Communiqué"],
    contenu: `
<p><strong>Communiqué officiel — Comité d'organisation du Grand Magal de Touba.</strong></p>
<p>Le Comité informe les pèlerins et les populations que le plan de circulation suivant sera mis en œuvre durant la période du Magal&nbsp;:</p>
<ul>
<li>Axes prioritaires réservés aux convois de vivres et aux secours&nbsp;;</li>
<li>Zones de stationnement aménagées à l'entrée de la ville&nbsp;;</li>
<li>Renforcement du dispositif de sécurité et de santé sur les grands carrefours.</li>
</ul>
<p>Le Comité appelle chacun au respect des consignes pour un Magal serein et sécurisé.</p>
`,
  },
  {
    id: "20",
    imageUrl: "https://images.unsplash.com/photo-1512678080530-7760d81faba6",
    credit: "Photo Unsplash",
    slug: "sante-touba-dispositif-medical-grand-magal",
    titre:
      "Santé : un dispositif médical d'exception déployé pour le Grand Magal de Touba",
    sousTitre:
      "Postes de santé, ambulances et personnels renforcés pour accueillir des millions de pèlerins.",
    extrait:
      "Les autorités sanitaires déploient un important dispositif médical à Touba pour garantir la prise en charge des pèlerins durant le Grand Magal.",
    categorie: "Santé",
    genre: "Actualité",
    auteur: "Fatou Diallo Kane",
    date: "2026-08-13T16:45:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🩺",
    imageGradient: "from-rose-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 10420,
    tags: ["Santé", "Magal", "Touba"],
    contenu: `
<p>Chaque année, le Grand Magal impose un <strong>dispositif sanitaire exceptionnel</strong>. Postes de santé avancés, ambulances, dons de sang et personnels mobilisés&nbsp;: rien n'est laissé au hasard.</p>

<h2>Une coordination renforcée</h2>
<p>Les structures publiques travaillent main dans la main avec les organisations mourides et les associations de bénévoles médicaux.</p>

<h2>Prévention avant tout</h2>
<p>Des campagnes de sensibilisation portent sur l'hydratation, l'hygiène et la prévention des maladies durant les fortes affluences.</p>
`,
  },
  {
    id: "21",
    imageUrl: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e",
    credit: "Photo Unsplash",
    slug: "senegal-programme-modernisation-infrastructures-routieres",
    titre:
      "Sénégal : un vaste programme de modernisation des infrastructures routières lancé",
    sousTitre:
      "Nouvelles autoroutes, ponts et voiries urbaines au cœur d'un plan pluriannuel.",
    extrait:
      "Le gouvernement a annoncé un programme d'envergure de modernisation du réseau routier national, avec un accent particulier sur la connexion des régions de l'intérieur, dont Touba et le bassin arachidier.",
    categorie: "Sénégal",
    genre: "Actualité",
    auteur: "Moussa Thiaw",
    date: "2026-08-13T11:30:00+00:00",
    tempsLecture: "4 min",
    imageEmoji: "🛣️",
    imageGradient: "from-emerald-700 via-green-800 to-teal-900",
    alaUne: false,
    vues: 14230,
    tags: ["Sénégal", "Infrastructures", "Routes"],
    contenu: `
<p>Le Sénégal engage un vaste <strong>programme de modernisation de ses infrastructures routières</strong>, présenté comme un levier majeur de développement économique et d'intégration territoriale.</p>

<h2>Désenclaver l'intérieur du pays</h2>
<p>Une attention particulière est portée à la connexion des régions de l'intérieur, dont Touba et le bassin arachidier, aux grands pôles économiques du pays.</p>

<h2>Un chantier pluriannuel</h2>
<p>Autoroutes, ponts et voiries urbaines figurent parmi les priorités d'un plan étalé sur plusieurs années.</p>
`,
  },
  {
    id: "22",
    imageUrl: "https://images.unsplash.com/photo-1638262052640-82e94d64664a",
    credit: "Photo Unsplash",
    slug: "senegal-diplomatie-partenariats-economiques-internationaux",
    titre:
      "Diplomatie : le Sénégal renforce ses partenariats économiques internationaux",
    sousTitre:
      "Dakar multiplie les accords avec des partenaires africains, européens et asiatiques.",
    extrait:
      "Le Sénégal poursuit une diplomatie économique active, avec la signature de plusieurs accords de coopération destinés à attirer les investissements et à ouvrir de nouveaux marchés.",
    categorie: "International",
    genre: "Actualité",
    auteur: "Cheikh Omar Fall",
    date: "2026-08-11T15:10:00+00:00",
    tempsLecture: "5 min",
    imageEmoji: "🤝",
    imageGradient: "from-sky-700 via-emerald-800 to-green-900",
    alaUne: false,
    vues: 9540,
    tags: ["Diplomatie", "International", "Investissement"],
    contenu: `
<p>La <strong>diplomatie économique</strong> occupe une place centrale dans la stratégie internationale du Sénégal.</p>

<h2>Diversifier les partenariats</h2>
<p>Dakar multiplie les accords avec des partenaires africains, européens et asiatiques afin d'attirer les investissements et d'ouvrir de nouveaux débouchés aux entreprises nationales.</p>

<h2>Un positionnement régional</h2>
<p>Le pays entend jouer un rôle de hub régional, en s'appuyant sur sa stabilité et sur ses nouvelles ressources énergétiques.</p>
`,
  },
  {
    id: "23",
    slug: "comment-touba-mieux-profiter-economie-magal",
    titre:
      "Comment Touba peut-elle mieux profiter de l'économie du Magal ?",
    sousTitre:
      "Dans un ouvrage de proposition, Mamadou Falilou Ndiaye (Touba Ça Kanam) trace une stratégie pour convertir l'intensité économique du Grand Magal en recettes locales, emplois et services durables.",
    extrait:
      "Près de 630 milliards de FCFA d'impact, mais 128 millions de recettes pour la mairie : l'ouvrage « Comment Touba peut-elle mieux profiter de l'économie du Magal ? » propose d'organiser, plutôt que de taxer, l'activité que l'événement intensifie.",
    categorie: "Économie",
    genre: "Tribune",
    auteur: "Mamadou Falilou Ndiaye",
    date: "2026-08-17T10:00:00+00:00",
    tempsLecture: "12 min",
    imageEmoji: "🏙️",
    imageGradient: "from-amber-700 via-emerald-800 to-green-900",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    credit: "Illustration — Touba Infos",
    legende:
      "Touba, entre intensité économique du Grand Magal et développement territorial.",
    alaUne: true,
    epingle: true,
    breaking: false,
    vues: 3120,
    tags: ["Magal", "Économie", "Touba", "Développement", "Emploi des jeunes"],
    contenu: `
<p>Comment la <strong>Commune de Touba Mosquée</strong> peut-elle mieux convertir l'intensité économique du Grand Magal en recettes locales, emplois, services et investissements durables&nbsp;? C'est la question que pose <strong>Mamadou Falilou Ndiaye</strong>, président fondateur de <em>Touba Ça Kanam</em>, dans son ouvrage <em>«&nbsp;Comment Touba peut-elle mieux profiter de l'économie du Magal&nbsp;?&nbsp;»</em> (Édition 2026). Une réflexion stratégique indépendante — <strong>un livre de proposition, pas un document officiel</strong> — dont Touba Infos présente ici les grandes lignes.</p>

<blockquote>Ne pas «&nbsp;taxer le Magal&nbsp;». Mieux gérer les activités commerciales, le domaine public, le stationnement, la publicité, les marchés et les services que l'événement intensifie.</blockquote>

<h2>Le paradoxe économique de Touba</h2>
<p>Selon l'étude conjointe <strong>UCAK/UADB</strong>, menée avec le Comité d'organisation, l'impact du Grand Magal est estimé à près de <strong>629,6 milliards de FCFA</strong> (2025) — plus du double de l'évaluation de 2017 (×2,5). Dans le même temps, les <strong>recettes fiscales de la mairie</strong> tournent autour de <strong>128 millions de FCFA</strong>. «&nbsp;Ces indicateurs ne mesurent pas la même chose&nbsp;», rappelle l'auteur&nbsp;: l'un est un impact national, l'autre les recettes communales. Mais l'écart d'échelle révèle l'enjeu.</p>

<h3>L'anatomie de la dépense</h3>
<p>Avec une dépense moyenne estimée à <strong>132 470 FCFA par pèlerin</strong> et près de <strong>6 millions de fidèles</strong> chaque année, le Magal active simultanément transport, alimentation, commerce, artisanat, communication, services financiers, hébergement, énergie et logistique. L'alimentation représente à elle seule environ <strong>62&nbsp;%</strong> de la dépense. L'enjeu, écrit l'auteur, «&nbsp;n'est pas seulement le niveau de dépense&nbsp;: c'est la capacité à faire en sorte qu'une part croissante de ces dépenses crée de la valeur à Touba&nbsp;».</p>

<h3>Où fuit la valeur locale ?</h3>
<p>À chaque tour de dépense, une partie s'échappe du territoire par trois canaux&nbsp;: les <strong>importations</strong>, la <strong>main-d'œuvre externe</strong> et l'<strong>épargne non bancarisée</strong>. Trois leviers de rétention sont proposés&nbsp;: substituer les importations (agrobusiness, filière cuir — l'étude cite plus de 100&nbsp;000 ruminants sacrifiés), acheter et recruter local, et bancariser l'épargne via le mobile money.</p>

<h3>Le défi des recettes locales</h3>
<p>La première ressource d'une commune n'est pas un nouveau taux, «&nbsp;c'est une assiette connue et traçable&nbsp;». Le Code général des collectivités territoriales prévoit déjà droits de place, occupation de la voie publique, taxes et produits du patrimoine. La méthode&nbsp;: <strong>recenser</strong>, <strong>géolocaliser</strong>, <strong>quittancer</strong> et <strong>piloter</strong>.</p>

<h2>Les leçons du monde</h2>
<p>Les grands rassemblements ont professionnalisé leurs services. Le <strong>Hajj et la Umrah</strong> génèrent environ 12 milliards USD par an pour l'Arabie saoudite (près de 7&nbsp;% de son PIB non pétrolier), avec une plateforme numérique unique de permis et de services (Nusuk). Le <strong>Maha Kumbh</strong> indien illustre l'autre voie&nbsp;: une ville temporaire planifiée, portée par une gouvernance dédiée. Trois leçons pour Touba, «&nbsp;à adapter à son identité et à ses valeurs&nbsp;»&nbsp;: une plateforme numérique unique, une hospitalité structurée et classée, et une économie pensée toute l'année.</p>

<h2>Organiser : les leviers concrets</h2>
<p>Plutôt qu'une hausse uniforme des taxes, l'ouvrage propose d'<strong>élargir l'assiette avant d'augmenter les taux</strong>, de protéger les micro-activités et de lier chaque prélèvement à un service visible. Parmi les chantiers&nbsp;:</p>
<ul>
<li><strong>Marchés &amp; domaine public</strong>&nbsp;: zones numérotées, pré-inscription des vendeurs, tarifs affichés, points d'eau et propreté.</li>
<li><strong>Mobilité &amp; stationnement</strong>&nbsp;: parkings périphériques cartographiés, navettes, GIE de jeunes pour l'orientation, signalétique normalisée.</li>
<li><strong>Publicité</strong>&nbsp;: encadrer l'affichage autorisé — avec des <em>zones d'exclusion</em> explicites autour des lieux sacrés, pour éviter toute surcharge visuelle.</li>
<li><strong>Déchets &amp; économie circulaire</strong>&nbsp;: environ 1&nbsp;114 m³/jour à collecter, avec une cible de plus de 30&nbsp;% de valorisation et des emplois verts.</li>
<li><strong>Hébergement</strong>&nbsp;: classement volontaire et charte qualité — l'accueil traditionnel et gratuit du mouridisme restant premier.</li>
<li><strong>Eau, assainissement, santé et énergie</strong>&nbsp;: services organisés par zones, éclairage public solaire, label «&nbsp;Magal plus propre&nbsp;».</li>
</ul>

<h2>Transformer : de l'emploi durable toute l'année</h2>
<p>L'étude évoque un potentiel indicatif de <strong>plus de 100&nbsp;000 emplois sur trois ans</strong> dans les secteurs moteurs. L'auteur propose un dispositif <strong>«&nbsp;Magal-Emploi&nbsp;»</strong> — non pas un recrutement par la mairie, mais une plateforme d'orientation&nbsp;: identifier les besoins, former par modules courts, certifier, placer auprès des donneurs d'ordre, puis suivre l'insertion. En appui&nbsp;: des filières locales à l'année (agroalimentaire, cuir, emballages, logistique, numérique), la <strong>numérisation de la commune</strong> (mobile money, SIG, quittance électronique) et des financements mobilisant DER/FJ, partenariats public-privé et diaspora mouride.</p>

<h2>Piloter : investir, gouverner, mesurer</h2>
<p>La fiscalité «&nbsp;devient acceptable quand le service rendu est visible&nbsp;». Une répartition indicative des recettes supplémentaires est proposée&nbsp;: propreté et déchets (25&nbsp;%), voirie et mobilité (25&nbsp;%), jeunesse et emploi (20&nbsp;%), marchés (15&nbsp;%), numérique communal (10&nbsp;%), évaluation (5&nbsp;%). L'ouvrage plaide pour un <strong>rapport annuel «&nbsp;Magal &amp; Commune&nbsp;»</strong>, un <strong>Observatoire économique permanent</strong> associant commune, universités et Comité d'organisation, et une <strong>feuille de route 2027-2030</strong> (audit, pilotes, extension, investissement, évaluation).</p>

<h2>« Organiser, plutôt que taxer »</h2>
<p>Le véritable bénéfice pour Touba, conclut l'auteur, «&nbsp;ne sera pas seulement le montant collecté pendant quelques jours&nbsp;», mais la capacité à convertir un événement annuel exceptionnel en emplois, infrastructures et services durables. <em>Organiser plutôt que taxer&nbsp;; retenir la valeur plutôt que la laisser passer&nbsp;; prouver plutôt que promettre.</em></p>

<p><em>Note&nbsp;: les grilles tarifaires, budgets, répartitions et calendriers présentés dans l'ouvrage sont des propositions de l'auteur et ne constituent pas des décisions adoptées par la commune. Contact de l'auteur&nbsp;: toubainfos@gmail.com · 77 800 17 17.</em></p>
`,
  },
];

// ── Vidéos (Touba Infos TV) ───────────────────────────────────────────────
export const VIDEOS_INFO: VideoInfo[] = [
  {
    id: "v1",
    slug: "reportage-preparatifs-grand-magal-touba",
    titre: "Reportage : les préparatifs du Grand Magal à Touba",
    categorie: "Magal",
    duree: "12:40",
    date: "2026-08-14T00:00:00+00:00",
    imageEmoji: "🎥",
    imageGradient: "from-green-700 via-emerald-800 to-green-900",
    description:
      "Immersion dans les coulisses de la préparation de la plus grande manifestation religieuse d'Afrique de l'Ouest.",
  },
  {
    id: "v2",
    slug: "interview-imam-grande-mosquee-touba",
    titre: "Interview : un imam de la Grande Mosquée raconte Touba",
    categorie: "Religion",
    duree: "18:05",
    date: "2026-08-11T00:00:00+00:00",
    imageEmoji: "🎙️",
    imageGradient: "from-emerald-700 via-teal-800 to-green-900",
    description:
      "Rencontre exclusive autour de l'histoire et de la spiritualité de la Cité Sainte.",
  },
  {
    id: "v3",
    slug: "emission-economie-touba-marches",
    titre: "Émission : l'économie foisonnante des marchés de Touba",
    categorie: "Économie",
    duree: "22:15",
    date: "2026-08-09T00:00:00+00:00",
    imageEmoji: "🏬",
    imageGradient: "from-amber-700 via-emerald-800 to-green-900",
    description:
      "Reportage économique sur les grands marchés de Touba et leur rôle dans la région.",
  },
  {
    id: "v4",
    slug: "declaration-comite-organisation-magal",
    titre: "Déclaration : le Comité d'organisation du Magal s'exprime",
    categorie: "Magal",
    duree: "06:30",
    date: "2026-08-08T00:00:00+00:00",
    imageEmoji: "📢",
    imageGradient: "from-green-700 via-emerald-800 to-teal-900",
    description:
      "Le point sur l'organisation et la sécurité de l'édition à venir du Grand Magal.",
  },
  {
    id: "v5",
    slug: "culture-sabar-percussion-senegalaise",
    titre: "Culture : le Sabar, cœur battant de la percussion sénégalaise",
    categorie: "Culture",
    duree: "09:50",
    date: "2026-08-05T00:00:00+00:00",
    imageEmoji: "🥁",
    imageGradient: "from-fuchsia-700 via-rose-800 to-orange-900",
    description:
      "À la découverte d'un patrimoine musical candidat à l'UNESCO.",
  },
  {
    id: "v6",
    slug: "sport-lions-teranga-preparation-can",
    titre: "Sport : dans la préparation des Lions de la Téranga",
    categorie: "Sport",
    duree: "14:20",
    date: "2026-08-03T00:00:00+00:00",
    imageEmoji: "🦁",
    imageGradient: "from-red-700 via-emerald-800 to-green-900",
    description:
      "Reportage au cœur de la tanière, à l'approche de la CAN 2027.",
  },
];

// ── Grand Magal — données de compte à rebours ─────────────────────────────
export const MAGAL = {
  edition: "Grand Magal de Touba 2027",
  // 18 Safar 1449 AH (approximatif) — date évènementielle
  dateISO: "2027-08-02T00:00:00+00:00",
  dateAffichee: "2 août 2027",
};

// ============================================================================
//  Helpers
// ============================================================================

export function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatHeureFr(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateHeureFr(iso: string): string {
  return `${formatDateFr(iso)} à ${formatHeureFr(iso)}`;
}

const parByDate = (a: ArticleInfo, b: ArticleInfo) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export function getArticlesTries(): ArticleInfo[] {
  return [...ARTICLES_INFO].sort(parByDate);
}

export function getArticleInfoBySlug(slug: string): ArticleInfo | undefined {
  return ARTICLES_INFO.find((a) => a.slug === slug);
}

export function getArticlesInfoByCategorie(
  categorie: CategorieInfo,
): ArticleInfo[] {
  return ARTICLES_INFO.filter((a) => a.categorie === categorie).sort(parByDate);
}

export function getArticlesInfoByGenre(genre: GenreInfo): ArticleInfo[] {
  return ARTICLES_INFO.filter((a) => a.genre === genre).sort(parByDate);
}

export function getArticlesInfoSimilaires(article: ArticleInfo): ArticleInfo[] {
  const memeCat = ARTICLES_INFO.filter(
    (a) => a.id !== article.id && a.categorie === article.categorie,
  );
  const complement = ARTICLES_INFO.filter(
    (a) => a.id !== article.id && a.categorie !== article.categorie,
  );
  return [...memeCat, ...complement].slice(0, 4);
}

export function getBreaking(): ArticleInfo[] {
  return ARTICLES_INFO.filter((a) => a.breaking).sort(parByDate);
}

export function getUne(): ArticleInfo {
  return ARTICLES_INFO.find((a) => a.alaUne) ?? getArticlesTries()[0];
}

export function getPlusLus(n = 5): ArticleInfo[] {
  return [...ARTICLES_INFO].sort((a, b) => b.vues - a.vues).slice(0, n);
}

export function getDernieres(n = 6): ArticleInfo[] {
  return getArticlesTries().slice(0, n);
}

export function rechercheArticles(q: string): ArticleInfo[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return getArticlesTries().filter((a) =>
    [a.titre, a.sousTitre, a.extrait, a.auteur, a.categorie, ...a.tags]
      .join(" ")
      .toLowerCase()
      .includes(t),
  );
}
