# KIIRAAY INFOS

Site d’information de Kiiraay au Sénégal et dans la diaspora, avec espace privé de gestion de la cellule de Touba.

## Fonctionnalités

- Actualités : National, Régions, Diaspora, Touba, Communiqués.
- Articles avec auteur, date, résumé, texte, photo par URL HTTPS et vidéo par lien HTTPS.
- Brouillons et mise à la une ; pages individuelles `/articles/[id]`.
- Agenda des activités et réunions.
- Gestion privée dans `/gestion` : articles, cellules, membres, cartes imprimables et cotisations en FCFA.
- Logo officiel et identité bleu, rouge et blanc.

## Projet indépendant

Ce dossier possède son propre package.json, verrou de dépendances et configuration. Exécuter les commandes dans `apps/kiiraay-infos`, pas à la racine du dépôt Touba-visuel.

Le projet utilise React, Vinext, Cloudflare Workers et D1. Ce n’est pas une application Next.js directement déployable sur Vercel. Le fichier `.openai/hosting.json` conserve le lien avec le site Sites existant ; il ne contient pas de secret. Ne pas créer un second site pour republier ce projet.

## Installation et compilation

Node.js >= 22.13.0. Les scripts de compilation fournis utilisent Bash et les outils GNU, dont timeout (Linux recommandé).

```bash
cd apps/kiiraay-infos
npm ci
npm run build
```

La sortie est produite dans `dist/`. La compilation ne déploie rien. Le schéma D1 et sa migration sont fournis dans `db/` et `drizzle/`. Les données du site existant ne sont pas exportées vers GitHub.

## Hébergement et accès

La version actuelle est privée et utilise l’identité authentifiée transmise par Sites. `/signin-with-chatgpt` est géré par cette plateforme. Les données sont isolées par identité utilisateur. Les pages publiques présentées sont actuellement des aperçus privés.

Pour une ouverture publique ou une migration vers Vercel, il faut adapter l’authentification, les autorisations administratives, l’accès aux publications et la base de données. Ne pas faire confiance à des en-têtes d’identité fournis directement par un visiteur hors du relais authentifié Sites. Une simple copie du code ne fournit ni une base de données externe, ni l’authentification, ni une migration des données.

L’API de lecture des publications ne retourne pas les membres ou les cotisations. Les brouillons sont exclus du flux visiteurs. Aucun fait politique ou article de démonstration n’a été inventé.

## Vérification de cet export

La compilation du projet source réussit. Les contrôles de validation des articles acceptent un brouillon valide et rejettent les dates impossibles, catégories inconnues et URL de médias non HTTPS. Aucun test de navigateur ou déploiement Vercel n’est revendiqué.

## Limites actuelles

- Photos et vidéos ajoutées par liens, sans téléversement de fichiers.
- Cartes imprimables, sans QR de vérification publique.
- Collaboration entre responsables et accès public à configurer avant ouverture.
