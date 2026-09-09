# KIIRAAY INFOS — Vercel

Projet Next.js indépendant dans `apps/kiiraay-infos`. Accueil national, régions, diaspora, Touba, articles, agenda et espace de gestion des membres et cotisations.

## Déploiement

Créer le projet Vercel `kiiraay-infos` dans l’équipe Touba Visuel, avec le dossier racine `apps/kiiraay-infos` et le framework Next.js. La branche de travail est `codex/kiiraay-infos`. Les autres applications du dépôt sont indépendantes.

```bash
npm ci
npm test
npm run build
```

## Base de données

Créer une base Neon dédiée via Vercel Storage. Configurer `DATABASE_URL` dans l’environnement choisi. Le client Neon HTTP nécessite une URL Neon ; une URL PostgreSQL arbitraire n’est pas équivalente.

Exécuter `npm run db:migrate` avec DATABASE_URL défini. La migration transactionnelle est idempotente et ne touche que les tables `kiiraay_*`. Aucune migration ne s’exécute pendant la compilation ou les requêtes web.

Sans base configurée, l’accueil affiche un registre vide et l’administration reste indisponible. Les données du précédent site Sites n’ont pas été migrées.

## Compte administrateur

Exécuter `npm run admin:setup` dans un terminal de confiance. Le script crée `.admin-credentials.local` avec permissions 0600 et ne divulgue pas le mot de passe dans la console. Conserver le mot de passe dans un gestionnaire de mots de passe, puis enregistrer uniquement la valeur ADMIN_PASSWORD_HASH dans les variables chiffrées Vercel. Ne jamais committer ce fichier. Un seul compte administrateur est prévu dans cette version.

La connexion est dans `/connexion`, l’espace privé dans `/gestion`. Les sessions de 12 heures sont stockées côté serveur sous forme de condensat de jeton aléatoire. Cookie HttpOnly, SameSite Strict, Secure en production ; vérification d’origine sur les écritures. Les tentatives de connexion sont limitées côté base (10 par fenêtre de 15 minutes, globalement).

La lecture publique expose uniquement les articles et activités publiés. Les fiches membres, cellules et cotisations passent par l’API administrateur. Le rendu de texte React échappe le contenu des articles. Les photos et vidéos sont des liens HTTPS, pas des téléversements.

## Validation réalisée

Compilation Next.js et vérification TypeScript réussies. Test du hachage et de la validation du mot de passe réussi. Aucun test avec une base Neon réelle ni migration des anciennes données ne peut être revendiqué avant leur configuration.

## Transition

Cette version remplace l’adaptateur Cloudflare D1 et la connexion ChatGPT de l’export initial. Elle ne modifie pas le site Sites privé déjà hébergé. L’ouverture de la production se fait après configuration de la base, de l’administrateur et vérification des écritures.
