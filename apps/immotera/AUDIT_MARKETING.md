# INTELLIGENCE IMMOBILIER — Audit marketing de la landing page

Date de l'audit : 31 août 2026
Périmètre : landing page, navigation, hero, démonstration produit, tarifs, connexion, inscription, routes publiques, SEO, responsive et composants de marque.

## Synthèse

La base visuelle est différenciante et premium, mais la page explique encore insuffisamment l'étendue réelle du produit. L'IA est visible sans être démontrée comme un outil métier complet. Les écrans produit, les cas d'usage, le CRM, l'espace propriétaire, l'import et les moyens de paiement restent trop abstraits. La conversion souffre également de CTA hétérogènes, d'un footer incomplet et d'un parcours de démonstration qui exposait des identifiants.

## Ce qui fonctionne

- Identité immédiatement reconnaissable : bleu nuit, turquoise, blanc, immobilier et intelligence.
- Signature officielle cohérente dans le logo, les métadonnées et les en-têtes.
- Hero premium avec un positionnement clair et une maquette de dashboard.
- Hiérarchie typographique forte et bon contraste dans les surfaces principales.
- Pages de connexion et d'inscription visuellement cohérentes avec le produit.
- Application métier déjà riche : biens, propriétaires, locataires, contrats, paiements, impayés, CRM, maintenance, imports, rapports et assistant IA.
- Architecture Next.js App Router légère : landing rendue côté serveur, images locales optimisées et routes métier séparées.
- Métadonnées Open Graph, robots, sitemap et image sociale déjà présents.
- Tests Playwright existants pour l'inscription, l'onboarding, les paiements, la maintenance et l'import.
- NINEA et RCCM affichés dans le pied de page.

## Ce qui manque

- Une explication en moins de 15 secondes de tout ce que la plateforme gère et pour quels professionnels.
- Une mention explicite indiquant que les chiffres du hero sont des données de démonstration fictives.
- Une présentation visuelle des vrais modules de l'application au-delà du seul dashboard.
- Des scénarios IA complets avec question, réponse métier et actions proposées.
- Un centre « À traiter aujourd'hui » visible sur la landing.
- Des sections dédiées à l'espace propriétaire, au recouvrement, au CRM, à WhatsApp et à l'import Excel.
- Des cas d'usage par profil professionnel.
- Une comparaison tarifaire prudente, sans quotas non appliqués par le backend.
- Une preuve sociale honnête adaptée à une phase de lancement.
- Une FAQ fondée sur les capacités réelles du produit.
- Un footer complet avec routes publiques légales et de confiance.
- Une abstraction analytics pour mesurer les principaux événements de conversion.
- Des routes publiques dédiées à la sécurité, la confidentialité, les conditions et les mentions légales.

## Ce qui doit être conservé

- Le nom **INTELLIGENCE IMMOBILIER**.
- La signature **La plateforme intelligente de gestion immobilière.**
- Le claim **Gérez votre immobilier. L'intelligence fait le reste.**
- La palette bleu nuit, turquoise et blanc.
- Le contraste entre surfaces éditoriales claires et sections produit sombres.
- Le logo officiel et la maquette de dashboard comme ancrage du hero.
- Les prix actuels SOLO, AGENCE et ENTREPRISE.
- Le positionnement premium, professionnel et orienté données.
- La séparation entre site public et fonctionnalités privées.

## Ce qui doit être amélioré

### Compréhension et conversion

- Remplacer la description générique du hero par une phrase couvrant biens, loyers, propriétaires, locataires, paiements, prospects et opérations.
- Uniformiser les CTA autour de « Commencer gratuitement », « Voir une démo » et « Nous contacter ».
- Ajouter un lien tertiaire « Explorer la plateforme ».
- Rendre chaque grande section actionnable sans multiplier les formulations.

### Démonstration produit

- Marquer chaque chiffre produit comme fictif lorsqu'il provient de la démo.
- Montrer dashboard, biens, locataires, propriétaires, paiements, impayés, CRM, maintenance et IA dans une galerie cohérente.
- Présenter l'IA comme une interface métier : synthèse, sources, actions et contrôle.

### Confiance et exactitude

- Retirer le témoignage non vérifié de la page de connexion.
- Retirer l'adresse et le mot de passe de démonstration de l'interface publique.
- Proposer un accès « Explorer la démo » sans exposer de secret, uniquement quand le mode démonstration est actif.
- Ne pas annoncer d'intégration Wave, Orange Money ou WhatsApp active : utiliser des formulations de compatibilité ou de disponibilité selon configuration.
- Ne pas afficher de quotas tarifaires comme appliqués tant qu'ils ne sont pas contrôlés par le backend.
- Ne pas inventer de clients, logos ou témoignages.

### SEO, accessibilité et performance

- Étendre les métadonnées aux intentions de recherche prioritaires sans accumulation artificielle de mots-clés.
- Ajouter les routes publiques au sitemap et aux règles robots.
- Conserver la landing en Server Component et limiter le JavaScript à l'analytics léger.
- Utiliser des éléments natifs pour la FAQ et des libellés accessibles pour les galeries et tableaux.
- Vérifier les breakpoints 1440, 1280, 1024, 768 et 390 px ainsi que les focus clavier.

## Décisions d'implémentation

- Les maquettes marketing réutilisent le langage visuel et les données fictives du produit existant ; aucune statistique n'est présentée comme un résultat client réel.
- La comparaison tarifaire décrit la disponibilité fonctionnelle sans quotas chiffrés non vérifiés.
- Le bouton de démonstration redirige vers un espace fictif lorsque `DEMO_MODE` est actif ou qu'aucune base de production n'est configurée ; sinon il revient vers la connexion.
- L'analytics est préparé sous forme d'événements internes, sans transmettre de données personnelles à un tiers tant qu'aucun fournisseur n'est configuré.
