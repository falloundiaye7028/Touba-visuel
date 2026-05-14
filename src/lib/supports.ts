export interface SupportItem {
  id: string;
  nom: string;
  slug: string;
  description: string;
  prixBase: number;
  unite: string;
  formats?: string[];
  emoji: string;
  populaire?: boolean;
}

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  emoji: string;
  description: string;
  couleur: string;
  supports: SupportItem[];
}

export const CATALOGUE: Categorie[] = [
  {
    id: "impression-papier",
    nom: "Impression & Papier",
    slug: "impression-papier",
    emoji: "🖨️",
    description: "Tous vos supports imprimés : flyers, affiches, cartes de visite, brochures et bien plus",
    couleur: "bg-blue-500",
    supports: [
      { id: "flyer-a4", nom: "Flyer A4", slug: "flyer-a4", description: "Flyer format A4 recto ou recto/verso, idéal pour événements et promotions", prixBase: 150, unite: "par 100 ex.", formats: ["A4 (21×29.7cm)"], emoji: "📄", populaire: true },
      { id: "flyer-a5", nom: "Flyer A5", slug: "flyer-a5", description: "Flyer format A5, compact et pratique pour diffusion facile", prixBase: 100, unite: "par 100 ex.", formats: ["A5 (14.8×21cm)"], emoji: "📄", populaire: true },
      { id: "flyer-a6", nom: "Flyer A6", slug: "flyer-a6", description: "Petit flyer format A6, parfait pour les cartes d'invitation", prixBase: 75, unite: "par 100 ex.", formats: ["A6 (10.5×14.8cm)"], emoji: "📄" },
      { id: "affiche-a3", nom: "Affiche A3", slug: "affiche-a3", description: "Affiche grand format A3 pour vos événements et annonces", prixBase: 500, unite: "par 50 ex.", formats: ["A3 (29.7×42cm)"], emoji: "🖼️", populaire: true },
      { id: "affiche-a2", nom: "Affiche A2", slug: "affiche-a2", description: "Grande affiche A2 à fort impact visuel", prixBase: 800, unite: "par 25 ex.", formats: ["A2 (42×59.4cm)"], emoji: "🖼️" },
      { id: "affiche-a1", nom: "Affiche A1", slug: "affiche-a1", description: "Très grande affiche A1 pour une visibilité maximale", prixBase: 1500, unite: "par 10 ex.", formats: ["A1 (59.4×84.1cm)"], emoji: "🖼️" },
      { id: "carte-visite", nom: "Carte de Visite", slug: "carte-visite", description: "Cartes de visite professionnelles, finition mat ou brillante", prixBase: 5000, unite: "par 500 ex.", formats: ["85×54mm", "90×55mm"], emoji: "💼", populaire: true },
      { id: "brochure-a4", nom: "Brochure / Dépliant A4", slug: "brochure-a4", description: "Brochure pliée en 2 ou 3 volets, idéale pour présenter vos services", prixBase: 300, unite: "par 100 ex.", formats: ["A4 plié en 2", "A4 plié en 3"], emoji: "📋" },
      { id: "catalogue", nom: "Catalogue / Magazine", slug: "catalogue", description: "Catalogue ou magazine personnalisé avec reliure agrafée ou collée", prixBase: 2500, unite: "par 50 ex.", formats: ["A4", "A5"], emoji: "📚" },
      { id: "carte-postale", nom: "Carte Postale", slug: "carte-postale", description: "Cartes postales personnalisées pour vos campagnes marketing", prixBase: 200, unite: "par 100 ex.", formats: ["10×15cm", "15×21cm"], emoji: "📬" },
      { id: "papier-entete", nom: "Papier à En-tête", slug: "papier-entete", description: "Papier à en-tête professionnel avec votre logo et coordonnées", prixBase: 500, unite: "par 500 ex.", formats: ["A4"], emoji: "📝" },
      { id: "enveloppe", nom: "Enveloppe Personnalisée", slug: "enveloppe", description: "Enveloppes à votre image pour votre courrier professionnel", prixBase: 400, unite: "par 200 ex.", formats: ["C4", "C5", "DL"], emoji: "✉️" },
      { id: "calendrier-mural", nom: "Calendrier Mural", slug: "calendrier-mural", description: "Calendrier mural 12 mois avec vos visuels et logo", prixBase: 3500, unite: "par 50 ex.", formats: ["A3", "A2"], emoji: "📅" },
      { id: "calendrier-bureau", nom: "Calendrier de Bureau", slug: "calendrier-bureau", description: "Chevalet calendrier de bureau personnalisé", prixBase: 2000, unite: "par 50 ex.", formats: ["A5", "A6"], emoji: "🗓️" },
      { id: "bloc-notes", nom: "Bloc-notes Personnalisé", slug: "bloc-notes", description: "Bloc-notes avec couverture à votre image, 50 ou 100 feuillets", prixBase: 1500, unite: "par 50 ex.", formats: ["A5", "A6"], emoji: "📒" },
      { id: "livret", nom: "Livret / Programme", slug: "livret", description: "Livret agrafé pour programmes d'événements, menus ou catalogues", prixBase: 800, unite: "par 50 ex.", formats: ["A4", "A5"], emoji: "📖" },
      { id: "menu-restaurant", nom: "Menu Restaurant", slug: "menu-restaurant", description: "Menu plastifié ou en carte pour restaurant, hôtel, café", prixBase: 1200, unite: "par 20 ex.", formats: ["A4", "A3"], emoji: "🍽️" },
      { id: "etiquette", nom: "Étiquettes Autocollantes", slug: "etiquette", description: "Étiquettes adhésives personnalisées pour produits ou emballages", prixBase: 300, unite: "par 200 ex.", formats: ["Ronde", "Carrée", "Rectangulaire"], emoji: "🏷️" },
      { id: "timbre-tampon", nom: "Tampon Encreur", slug: "timbre-tampon", description: "Tampon encreur personnalisé avec logo et informations", prixBase: 2500, unite: "par unité", formats: ["28×70mm", "40×58mm", "60×90mm"], emoji: "🔖" },
    ],
  },
  {
    id: "signaletique-grand-format",
    nom: "Signalétique & Grand Format",
    slug: "signaletique-grand-format",
    emoji: "🏗️",
    description: "Banderoles, bâches, roll-up, panneaux, enseignes et tout pour votre visibilité extérieure",
    couleur: "bg-orange-500",
    supports: [
      { id: "banderole", nom: "Banderole / Bâche", slug: "banderole", description: "Banderole publicitaire en bâche PVC résistante aux intempéries", prixBase: 3500, unite: "par m²", formats: ["Sur mesure"], emoji: "🏳️", populaire: true },
      { id: "rollup", nom: "Roll-up / Kakémono", slug: "rollup", description: "Présentoir enrouleur portable, idéal pour salons et événements", prixBase: 25000, unite: "par unité", formats: ["85×200cm", "100×200cm", "120×200cm"], emoji: "📜", populaire: true },
      { id: "xbanner", nom: "X-Banner", slug: "xbanner", description: "Kakémono sur pied en X, léger et facile à transporter", prixBase: 18000, unite: "par unité", formats: ["60×160cm", "80×180cm"], emoji: "🚩" },
      { id: "panneau-alucobond", nom: "Panneau Alucobond / Dibond", slug: "panneau-alucobond", description: "Panneau aluminium composite rigide pour signalétique intérieure/extérieure", prixBase: 8000, unite: "par m²", formats: ["Sur mesure"], emoji: "🪟" },
      { id: "panneau-pvc", nom: "Panneau PVC", slug: "panneau-pvc", description: "Panneau en mousse PVC léger pour affichage intérieur", prixBase: 4000, unite: "par m²", formats: ["Sur mesure"], emoji: "📐" },
      { id: "billboard", nom: "Panneau Billboard (4×3m)", slug: "billboard", description: "Impression grand format pour panneaux publicitaires 4×3 mètres", prixBase: 35000, unite: "par face", formats: ["4×3m", "8×3m"], emoji: "🏙️" },
      { id: "vitrophanie", nom: "Vitrophanie / Adhésif Vitrine", slug: "vitrophanie", description: "Autocollant pour vitrine, fenêtre ou surface lisse", prixBase: 5000, unite: "par m²", formats: ["Sur mesure"], emoji: "🪟" },
      { id: "enseigne-lumineuse", nom: "Enseigne Lumineuse LED", slug: "enseigne-lumineuse", description: "Enseigne lumineuse avec éclairage LED pour votre commerce", prixBase: 75000, unite: "par m²", formats: ["Sur mesure"], emoji: "💡", populaire: true },
      { id: "totem", nom: "Totem Publicitaire", slug: "totem", description: "Totem vertical imposant pour une visibilité à 360°", prixBase: 150000, unite: "par unité", formats: ["Sur mesure"], emoji: "🗿" },
      { id: "panneau-directionnel", nom: "Panneau Directionnel", slug: "panneau-directionnel", description: "Panneau de signalétique directionnelle pour guider vos visiteurs", prixBase: 12000, unite: "par unité", formats: ["Sur mesure"], emoji: "➡️" },
      { id: "toile-tendue", nom: "Toile Tendue / Cadre Tissu", slug: "toile-tendue", description: "Impression sur tissu dans cadre aluminium, rendu premium", prixBase: 15000, unite: "par m²", formats: ["Sur mesure"], emoji: "🎨" },
      { id: "palissade", nom: "Palissade de Chantier", slug: "palissade", description: "Habillage de palissade ou clôture de chantier", prixBase: 3000, unite: "par m linéaire", formats: ["Sur mesure"], emoji: "🚧" },
      { id: "adhesif-voiture", nom: "Covering Véhicule", slug: "adhesif-voiture", description: "Marquage et décoration de véhicules, partiel ou total", prixBase: 20000, unite: "par côté", formats: ["Sur mesure"], emoji: "🚗", populaire: true },
      { id: "stand-expo", nom: "Stand d'Exposition", slug: "stand-expo", description: "Stand complet avec structure, impression et mobilier pour salons", prixBase: 200000, unite: "par m²", formats: ["3×3m", "4×4m", "6×3m", "Sur mesure"], emoji: "🏪" },
    ],
  },
  {
    id: "textile-objets",
    nom: "Textile & Objets Publicitaires",
    slug: "textile-objets",
    emoji: "👕",
    description: "T-shirts, casquettes, mugs, stylos et tous les objets personnalisés pour promouvoir votre marque",
    couleur: "bg-purple-500",
    supports: [
      { id: "tshirt", nom: "T-Shirt Personnalisé", slug: "tshirt", description: "T-shirt coton avec sérigraphie ou transfert numérique", prixBase: 2500, unite: "par unité", formats: ["XS", "S", "M", "L", "XL", "XXL"], emoji: "👕", populaire: true },
      { id: "polo", nom: "Polo Personnalisé", slug: "polo", description: "Polo professionnel brodé ou imprimé avec votre logo", prixBase: 4500, unite: "par unité", formats: ["S", "M", "L", "XL", "XXL"], emoji: "👔" },
      { id: "hoodie", nom: "Hoodie / Sweat-shirt", slug: "hoodie", description: "Sweat à capuche personnalisé pour votre équipe ou événement", prixBase: 8000, unite: "par unité", formats: ["S", "M", "L", "XL", "XXL"], emoji: "🧥" },
      { id: "casquette", nom: "Casquette / Bob", slug: "casquette", description: "Casquette ou bob brodé avec votre logo", prixBase: 3000, unite: "par unité", formats: ["Taille unique ajustable"], emoji: "🧢", populaire: true },
      { id: "veste-trabson", nom: "Veste / Coupe-vent", slug: "veste-trabson", description: "Veste personnalisée pour vos équipes ou événements corporate", prixBase: 15000, unite: "par unité", formats: ["S", "M", "L", "XL", "XXL"], emoji: "🥼" },
      { id: "tablier", nom: "Tablier Personnalisé", slug: "tablier", description: "Tablier de cuisine ou de travail avec logo et nom", prixBase: 3500, unite: "par unité", formats: ["Taille unique"], emoji: "👨‍🍳" },
      { id: "mug", nom: "Mug Personnalisé", slug: "mug", description: "Mug céramique 330ml avec impression sublimation HD", prixBase: 2500, unite: "par unité", formats: ["330ml", "450ml"], emoji: "☕", populaire: true },
      { id: "bouteille", nom: "Bouteille Personnalisée", slug: "bouteille", description: "Bouteille inox ou plastique avec impression de votre logo", prixBase: 4000, unite: "par unité", formats: ["500ml", "750ml"], emoji: "🍶" },
      { id: "stylo", nom: "Stylo Personnalisé", slug: "stylo", description: "Stylo bille ou gel avec impression laser ou sérigraphie", prixBase: 500, unite: "par unité", formats: ["Bille", "Gel"], emoji: "✒️" },
      { id: "sac-tote", nom: "Tote Bag / Sac Personnalisé", slug: "sac-tote", description: "Sac cabas en coton ou non-tissé avec impression", prixBase: 1500, unite: "par unité", formats: ["38×42cm", "42×50cm"], emoji: "👜" },
      { id: "badge", nom: "Badge / Épingle", slug: "badge", description: "Badge rond ou rectangulaire pour événements et associations", prixBase: 200, unite: "par unité", formats: ["Ø25mm", "Ø32mm", "Ø50mm", "45×70mm"], emoji: "📌" },
      { id: "porte-cles", nom: "Porte-clés Personnalisé", slug: "porte-cles", description: "Porte-clés métal, acrylique ou cuir avec gravure ou impression", prixBase: 800, unite: "par unité", formats: ["Rond", "Rectangulaire", "Forme custom"], emoji: "🔑" },
      { id: "bracelet", nom: "Bracelet Personnalisé", slug: "bracelet", description: "Bracelet silicone ou tissu pour événements et associations", prixBase: 300, unite: "par unité", formats: ["Standard", "Enfant"], emoji: "⌚" },
      { id: "cle-usb", nom: "Clé USB Personnalisée", slug: "cle-usb", description: "Clé USB avec gravure ou sérigraphie de votre logo", prixBase: 3500, unite: "par unité", formats: ["8Go", "16Go", "32Go"], emoji: "💾" },
      { id: "parapluie", nom: "Parapluie Personnalisé", slug: "parapluie", description: "Parapluie avec impression de votre logo sur les panneaux", prixBase: 5000, unite: "par unité", formats: ["Ø100cm", "Ø120cm"], emoji: "☂️" },
      { id: "coussin", nom: "Coussin Personnalisé", slug: "coussin", description: "Coussin avec impression photo ou logo en sublimation", prixBase: 3500, unite: "par unité", formats: ["30×30cm", "40×40cm"], emoji: "🛋️" },
      { id: "puzzle", nom: "Puzzle Personnalisé", slug: "puzzle", description: "Puzzle avec votre photo ou design, idéal cadeau", prixBase: 4000, unite: "par unité", formats: ["A4 (252 pièces)", "A3 (500 pièces)"], emoji: "🧩" },
    ],
  },
  {
    id: "numerique-digital",
    nom: "Numérique & Digital",
    slug: "numerique-digital",
    emoji: "💻",
    description: "Visuels pour réseaux sociaux, sites web, email marketing, logos, motion design et identité visuelle",
    couleur: "bg-cyan-500",
    supports: [
      { id: "logo", nom: "Logo & Identité Visuelle", slug: "logo", description: "Création de logo professionnel avec charte graphique complète", prixBase: 35000, unite: "par projet", formats: ["PNG", "SVG", "AI", "PDF"], emoji: "✨", populaire: true },
      { id: "charte-graphique", nom: "Charte Graphique Complète", slug: "charte-graphique", description: "Identité visuelle complète : logo, couleurs, typographies, applications", prixBase: 75000, unite: "par projet", formats: ["PDF + fichiers sources"], emoji: "🎨" },
      { id: "post-instagram", nom: "Post Instagram / Facebook", slug: "post-instagram", description: "Visuel carré pour publication sur Instagram ou Facebook", prixBase: 5000, unite: "par visuel", formats: ["1080×1080px", "1200×1200px"], emoji: "📱", populaire: true },
      { id: "story-instagram", nom: "Story Instagram / WhatsApp", slug: "story-instagram", description: "Visuel vertical pour Stories et WhatsApp Status", prixBase: 4000, unite: "par visuel", formats: ["1080×1920px"], emoji: "📲", populaire: true },
      { id: "cover-facebook", nom: "Couverture Facebook / Twitter", slug: "cover-facebook", description: "Photo de couverture pour page Facebook ou Twitter", prixBase: 4000, unite: "par visuel", formats: ["1640×856px (Facebook)", "1500×500px (Twitter)"], emoji: "🖥️" },
      { id: "banniere-web", nom: "Bannière Web / Publicité Display", slug: "banniere-web", description: "Bannières publicitaires pour campagnes Google Ads ou sites web", prixBase: 6000, unite: "par visuel", formats: ["728×90px", "300×250px", "160×600px", "320×50px"], emoji: "🌐" },
      { id: "newsletter", nom: "Template Email / Newsletter", slug: "newsletter", description: "Modèle d'email marketing professionnel pour vos campagnes", prixBase: 15000, unite: "par template", formats: ["HTML responsive", "600px de large"], emoji: "📧" },
      { id: "signature-email", nom: "Signature Email Pro", slug: "signature-email", description: "Signature email HTML professionnelle avec photo et coordonnées", prixBase: 8000, unite: "par unité", formats: ["HTML", "PNG"], emoji: "✍️" },
      { id: "presentation-ppt", nom: "Présentation PowerPoint", slug: "presentation-ppt", description: "Template PowerPoint ou Google Slides à votre image", prixBase: 25000, unite: "par projet", formats: ["PPTX", "PDF", "Google Slides"], emoji: "📊", populaire: true },
      { id: "video-motion", nom: "Vidéo Animée / Motion Design", slug: "video-motion", description: "Animation vidéo courte (15-30s) pour réseaux sociaux ou pub", prixBase: 50000, unite: "par vidéo", formats: ["MP4 HD 1080p", "GIF"], emoji: "🎬", populaire: true },
      { id: "reels-shorts", nom: "Reels / TikTok / Shorts", slug: "reels-shorts", description: "Montage et animation pour Reels Instagram, TikTok ou YouTube Shorts", prixBase: 35000, unite: "par vidéo", formats: ["MP4 9:16 1080×1920px"], emoji: "🎥" },
      { id: "qr-code", nom: "QR Code Personnalisé", slug: "qr-code", description: "QR code design avec votre logo et couleurs intégrés", prixBase: 3000, unite: "par unité", formats: ["PNG HD", "SVG"], emoji: "📲" },
      { id: "infographie", nom: "Infographie", slug: "infographie", description: "Infographie visuelle pour présenter vos données ou processus", prixBase: 20000, unite: "par visuel", formats: ["PNG HD", "PDF"], emoji: "📊" },
      { id: "mockup", nom: "Mockup / Maquette 3D", slug: "mockup", description: "Mise en scène 3D de vos produits ou supports de communication", prixBase: 10000, unite: "par visuel", formats: ["PNG HD", "JPG"], emoji: "🖼️" },
    ],
  },
  {
    id: "evenementiel",
    nom: "Événementiel & Décoration",
    slug: "evenementiel",
    emoji: "🎉",
    description: "Backdrop, step & repeat, décoration de salle, nappes, présentoirs et signalétique événementielle",
    couleur: "bg-pink-500",
    supports: [
      { id: "backdrop", nom: "Backdrop / Mur Médias", slug: "backdrop", description: "Fond photo pour conférences de presse, photocalls et événements", prixBase: 45000, unite: "par unité", formats: ["2×2m", "3×2m", "4×2m", "5×2m"], emoji: "🎞️", populaire: true },
      { id: "step-repeat", nom: "Step & Repeat", slug: "step-repeat", description: "Fond répétitif de logos pour tapis rouge et événements VIP", prixBase: 55000, unite: "par unité", formats: ["3×2m", "4×2m", "6×2m"], emoji: "🔴" },
      { id: "nappe-personnalisee", nom: "Nappe Personnalisée", slug: "nappe-personnalisee", description: "Nappe de table imprimée avec votre logo pour stands et buffets", prixBase: 15000, unite: "par unité", formats: ["140×240cm", "140×300cm"], emoji: "🪑" },
      { id: "ballon-personnalise", nom: "Ballon Personnalisé", slug: "ballon-personnalise", description: "Ballons gonflables imprimés avec votre logo ou message", prixBase: 500, unite: "par unité", formats: ["Ø28cm", "Ø35cm"], emoji: "🎈" },
      { id: "invitation", nom: "Carton d'Invitation", slug: "invitation", description: "Carton d'invitation haut de gamme pour mariages, cérémonies et galas", prixBase: 800, unite: "par unité", formats: ["A5", "A6", "Format custom"], emoji: "💌", populaire: true },
      { id: "programme-event", nom: "Programme / Ordre du Jour", slug: "programme-event", description: "Programme d'événement avec ordres du jour et horaires", prixBase: 500, unite: "par unité", formats: ["A5", "A4 plié"], emoji: "📋" },
      { id: "badge-nominatif", nom: "Badge Nominatif Événement", slug: "badge-nominatif", description: "Badge participant avec nom, titre et QR code pour événements", prixBase: 300, unite: "par unité", formats: ["85×54mm", "90×60mm"], emoji: "🪪" },
      { id: "kakemono-event", nom: "Kakémono Événementiel", slug: "kakemono-event", description: "Roll-up décoratif spécial événement avec structure et sac de transport", prixBase: 30000, unite: "par unité", formats: ["60×160cm", "85×200cm", "100×200cm"], emoji: "🎪" },
      { id: "drapeau-personnalise", nom: "Drapeau Personnalisé", slug: "drapeau-personnalise", description: "Drapeau imprimé sur tissu polyester avec mât ou cravate", prixBase: 8000, unite: "par unité", formats: ["60×90cm", "90×150cm", "120×180cm"], emoji: "🚩" },
      { id: "photobooth", nom: "Cadre Photobooth", slug: "photobooth", description: "Cadre décoratif pour photobooth avec accessoires assortis", prixBase: 35000, unite: "par unité", formats: ["100×150cm", "120×180cm"], emoji: "📸" },
    ],
  },
  {
    id: "conditionnement-emballage",
    nom: "Conditionnement & Emballage",
    slug: "conditionnement-emballage",
    emoji: "📦",
    description: "Boîtes, sacs, étiquettes produits, pochettes et emballages personnalisés pour vos produits",
    couleur: "bg-yellow-500",
    supports: [
      { id: "boite-carton", nom: "Boîte Carton Personnalisée", slug: "boite-carton", description: "Boîte carton avec impression de votre logo pour vos produits", prixBase: 800, unite: "par unité (min 100)", formats: ["Sur mesure"], emoji: "📦", populaire: true },
      { id: "sac-papier", nom: "Sac Papier Personnalisé", slug: "sac-papier", description: "Sac kraft ou papier couché avec cordelette et logo", prixBase: 600, unite: "par unité (min 100)", formats: ["Petit", "Moyen", "Grand", "Sur mesure"], emoji: "🛍️" },
      { id: "etiquette-produit", nom: "Étiquette Produit", slug: "etiquette-produit", description: "Étiquette adhésive pour produits alimentaires, cosmétiques ou autres", prixBase: 100, unite: "par 100 ex.", formats: ["Ronde", "Ovale", "Rectangulaire", "Sur mesure"], emoji: "🏷️" },
      { id: "pochette-cadeau", nom: "Pochette / Enveloppe Cadeau", slug: "pochette-cadeau", description: "Pochette cadeau personnalisée pour offrir vos produits avec style", prixBase: 400, unite: "par unité", formats: ["A5", "A4", "Sur mesure"], emoji: "🎁" },
      { id: "intercalaire-tissu", nom: "Papier Tissu Personnalisé", slug: "intercalaire-tissu", description: "Papier de soie imprimé pour habiller vos emballages cadeaux", prixBase: 200, unite: "par feuille", formats: ["50×70cm"], emoji: "🎀" },
    ],
  },
  {
    id: "identite-corporate",
    nom: "Identité Corporate & Papeterie",
    slug: "identite-corporate",
    emoji: "🏢",
    description: "Tout votre univers corporatif : papeterie d'entreprise, uniformes, véhicules et communication interne",
    couleur: "bg-gray-600",
    supports: [
      { id: "kit-demarrage", nom: "Kit Démarrage Entreprise", slug: "kit-demarrage", description: "Logo + Cartes de visite + Papier en-tête + Enveloppes + Tampons", prixBase: 75000, unite: "pack complet", formats: ["Livrables numériques + imprimés"], emoji: "🚀", populaire: true },
      { id: "annuaire-entreprise", nom: "Plaquette Entreprise", slug: "annuaire-entreprise", description: "Plaquette de présentation institutionnelle de votre entreprise", prixBase: 30000, unite: "par 100 ex.", formats: ["A4 4 pages", "A4 8 pages"], emoji: "🏛️" },
      { id: "uniform-brode", nom: "Uniformes Brodés", slug: "uniform-brode", description: "Chemises, polos et vestes avec votre logo brodé pour vos équipes", prixBase: 7000, unite: "par unité", formats: ["XS au XXXL"], emoji: "👗" },
      { id: "vehicule-commercial", nom: "Habillage Flotte Véhicules", slug: "vehicule-commercial", description: "Personnalisation complète de votre flotte de véhicules", prixBase: 45000, unite: "par véhicule", formats: ["Voiture", "Camion", "Camionnette", "Moto"], emoji: "🚐" },
      { id: "panneau-bureau", nom: "Signalétique Bureau / Showroom", slug: "panneau-bureau", description: "Plaques, totems et signalétique intérieure pour vos locaux", prixBase: 20000, unite: "par ensemble", formats: ["Sur mesure"], emoji: "🏢" },
    ],
  },
  {
    id: "presse-media",
    nom: "Presse & Médias",
    slug: "presse-media",
    emoji: "📰",
    description: "Insertions presse, journaux, magazines, dossiers de presse et supports médiatiques",
    couleur: "bg-red-500",
    supports: [
      { id: "insertion-presse", nom: "Visuel Insertion Presse", slug: "insertion-presse", description: "Création de publicité pour insertion dans journaux et magazines", prixBase: 25000, unite: "par visuel", formats: ["1/1 page", "1/2 page", "1/4 page"], emoji: "📰" },
      { id: "dossier-presse", nom: "Dossier de Presse", slug: "dossier-presse", description: "Dossier de presse professionnel pour journalistes et partenaires", prixBase: 40000, unite: "par projet", formats: ["PDF + Print"], emoji: "📁" },
      { id: "communique-presse", nom: "Design Communiqué de Presse", slug: "communique-presse", description: "Mise en page de communiqués de presse au format professionnel", prixBase: 15000, unite: "par document", formats: ["PDF A4"], emoji: "📋" },
      { id: "spot-radio", nom: "Visuel Accompagnement Radio", slug: "spot-radio", description: "Visuel graphique pour accompagner vos spots et campagnes radio", prixBase: 20000, unite: "par visuel", formats: ["PNG HD", "JPEG"], emoji: "📻" },
    ],
  },
];

export function getAllSupports(): SupportItem[] {
  return CATALOGUE.flatMap((cat) => cat.supports);
}

export function getSupportBySlug(slug: string): SupportItem | undefined {
  return getAllSupports().find((s) => s.slug === slug);
}

export function getCategorieBySlug(slug: string): Categorie | undefined {
  return CATALOGUE.find((c) => c.slug === slug);
}

export function getSupportsPopulaires(): SupportItem[] {
  return getAllSupports().filter((s) => s.populaire);
}

export const TOTAL_SUPPORTS = getAllSupports().length;
export const TOTAL_CATEGORIES = CATALOGUE.length;
