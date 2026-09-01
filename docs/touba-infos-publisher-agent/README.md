# Connecteur ChatGPT — publication Touba Infos

Ce module expose le CMS Touba Infos comme serveur MCP privé. Il permet à ChatGPT de créer et corriger des brouillons, d’en vérifier l’état et de les publier après une confirmation humaine explicite.

## Endpoint

- MCP Streamable HTTP : `/api/touba-infos/mcp`
- Métadonnées de ressource : `/.well-known/oauth-protected-resource/api/touba-infos/mcp`
- Métadonnées du serveur OAuth : `/.well-known/oauth-authorization-server`
- Autorisation : `/api/touba-infos/oauth/authorize`
- Jeton : `/api/touba-infos/oauth/token`
- Inscription dynamique : `/api/touba-infos/oauth/register`

Le serveur est sans état et utilise une instance MCP neuve par requête. Le transport prend en charge les clients MCP modernes ainsi que le repli stateless des clients 2025.

## Outils exposés

1. `create_article_draft` — crée un brouillon privé.
2. `update_article_draft` — modifie uniquement un brouillon ou un article programmé.
3. `publish_article` — publie après `approved=true` et une formule explicite telle que « Je valide et publie ».
4. `get_article_status` — lit l’état et les liens sans modification.

Il n’existe aucun outil de suppression.

## Variables d’environnement

- `DATABASE_URL` — base PostgreSQL déjà utilisée par le CMS.
- `TI_ADMIN_PASSWORD` — mot de passe de l’administration, utilisé sur l’écran de consentement OAuth.
- `TI_MCP_OAUTH_SECRET` — secret aléatoire d’au moins 32 caractères pour signer les clients, codes et jetons OAuth. `TI_AGENT_SECRET` ou `ADMIN_SECRET` sert de repli pour une transition, mais un secret distinct est recommandé.
- `TI_MCP_PUBLIC_ORIGIN` — origine publique facultative. En son absence, Vercel Preview utilise `VERCEL_URL` et la production utilise `https://toubainfos.com`.

Aucune de ces valeurs ne doit être commitée ni ajoutée aux arguments d’un outil.

## Diffusion automatique sur Facebook

Lorsqu’un article passe au statut `publie`, le serveur tente de créer un post
sur la Page Facebook configurée. Le post contient le titre, l’extrait, les
hashtags et le lien canonique de l’article. L’identifiant renvoyé par Meta est
enregistré dans l’article afin qu’une relance ne produise pas de doublon.

Variables serveur à configurer dans Vercel :

- `FACEBOOK_PAGE_ID` — identifiant numérique de la Page Touba Infos ;
- `FACEBOOK_PAGE_ACCESS_TOKEN` — jeton de Page Meta, traité comme secret ;
- `FACEBOOK_GRAPH_API_VERSION` — version activée pour l’application Meta au
  format `vXX.X`.

L’application Meta et le jeton de Page doivent autoriser la gestion des
publications de la Page. Si la configuration est absente ou si Meta refuse la
requête, la publication Touba Infos reste valide et l’erreur Facebook est
journalisée sans exposer le jeton.

## Protections

- OAuth authorization code avec PKCE S256 et audience liée à l’URL exacte du serveur MCP.
- Inscription dynamique limitée aux redirections HTTPS OpenAI et aux boucles locales des clients de développement.
- Jetons d’accès de huit heures, portée `mcp`, validation de la signature, de l’émetteur, de l’audience et de l’expiration à chaque requête.
- Validation Zod stricte et limites de taille sur tous les champs.
- HTML limité à `p`, `h2`, `h3`, `strong`, `em`, `ul`, `ol`, `li`, `blockquote`, `a` et `br`.
- Suppression des scripts, iframes, gestionnaires d’événements et URL dangereuses ; normalisation des liens externes avec `noopener noreferrer`.
- Identifiant d’article déterministe issu de la clé d’idempotence pour empêcher les doubles créations.
- Refus d’une clé réutilisée avec un contenu différent et détection des slugs déjà présents.
- Refus de modifier un article déjà publié.
- Refus de publier si la validation concerne seulement une spécification, un plan ou un brouillon.
- Journalisation des actions et identifiants seulement, sans texte d’article ni jeton.

## Vérification locale

```bash
npm test
npm run build
```

Les tests couvrent le nettoyage HTML, les doublons, les mises à jour, la barrière de publication, le flux OAuth/PKCE, la liste exacte des outils et le refus HTTP sans authentification.

## Connexion dans ChatGPT

Après déploiement de la Preview :

1. activer le mode développeur dans ChatGPT ;
2. créer une app MCP avec l’URL `https://<preview>/api/touba-infos/mcp` ;
3. choisir OAuth avec inscription dynamique ;
4. ouvrir la connexion et saisir le mot de passe de l’administration sur la page Touba Infos ;
5. vérifier les quatre outils avant de créer un premier brouillon d’essai.

Une validation de Preview ne doit jamais être suivie d’une promotion automatique. La branche n’est fusionnée dans `main` qu’après la validation finale du propriétaire de Touba Infos.
