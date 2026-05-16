export type CategorieArticle =
  | "Stratégie Digitale"
  | "Réseaux Sociaux"
  | "Identité Visuelle"
  | "Étude de Cas"
  | "WhatsApp Marketing"
  | "Communication Terrain";

export interface Article {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  categorie: CategorieArticle;
  emoji: string;
  auteur: "Mamadou Falilou Ndiaye" | "Équipe ATV";
  datePublication: string;
  tempsLecture: string;
  populaire: boolean;
  contenu: string;
}

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "5-erreurs-fatales-communication-digitale-senegal",
    titre: "5 erreurs fatales en communication digitale au Sénégal",
    extrait:
      "Trop d'entreprises sénégalaises publient sur les réseaux sociaux sans stratégie claire et perdent un temps précieux. Découvrez les 5 pièges les plus courants et comment les éviter pour construire une présence digitale efficace.",
    categorie: "Stratégie Digitale",
    emoji: "⚠️",
    auteur: "Mamadou Falilou Ndiaye",
    datePublication: "15 mai 2026",
    tempsLecture: "6 min",
    populaire: true,
    contenu: `
<p>Chaque semaine, des entrepreneurs sénégalais nous contactent avec le même constat : <strong>«&nbsp;Je poste sur Facebook et Instagram, mais ça ne me rapporte rien.&nbsp;»</strong> La vérité, c'est que la communication digitale ne s'improvise pas — surtout dans un marché aussi dynamique et spécifique que celui du Sénégal. Après des années d'accompagnement de marques à Touba, Dakar et dans tout le pays, l'équipe d'Agence Touba Visuel a identifié les 5 erreurs les plus destructrices.</p>

<h2>Erreur 1 : Publier sans stratégie — juste pour publier</h2>
<p>C'est l'erreur numéro un. Vous voyez un concurrent poster tous les jours, alors vous faites pareil. Vous partagez des photos floues, des textes copiés-collés, des memes qui n'ont rien à voir avec votre activité. Résultat : votre audience ne comprend pas ce que vous vendez.</p>
<p>Une bonne stratégie digitale commence par trois questions fondamentales :</p>
<ul>
  <li><strong>À qui je parle ?</strong> — Définissez votre persona : âge, ville, revenu, habitudes numériques</li>
  <li><strong>Qu'est-ce que je veux qu'il fasse ?</strong> — Appeler, commander, visiter votre boutique ?</li>
  <li><strong>Quelle valeur j'apporte dans chaque contenu ?</strong> — Information, divertissement, preuve sociale ?</li>
</ul>
<p>Chez ATV, nous recommandons de planifier au minimum 4 semaines de contenu à l'avance, avec un mix de 60% de contenu utile, 30% de présentation produit et 10% de promotion directe. Sans ce cadre, vous êtes comme un commerçant qui ouvre sa boutique chaque jour mais qui ne sait pas quoi mettre en vitrine.</p>

<h2>Erreur 2 : Négliger WhatsApp pour la vente</h2>
<p>Au Sénégal, <strong>WhatsApp n'est pas une option — c'est le canal numéro 1</strong>. Selon les données de 2025, plus de 97% des utilisateurs de smartphones au Sénégal utilisent WhatsApp quotidiennement. Pourtant, la majorité des entrepreneurs n'utilisent pas WhatsApp Business, n'ont pas de catalogue configuré, et répondent aux messages clients de façon désordonnée.</p>
<p>Voici ce que vous perdez en négligeant WhatsApp :</p>
<ul>
  <li>Des prospects qui vous contactent et n'ont pas de réponse rapide — ils vont chez un concurrent</li>
  <li>L'opportunité d'envoyer des statuts visibles par tous vos contacts professionnels</li>
  <li>La possibilité de créer des groupes de fidélité avec vos meilleurs clients</li>
  <li>Un catalogue produit accessible en 2 clics, directement dans l'app</li>
</ul>
<p>La règle d'or : répondez à tout message WhatsApp professionnel en moins de 30 minutes pendant les heures d'ouverture. Chaque minute de délai supplémentaire fait chuter votre taux de conversion.</p>

<h2>Erreur 3 : Identité visuelle incohérente</h2>
<p>Regardez vos publications des 3 derniers mois. Si chaque post a une police différente, des couleurs qui changent, des logos de tailles variables — vous souffrez d'incohérence visuelle. Cette erreur est particulièrement grave parce qu'elle détruit la <strong>mémorabilité de votre marque</strong>.</p>
<p>Le cerveau humain a besoin de répétition pour mémoriser. Si votre audience voit vos visuels et ne peut pas vous reconnaître en 3 secondes, vous repartez de zéro à chaque publication. Les grandes marques sénégalaises comme Orange, Sonatel, ou Ecobank ont toutes une identité visuelle strictement respectée sur tous leurs supports.</p>
<p>La solution minimum : définissez une palette de 2 couleurs principales, une police de titre et une police de texte, et un template de publication que vous respectez toujours. Agence Touba Visuel propose des kits d'identité visuelle complets, déployés sur tous vos supports print et digital.</p>

<h2>Erreur 4 : Ignorer les heures de pointe sénégalaises</h2>
<p>Publier à 3h du matin ou à 11h un vendredi (pendant la prière) est une erreur classique. Au Sénégal, les habitudes numériques ont leurs propres rythmes :</p>
<ul>
  <li><strong>7h-9h</strong> : Pic du matin (trajet domicile-travail)</li>
  <li><strong>12h-14h</strong> : Pause déjeuner — fort taux d'engagement</li>
  <li><strong>20h-23h</strong> : Pic du soir, le plus fort de la journée</li>
  <li><strong>Vendredi 12h-14h</strong> : Forte baisse — évitez ce créneau</li>
  <li><strong>Dimanche soir</strong> : Excellent pour les contenus inspirants et les promotions de début de semaine</li>
</ul>
<p>Utilisez les outils de programmation (Meta Business Suite, Buffer) pour ne jamais rater ces fenêtres de haute visibilité, même quand vous êtes occupé.</p>

<h2>Erreur 5 : Pas de call-to-action clair</h2>
<p>Vous avez rédigé un super texte, posté une belle photo — et vous terminez par rien. Pas d'instruction pour votre audience. <strong>Un contenu sans CTA (appel à l'action) est un contenu mort</strong>. Votre audience ne devinera pas ce qu'elle doit faire ensuite.</p>
<p>Exemples de CTA efficaces pour le marché sénégalais :</p>
<ul>
  <li>«&nbsp;Envoyez-nous un message sur WhatsApp maintenant — lien en bio&nbsp;»</li>
  <li>«&nbsp;Passez commande avant vendredi et bénéficiez d'une livraison gratuite à Touba&nbsp;»</li>
  <li>«&nbsp;Taguez un ami qui a besoin de nos services 👇&nbsp;»</li>
  <li>«&nbsp;Commentez avec votre ville pour recevoir notre catalogue gratuit&nbsp;»</li>
</ul>
<p>Chaque publication doit avoir un seul CTA clair. Ne demandez pas à votre audience de faire 5 choses à la fois — choisissez la plus importante.</p>

<h2>Le bilan : que faire maintenant ?</h2>
<p>Si vous vous êtes reconnu dans une ou plusieurs de ces erreurs, pas de panique — c'est récupérable. Commencez par un audit honnête de vos 20 dernières publications : combien ont un CTA ? Combien respectent votre charte visuelle ? Combien ont été publiées aux bonnes heures ?</p>
<p>Chez <strong>Agence Touba Visuel</strong>, nous accompagnons les entreprises sénégalaises dans la construction de stratégies digitales cohérentes et rentables. De la création graphique à la gestion des réseaux sociaux, en passant par la communication terrain à Touba — nous sommes votre partenaire de croissance. Contactez-nous sur WhatsApp au +221 76 800 17 17 pour un premier audit gratuit.</p>
`,
  },
  {
    id: "2",
    slug: "whatsapp-business-outil-numero-1-vendre-senegal",
    titre: "WhatsApp Business : l'outil numéro 1 pour vendre au Sénégal",
    extrait:
      "Avec 97% des utilisateurs de smartphones actifs sur WhatsApp, cette application est devenue le canal de vente incontournable pour toute entreprise sénégalaise. Voici comment le maîtriser pour transformer vos conversations en conversions.",
    categorie: "WhatsApp Marketing",
    emoji: "💬",
    auteur: "Mamadou Falilou Ndiaye",
    datePublication: "10 mai 2026",
    tempsLecture: "7 min",
    populaire: true,
    contenu: `
<p>Si vous deviez choisir un seul outil digital pour développer votre business au Sénégal, ce serait WhatsApp. Non pas Instagram, non pas Facebook — WhatsApp. Voici pourquoi : en 2025, le Sénégal compte plus de 8 millions d'utilisateurs WhatsApp actifs quotidiennement. L'application dépasse de loin tous les autres canaux en termes de taux d'ouverture des messages (98% contre 20% pour l'email) et de taux de réponse. Pour un entrepreneur sénégalais, ignorer WhatsApp Business, c'est laisser de l'argent sur la table chaque jour.</p>

<h2>Pourquoi WhatsApp domine au Sénégal</h2>
<p>WhatsApp s'est imposé comme le canal de communication dominant au Sénégal pour plusieurs raisons structurelles :</p>
<ul>
  <li><strong>Coût des SMS</strong> : Les SMS restaient chers pour beaucoup de Sénégalais. WhatsApp, avec la data mobile devenue accessible, a tout changé</li>
  <li><strong>Culture de l'oral</strong> : Le Sénégal a une forte culture orale — WhatsApp avec ses messages vocaux répond parfaitement à cette habitude</li>
  <li><strong>Compatibilité avec les téléphones d'entrée de gamme</strong> : Même les smartphones basiques font tourner WhatsApp sans problème</li>
  <li><strong>Confiance</strong> : Au Sénégal, on fait confiance aux gens qu'on connaît. WhatsApp, qui passe par les contacts du téléphone, humanise la relation commerciale</li>
  <li><strong>Groupes familiaux et professionnels</strong> : Les groupes WhatsApp sont au cœur de la vie sociale et économique sénégalaise</li>
</ul>

<h2>Configurer son catalogue WhatsApp Business</h2>
<p>Le catalogue WhatsApp Business est votre vitrine virtuelle intégrée dans l'application. C'est gratuit, simple à mettre en place, et extrêmement efficace. Voici comment le configurer correctement :</p>
<ul>
  <li><strong>Téléchargez WhatsApp Business</strong> (différent de WhatsApp personnel) depuis le Play Store ou l'App Store</li>
  <li><strong>Configurez votre profil d'entreprise</strong> : nom exact, description claire (max 256 caractères), adresse, horaires, site web</li>
  <li><strong>Accédez au catalogue</strong> : Paramètres → Outils professionnels → Catalogue</li>
  <li><strong>Ajoutez vos produits</strong> : Nom, prix, description, photo haute qualité (minimum 500x500 pixels)</li>
  <li><strong>Partagez votre catalogue</strong> dans vos statuts, vos groupes, et envoyez le lien direct à vos prospects</li>
</ul>
<p>Un catalogue bien rempli réduit de 70% le temps de réponse aux questions du type «&nbsp;vous vendez quoi ?&nbsp;» — et ça, c'est précieux.</p>

<h2>Techniques de prospection sans être intrusif</h2>
<p>La plus grande erreur du marketing WhatsApp est l'envoi de messages non sollicités en masse. Non seulement c'est inefficace, mais cela peut vous faire bloquer et détruire votre réputation. Voici les bonnes pratiques :</p>
<ul>
  <li><strong>Le consentement d'abord</strong> : Invitez vos clients à vous enregistrer dans leurs contacts via vos supports print (QR code sur vos flyers et banderoles)</li>
  <li><strong>La valeur avant la vente</strong> : Partagez d'abord des contenus utiles — conseils, actualités du secteur, promotions exclusives — avant de pitcher directement</li>
  <li><strong>Les listes de diffusion</strong> : Contrairement aux groupes, les listes de diffusion permettent d'envoyer des messages personnalisés — le destinataire pense recevoir un message individuel</li>
  <li><strong>La personnalisation</strong> : Utilisez le prénom du client quand vous le connaissez. «&nbsp;Bonjour Aminata, notre nouvelle collection est disponible&nbsp;» convertit bien mieux qu'un message générique</li>
  <li><strong>Les réponses rapides automatiques</strong> : Configurez un message de bienvenue automatique et des réponses rapides pour les questions fréquentes</li>
</ul>

<h2>Les statuts WhatsApp comme outil marketing</h2>
<p>Les statuts WhatsApp sont l'équivalent des stories Instagram — mais avec un avantage majeur : <strong>tous vos contacts professionnels les voient</strong>, sans algorithme. Voici comment les exploiter :</p>
<ul>
  <li>Publiez 3 à 5 statuts par jour (mélange de produits, témoignages, coulisses)</li>
  <li>Utilisez des photos de haute qualité avec du texte lisible</li>
  <li>Ajoutez toujours un CTA : «&nbsp;Répondez à ce statut pour commander&nbsp;»</li>
  <li>Montrez les «&nbsp;avant/après&nbsp;» de vos réalisations — c'est extrêmement engageant</li>
  <li>Publiez des témoignages clients en captures d'écran (avec leur accord)</li>
</ul>
<p>Un entrepreneur de Touba qui publie régulièrement sur ses statuts WhatsApp génère en moyenne 30% de ses commandes via ce canal seul.</p>

<h2>Messages types qui convertissent</h2>
<p>Voici des templates éprouvés pour différentes situations :</p>
<p><strong>Premier contact après une recommandation :</strong><br/>
«&nbsp;Bonjour [Prénom], c'est [votre nom] de [votre entreprise]. [Ami commun] m'a dit que vous cherchiez [service]. Je peux vous envoyer nos tarifs et quelques exemples de réalisations ? Il me faut juste 2 minutes de votre temps.&nbsp;»</p>
<p><strong>Relance d'un prospect qui n'a pas commandé :</strong><br/>
«&nbsp;Bonjour [Prénom], on s'était parlé la semaine dernière pour [service]. Est-ce que votre projet avance ? On a une promotion spéciale jusqu'à vendredi — 15% de réduction sur les premières commandes. Je suis disponible si vous avez des questions.&nbsp;»</p>
<p><strong>Annonce de promotion :</strong><br/>
«&nbsp;🎉 OFFRE SPÉCIALE — Ce week-end uniquement ! [Description de l'offre]. Valable jusqu'au dimanche soir. Répondez OUI pour réserver votre place / passer commande.&nbsp;»</p>

<h2>Mesurer vos résultats</h2>
<p>WhatsApp Business propose des statistiques basiques (messages envoyés, reçus, lus). Pour aller plus loin, créez un tableau de bord simple : nombre de messages envoyés par semaine, nombre de réponses reçues, nombre de commandes générées. Calculez votre taux de conversion (commandes ÷ messages envoyés × 100). Un bon taux pour le marché sénégalais se situe entre 5 et 15%.</p>
<p>Chez <strong>Agence Touba Visuel</strong>, nous aidons nos clients à mettre en place leur stratégie WhatsApp complète — du design de leurs statuts à la formation sur les bonnes pratiques de communication. Contactez-nous pour en savoir plus.</p>
`,
  },
  {
    id: "3",
    slug: "creer-identite-visuelle-memorable-marque",
    titre: "Comment créer une identité visuelle mémorable pour votre marque",
    extrait:
      "Une identité visuelle forte ne se résume pas à un joli logo. C'est un système cohérent qui permet à vos clients de vous reconnaître en une fraction de seconde, sur tous vos supports. Voici comment construire la vôtre.",
    categorie: "Identité Visuelle",
    emoji: "🎨",
    auteur: "Équipe ATV",
    datePublication: "5 mai 2026",
    tempsLecture: "8 min",
    populaire: false,
    contenu: `
<p>Imaginez que vous marchez dans les rues de Touba ou de Dakar, et qu'une banderole capte votre attention. En une seconde, avant même de lire le texte, vous reconnaissez la marque. C'est la puissance d'une identité visuelle forte. Les grandes marques — Coca-Cola, Orange, Apple — ont compris depuis longtemps que l'image précède le message. Mais les entreprises sénégalaises, même les PME, peuvent atteindre ce niveau de mémorabilité avec la bonne méthode.</p>

<h2>Qu'est-ce qu'une identité visuelle ?</h2>
<p>L'identité visuelle est l'ensemble des éléments graphiques qui définissent l'apparence d'une marque. Ce n'est pas seulement votre logo — c'est un système complet et cohérent qui s'applique sur tous vos points de contact : votre boutique physique, vos réseaux sociaux, vos flyers, vos emballages, vos uniformes, votre site web.</p>
<p>Une identité visuelle bien construite répond à trois objectifs :</p>
<ul>
  <li><strong>Différenciation</strong> : Vous distinguer de vos concurrents au premier coup d'œil</li>
  <li><strong>Mémorabilité</strong> : Rester dans la tête de vos clients après la première exposition</li>
  <li><strong>Confiance</strong> : Projeter le professionnalisme et la cohérence qui rassurent vos clients</li>
</ul>

<h2>Les 5 éléments fondamentaux</h2>
<p><strong>1. Le logo</strong><br/>
Votre logo est la pierre angulaire de votre identité. Il doit être simple (lisible même en petit format), distinctif (pas une copie d'un autre logo), et déclinable (fonctionne en couleur, en noir et blanc, sur fond clair et fond foncé). Un bon logo survive à l'épreuve du temps — le logo d'ATV, par exemple, a été conçu pour être imprimé sur une banderole de 6 mètres comme sur un badge de 2 cm.</p>
<p><strong>2. La palette de couleurs</strong><br/>
Les couleurs communiquent des émotions avant même que le client lise un mot. Vert = confiance, nature, santé. Or = prestige, qualité, success. Rouge = urgence, énergie, passion. Bleu = professionnalisme, sécurité, technologie. Choisissez 1 à 2 couleurs primaires et 1 couleur d'accent. Définissez leurs codes exacts (RGB, HEX, CMJN) pour garantir la cohérence entre le digital et l'imprimé.</p>
<p><strong>3. La typographie</strong><br/>
Choisissez 2 polices maximum : une pour les titres (personnalité, impact) et une pour le texte courant (lisibilité). Au Sénégal, pensez aussi à la lisibilité en conditions extérieures — une police très fine sera illisible sur une banderole en plein soleil.</p>
<p><strong>4. L'iconographie et le style photographique</strong><br/>
Définissez le style de vos illustrations et photos : réaliste ou illustré ? Chaleureux ou épuré ? Avec des personnes ou des produits seuls ? Un fond coloré ou blanc ? Cette cohérence dans le style visuel renforce immédiatement la reconnaissance de votre marque.</p>
<p><strong>5. Le tone of voice visuel</strong><br/>
C'est la personnalité de votre marque traduite en choix graphiques. Une marque premium utilisera beaucoup d'espace blanc, des polices fines, des photos sombres et élégantes. Une marque jeune et accessible utilisera des couleurs vives, des illustrations dynamiques, des emojis. Votre tone of voice doit être cohérent avec le positionnement que vous visez.</p>

<h2>Erreurs courantes à éviter</h2>
<ul>
  <li><strong>Trop de couleurs</strong> : Plus de 3 couleurs dans une identité visuelle crée de la confusion</li>
  <li><strong>Changer son logo tous les ans</strong> : La mémorabilité vient de la répétition — restez constants</li>
  <li><strong>Copier un concurrent</strong> : Vous créez de la confusion chez les clients et des risques juridiques</li>
  <li><strong>Négliger les déclinaisons</strong> : Votre logo doit exister en version couleur, noir et blanc, et avec/sans fond</li>
  <li><strong>Acheter un logo sur Fiverr sans charte graphique</strong> : Un logo isolé n'est pas une identité visuelle</li>
</ul>

<h2>Exemple concret : la démarche ATV</h2>
<p>Quand Agence Touba Visuel a développé sa propre identité, nous avons suivi un processus rigoureux. Nous avons commencé par définir nos valeurs : <strong>excellence, ancrage local, innovation</strong>. Ces valeurs ont guidé tous nos choix graphiques : le vert profond pour l'ancrage et la confiance, l'or pour l'excellence et le prestige, le design 3D pour l'innovation et la modernité. Chaque élément de notre identité raconte quelque chose de cohérent sur qui nous sommes.</p>
<p>Le résultat : nos clients reconnaissent immédiatement une création ATV, même sans voir notre logo. C'est l'objectif ultime d'une identité visuelle réussie.</p>

<h2>Check-list pour évaluer son identité visuelle</h2>
<ul>
  <li>☐ Mon logo est-il lisible en 2 cm² et en 2 mètres de large ?</li>
  <li>☐ Mes couleurs sont-elles définies avec des codes exacts (HEX, CMJN) ?</li>
  <li>☐ J'utilise maximum 2 polices de caractères de façon cohérente ?</li>
  <li>☐ Mes publications des 3 derniers mois sont-elles reconnaissables comme venant de la même marque ?</li>
  <li>☐ Mon identité fonctionne-t-elle aussi bien en digital (écran) qu'en print (imprimé) ?</li>
  <li>☐ Ma charte graphique est-elle documentée et partagée avec toute mon équipe ?</li>
</ul>
<p>Si vous avez répondu «&nbsp;non&nbsp;» à plusieurs de ces questions, il est temps de retravailler votre identité. L'équipe d'<strong>Agence Touba Visuel</strong> crée des identités visuelles complètes avec charte graphique, déclinaisons sur tous supports et accompagnement pour les équipes. Contactez-nous pour un devis.</p>
`,
  },
  {
    id: "4",
    slug: "campagne-zenith-touba-orange-money-magal",
    titre: "Campagne Zénith Touba : comment ATV a boosté Orange Money au Magal",
    extrait:
      "Le Magal de Touba rassemble 3 à 4 millions de pèlerins en 48 heures. Pour Orange Money, ce moment est une opportunité unique — et un défi logistique colossal. Voici comment Agence Touba Visuel a piloté une campagne terrain qui a transformé la présence de la marque dans la sainte ville.",
    categorie: "Étude de Cas",
    emoji: "🏆",
    auteur: "Mamadou Falilou Ndiaye",
    datePublication: "28 avril 2026",
    tempsLecture: "9 min",
    populaire: true,
    contenu: `
<p>Le Magal de Touba. Deux mots qui résument une des plus grandes concentrations humaines d'Afrique de l'Ouest. Chaque année, la ville sainte accueille entre 3 et 4 millions de pèlerins mourides venus du monde entier pour commémorer le départ en exil du Cheikh Ahmadou Bamba. Pour une marque de services financiers comme Orange Money, cet événement représente à la fois une opportunité commerciale extraordinaire et un terrain de communication ultra-compétitif. C'est dans ce contexte que nous avons piloté la campagne Zénith Touba.</p>

<h2>Contexte : le Magal, un terrain de jeu unique</h2>
<p>Pour comprendre l'ampleur du défi, quelques chiffres s'imposent. Lors du Magal :</p>
<ul>
  <li>3 à 4 millions de personnes convergent vers Touba en 48 heures</li>
  <li>La population de la ville est multipliée par 10 en quelques jours</li>
  <li>Les transactions financières explosent : transferts d'argent, paiements de marchands, dépenses liées au pèlerinage</li>
  <li>Des dizaines de marques sont présentes avec leurs tentes, banderoles, et équipes terrain</li>
  <li>La compétition pour l'attention des pèlerins est féroce</li>
</ul>
<p>Orange Money avait un positionnement à consolider à Touba. La marque était connue, mais la concurrence — notamment Wave — gagnait du terrain auprès des jeunes pèlerins. L'objectif de la campagne était triple : augmenter la visibilité de la marque dans l'espace urbain de Touba, générer de nouvelles inscriptions au service, et renforcer la préférence de marque chez les pèlerins habituels.</p>

<h2>Le défi : repositionner Orange Money dans la sainte ville</h2>
<p>Touba n'est pas Dakar. Les règles y sont différentes. L'espace public est organisé selon des principes communautaires forts. La relation à la marque passe par la confiance et le respect des codes culturels mourides. Une campagne trop agressive ou déconnectée du contexte local peut se retourner contre la marque.</p>
<p>ATV a dû relever plusieurs défis simultanément :</p>
<ul>
  <li>Obtenir les emplacements stratégiques (axes d'entrée en ville, zones de marché, environs des grandes mosquées) dans un espace très disputé</li>
  <li>Créer des visuels qui respectent les codes esthétiques et culturels de Touba tout en restant dans la charte Orange</li>
  <li>Former et déployer une équipe d'animation capable de gérer des flux de foule exceptionnels</li>
  <li>Assurer la logistique sur 72 heures en conditions extrêmes (chaleur, foule, routes encombrées)</li>
</ul>

<h2>La stratégie ATV : présence physique totale</h2>
<p>Notre approche reposait sur trois piliers :</p>
<p><strong>Pilier 1 : La saturation visuelle des points chauds</strong><br/>
Nous avons cartographié les 12 points d'entrée et de passage les plus fréquentés de Touba pendant le Magal. Sur chacun de ces points, nous avons déployé un dispositif visuel complet : banderoles géantes (6m × 1,5m) sur les axes routiers, roll-up à l'entrée des zones marchandes, fanions tout le long des rues commerçantes. Au total, plus de 200 supports visuels ont été installés dans les 36 heures précédant l'arrivée des pèlerins.</p>
<p><strong>Pilier 2 : L'animation terrain proactive</strong><br/>
Nous avons déployé 15 animateurs en tenue Orange Money aux points stratégiques. Leur mission : accueillir les pèlerins, expliquer le service, aider à l'inscription, et distribuer des supports de communication personnalisés (flyers, gadgets). Les animateurs ont été formés en wolof et en pulaar pour maximiser leur efficacité auprès des différentes communautés présentes.</p>
<p><strong>Pilier 3 : Le dispositif mobile</strong><br/>
Un van brandé Orange Money ATV a circulé sur les principaux axes pendant les 48h du Magal, avec haut-parleur et équipe embarquée. Ce «&nbsp;bus de la communication&nbsp;» a permis d'atteindre des zones difficiles d'accès et d'animer des micro-événements spontanés dans les quartiers.</p>

<h2>Les résultats obtenus</h2>
<p>À l'issue de la campagne, les résultats ont dépassé les objectifs initiaux :</p>
<ul>
  <li><strong>+2 400 nouvelles inscriptions</strong> Orange Money générées pendant les 3 jours de campagne</li>
  <li><strong>Couverture de 100% des axes stratégiques</strong> de Touba avec au moins un support visuel</li>
  <li><strong>Taux de satisfaction client élevé</strong> mesuré en sortie de stand (92% de retours positifs)</li>
  <li><strong>Visibilité médiatique</strong> avec mention dans plusieurs médias locaux couvrant le Magal</li>
  <li><strong>Zéro incident</strong> malgré les conditions de foule exceptionnelles — preuve d'une logistique maîtrisée</li>
</ul>

<h2>Les leçons pour toute marque voulant conquérir Touba</h2>
<p>Cette campagne nous a confirmé plusieurs vérités sur la communication à Touba :</p>
<ul>
  <li><strong>Le respect des codes culturels est non-négociable</strong> : Les messages, les visuels, le comportement des équipes terrain doivent être alignés avec les valeurs mourides</li>
  <li><strong>La préparation logistique prime sur tout</strong> : Dans un contexte de foule, une défaillance logistique peut ruiner toute une campagne</li>
  <li><strong>L'humain reste le meilleur canal</strong> : Les pèlerins font confiance aux personnes, pas aux panneaux. L'animation humaine est 5 fois plus efficace que la signalétique seule</li>
  <li><strong>La combinaison terrain + digital amplifie les résultats</strong> : Chaque interaction terrain était doublée d'un hashtag, d'un QR code ou d'une invitation à s'abonner sur WhatsApp</li>
  <li><strong>Connaître Touba de l'intérieur est un avantage décisif</strong> : ATV, basée à Touba, connaît les quartiers, les acteurs locaux, et les dynamiques communautaires — ce qui a été déterminant</li>
</ul>
<p>Vous préparez une campagne pour le prochain Magal ou Gamou ? <strong>Agence Touba Visuel</strong> est votre partenaire local de référence. Contactez-nous dès maintenant pour anticiper et réserver les meilleurs emplacements.</p>
`,
  },
  {
    id: "5",
    slug: "facebook-tiktok-instagram-quelle-plateforme-business-senegalais",
    titre: "Facebook vs TikTok vs Instagram : quelle plateforme pour votre business sénégalais ?",
    extrait:
      "Chaque réseau social a ses propres codes, son audience et ses forces. Au Sénégal, les dynamiques sont particulières. Voici un guide complet pour choisir la plateforme qui correspond vraiment à votre secteur et vos objectifs.",
    categorie: "Réseaux Sociaux",
    emoji: "📱",
    auteur: "Équipe ATV",
    datePublication: "20 avril 2026",
    tempsLecture: "7 min",
    populaire: false,
    contenu: `
<p>«&nbsp;Je dois être sur tous les réseaux sociaux.&nbsp;» C'est l'une des idées reçues les plus répandues chez les entrepreneurs sénégalais. La réalité est tout autre : mieux vaut exceller sur une ou deux plateformes que d'être médiocre sur cinq. Mais encore faut-il choisir les bonnes. Au Sénégal, les réseaux sociaux ont leurs propres dynamiques — et ce guide va vous aider à faire le bon choix.</p>

<h2>Les chiffres des réseaux sociaux au Sénégal (2025)</h2>
<p>Avant de choisir votre plateforme, voici les données de base :</p>
<ul>
  <li><strong>Facebook</strong> : 4,2 millions d'utilisateurs actifs mensuels — la plateforme la plus utilisée toutes générations confondues</li>
  <li><strong>WhatsApp</strong> : 8+ millions d'utilisateurs — mais c'est un canal de messagerie, pas un réseau social classique</li>
  <li><strong>TikTok</strong> : Croissance explosive, estimée à 2,5 millions d'utilisateurs actifs, surtout les 15-30 ans</li>
  <li><strong>Instagram</strong> : Environ 1,5 million d'utilisateurs, très concentrés sur Dakar et les grandes villes</li>
  <li><strong>YouTube</strong> : Fort pour la consommation de vidéo longue, moins pour la publication d'entreprises locales</li>
  <li><strong>LinkedIn</strong> : Utile uniquement pour le B2B et les profils professionnels</li>
</ul>

<h2>Facebook : toujours roi pour les 25-45 ans</h2>
<p>Facebook est souvent présenté comme «&nbsp;dépassé&nbsp;» par les jeunes — mais au Sénégal, c'est encore la plateforme numéro 1 pour les décideurs économiques. Les groupes Facebook locaux sont des marchés virtuels extrêmement actifs. Les pages business permettent de cibler géographiquement (Touba, Dakar, Saint-Louis) avec précision.</p>
<p><strong>Facebook est idéal pour :</strong></p>
<ul>
  <li>Les commerçants qui vendent en gros (B2B)</li>
  <li>Les services aux particuliers (salons de coiffure, restaurants, artisans)</li>
  <li>Les entreprises qui font de la publicité payante (Facebook Ads est très efficace au Sénégal)</li>
  <li>Les organisateurs d'événements (les événements Facebook fonctionnent encore très bien)</li>
  <li>Les marques qui ciblent les 30-55 ans avec du pouvoir d'achat</li>
</ul>
<p><strong>Point fort</strong> : Les groupes Facebook thématiques sénégalais (immo, emploi, vente) ont des millions de membres actifs.<br/>
<strong>Point faible</strong> : La portée organique des pages a fortement baissé — il faut investir en publicité pour être vu.</p>

<h2>TikTok : l'explosion chez les 16-30 ans</h2>
<p>TikTok a bouleversé le paysage digital sénégalais depuis 2023. La plateforme a un avantage unique : <strong>l'algorithme favorise les nouveaux créateurs</strong>. Contrairement à Facebook ou Instagram où votre nombre d'abonnés détermine votre portée, sur TikTok même un compte à 0 abonné peut faire un million de vues avec un bon contenu.</p>
<p><strong>TikTok est idéal pour :</strong></p>
<ul>
  <li>Les marques de mode, cosmétiques, alimentation — tout ce qui est visuellement spectaculaire</li>
  <li>Les services qui ciblent les 16-30 ans (musique, jeux, lifestyle)</li>
  <li>La pédagogie et le contenu expert en format court («&nbsp;tips&nbsp;» en vidéo)</li>
  <li>Le behind-the-scenes — montrer comment vous travaillez, vos coulisses</li>
  <li>Les artisans et créatifs qui peuvent montrer leur processus de création</li>
</ul>
<p><strong>Point fort</strong> : Portée organique massive pour le bon contenu — coût d'acquisition très bas.<br/>
<strong>Point faible</strong> : Demande de la créativité vidéo continue — pas adapté aux marques qui ne peuvent pas produire de vidéo régulièrement.</p>

<h2>Instagram : les commerçants et marques premium</h2>
<p>Instagram au Sénégal est une plateforme de prestige. Elle est utilisée principalement par les classes moyennes et aisées des grandes villes, les entrepreneurs branchés, et les marques qui veulent projeter une image premium. C'est aussi la plateforme de prédilection pour le shopping en ligne via les stories et le bouton «&nbsp;Acheter&nbsp;».</p>
<p><strong>Instagram est idéal pour :</strong></p>
<ul>
  <li>La mode, la beauté, le luxe accessible</li>
  <li>La restauration haut de gamme et les cafés tendance</li>
  <li>Les agences créatives (comme ATV) qui veulent montrer leur portfolio</li>
  <li>Les coachs, consultants et professions libérales</li>
  <li>Toute marque qui peut produire du contenu visuel de haute qualité</li>
</ul>
<p><strong>Point fort</strong> : Audience à fort pouvoir d'achat, shopping intégré, très bon pour le personal branding.<br/>
<strong>Point faible</strong> : Exige des photos de très haute qualité — le contenu amateur y est pénalisé.</p>

<h2>Comment choisir selon votre secteur</h2>
<p>Voici un tableau de recommandations rapides :</p>
<ul>
  <li><strong>Imprimerie / Signalétique</strong> → Facebook (groupes pro) + WhatsApp Business</li>
  <li><strong>Mode / Prêt-à-porter</strong> → Instagram + TikTok</li>
  <li><strong>Restaurant / Alimentation</strong> → Facebook + TikTok (pour les vidéos de cuisine)</li>
  <li><strong>Immobilier</strong> → Facebook + YouTube (vidéos de visites)</li>
  <li><strong>Beauté / Cosmétiques</strong> → Instagram + TikTok</li>
  <li><strong>Services financiers</strong> → Facebook + WhatsApp</li>
  <li><strong>Formation / Éducation</strong> → Facebook + YouTube + LinkedIn</li>
  <li><strong>Événementiel</strong> → Facebook (événements) + Instagram</li>
  <li><strong>B2B / Grossiste</strong> → Facebook + LinkedIn + WhatsApp</li>
</ul>

<h2>Notre recommandation finale</h2>
<p>Commencez par une seule plateforme, maîtrisez-la pendant 3 mois, puis ajoutez-en une deuxième. La régularité sur une plateforme vaut mieux que la dispersion sur toutes. Et quelle que soit la plateforme choisie, <strong>WhatsApp reste le canal de conversion final</strong> — ramenez toujours votre audience vers WhatsApp pour concrétiser la vente.</p>
<p>L'équipe d'<strong>Agence Touba Visuel</strong> crée du contenu optimisé pour chaque plateforme et gère les réseaux sociaux de ses clients. Contactez-nous pour un audit de votre présence digitale actuelle.</p>
`,
  },
  {
    id: "6",
    slug: "animation-terrain-communication-physique-indispensable-touba",
    titre: "Animation terrain : pourquoi la communication physique reste indispensable à Touba",
    extrait:
      "À l'heure du tout-digital, la communication physique n'a pas disparu — elle s'est renforcée. À Touba, ville à fort trafic où se croisent millions de pèlerins et commerçants du monde entier, la présence terrain reste un avantage concurrentiel décisif.",
    categorie: "Communication Terrain",
    emoji: "🚀",
    auteur: "Mamadou Falilou Ndiaye",
    datePublication: "12 avril 2026",
    tempsLecture: "6 min",
    populaire: false,
    contenu: `
<p>On nous demande souvent : «&nbsp;Avec les réseaux sociaux, est-ce qu'on a encore besoin de banderoles et d'animations terrain ?&nbsp;» La réponse est non seulement «&nbsp;oui&nbsp;», mais la communication terrain est devenue <strong>encore plus stratégique</strong> dans l'environnement hypersaturé du digital. Et à Touba, cette vérité s'applique avec une intensité particulière.</p>

<h2>Touba, une ville unique à fort trafic</h2>
<p>Touba n'est pas une ville ordinaire. C'est le cœur spirituel de la confrérie mouride, qui compte des millions de fidèles à travers le monde entier. Cette réalité crée une dynamique de trafic humain sans équivalent :</p>
<ul>
  <li><strong>Le Magal annuel</strong> : 3 à 4 millions de pèlerins en 48 heures — l'un des plus grands rassemblements humains d'Afrique</li>
  <li><strong>Le Gamou</strong> : Autre événement religieux majeur qui attire des centaines de milliers de fidèles</li>
  <li><strong>Les dahiras</strong> : Regroupements réguliers dans toute la ville tout au long de l'année</li>
  <li><strong>Le marché quotidien</strong> : Touba est un hub commercial important pour la sous-région — marchands de Dakar, du Mali, de la Mauritanie et de la Guinée y sont présents régulièrement</li>
  <li><strong>Les résidents permanents</strong> : Une population fixe en forte croissance, avec une démographie jeune et active</li>
</ul>
<p>Cette concentration de flux humains crée des opportunités de visibilité qu'aucune campagne digitale ne peut pleinement reproduire.</p>

<h2>Ce que le digital ne remplace pas</h2>
<p>Le digital est excellent pour certaines choses : toucher des audiences lointaines, cibler des segments précis, mesurer les résultats en temps réel. Mais il ne peut pas reproduire certains effets de la présence physique :</p>
<ul>
  <li><strong>L'effet de masse visuelle</strong> : Une banderole de 6 mètres en entrée de ville crée un impact émotionnel qu'aucune pub Facebook ne peut égaler</li>
  <li><strong>La confiance par la présence</strong> : Au Sénégal, «&nbsp;les voir en vrai&nbsp;» reste un facteur de confiance majeur. Les marques présentes physiquement à Touba sont perçues comme plus sérieuses</li>
  <li><strong>L'interaction humaine</strong> : Un animateur qui explique, démontre, et répond aux questions convertit bien mieux qu'une publicité en ligne</li>
  <li><strong>L'accessibilité à tous</strong> : Pas tout le monde à Touba n'est sur les réseaux sociaux — mais tout le monde passe dans les rues. La communication terrain touche 100% de la population locale</li>
  <li><strong>La durée d'exposition</strong> : Une banderole est visible 24h/24 pendant des semaines. Votre pub Facebook n'est vue qu'à l'instant où quelqu'un scroll</li>
</ul>

<h2>Les outils terrain indispensables</h2>
<p>Une communication terrain efficace à Touba repose sur plusieurs supports complémentaires :</p>
<p><strong>Les banderoles et oriflammes</strong><br/>
C'est le support king à Touba. Les grandes banderoles en entrée de ville, sur les axes commerciaux, et autour des zones à fort trafic sont incontournables. Pour être efficaces, elles doivent avoir un message court (5-7 mots maximum), des couleurs de marque respectées, et être placées à des hauteurs et des angles qui maximisent la visibilité depuis la rue.</p>
<p><strong>Les roll-up et kakémonos</strong><br/>
Pour les stands, boutiques, et espaces intérieurs. Les roll-up permettent de créer rapidement une présence professionnelle dans n'importe quel espace. Ils sont transportables et réutilisables — un excellent investissement pour les marques présentes régulièrement à Touba.</p>
<p><strong>Les tee-shirts et uniformes brandés</strong><br/>
Vos équipes terrain portent votre marque. Un animateur en tee-shirt Orange Money est un panneau publicitaire mobile. Les tee-shirts d'équipe créent aussi un sentiment d'appartenance et de professionnalisme qui rassure les clients potentiels.</p>
<p><strong>Le van ou bus brandé</strong><br/>
Un véhicule habillé aux couleurs de votre marque est l'outil le plus impactant pour couvrir une grande zone géographique. Il attire l'attention, peut transporter du matériel, et sert de point de ralliement pour vos équipes. Avec un haut-parleur, il devient un outil d'animation à part entière.</p>
<p><strong>Les flyers et catalogues imprimés</strong><br/>
Malgré le digital, le flyer papier reste un outil efficace à Touba. Remis en main propre avec un sourire et une explication verbale, il a un taux de mémorisation bien supérieur à une pub en ligne.</p>

<h2>Comment combiner terrain + digital pour maximiser l'impact</h2>
<p>Les meilleures campagnes combinent les deux approches en synergie :</p>
<ul>
  <li>Ajoutez un <strong>QR code sur vos banderoles</strong> qui renvoie vers votre WhatsApp ou votre page Instagram</li>
  <li>Créez un <strong>hashtag de campagne</strong> visible sur tous vos supports terrain et relancez-le sur les réseaux sociaux</li>
  <li>Photographiez et filmez vos installations terrain pour les <strong>poster sur vos réseaux</strong> — ça montre votre sérieux et votre envergure</li>
  <li>Utilisez la <strong>géolocalisation Facebook Ads</strong> pour cibler les personnes dans un rayon de 5 km autour de vos installations terrain</li>
  <li>Collectez des contacts lors des animations terrain et créez des <strong>listes WhatsApp de suivi</strong></li>
</ul>

<h2>Témoignage : la leçon Orange Money à Touba</h2>
<p>Lors de notre campagne Zénith Touba pour Orange Money, nous avons mesuré un phénomène intéressant : les jours où nos animateurs terrain étaient les plus actifs, les inscriptions sur l'application mobile augmentaient également — y compris dans des zones où nos animateurs n'étaient pas physiquement présents. La présence terrain avait créé un effet de buzz local qui se propageait via WhatsApp et les discussions en famille.</p>
<p>C'est la puissance de la combinaison terrain + digital : l'un amplifie l'autre de façon exponentielle.</p>
<p><strong>Agence Touba Visuel</strong> est la seule agence de communication basée à Touba avec une expertise complète en communication terrain et digital. Nous connaissons les emplacements, les réseaux, et les codes culturels. Contactez-nous pour planifier votre prochaine campagne.</p>
`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesSimilaires(
  article: Article,
  limit = 3
): Article[] {
  return ARTICLES.filter(
    (a) => a.id !== article.id && a.categorie === article.categorie
  )
    .concat(ARTICLES.filter((a) => a.id !== article.id && a.categorie !== article.categorie))
    .slice(0, limit);
}

export const CATEGORIES: CategorieArticle[] = [
  "Stratégie Digitale",
  "Réseaux Sociaux",
  "Identité Visuelle",
  "Étude de Cas",
  "WhatsApp Marketing",
  "Communication Terrain",
];

export const COULEURS_CATEGORIES: Record<CategorieArticle, string> = {
  "Stratégie Digitale": "bg-blue-100 text-blue-800",
  "Réseaux Sociaux": "bg-purple-100 text-purple-800",
  "Identité Visuelle": "bg-pink-100 text-pink-800",
  "Étude de Cas": "bg-amber-100 text-amber-800",
  "WhatsApp Marketing": "bg-green-100 text-green-800",
  "Communication Terrain": "bg-orange-100 text-orange-800",
};
