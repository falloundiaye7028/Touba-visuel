# Agent de publication Touba Infos

## Value Proposition

Permettre à Mamadou Falilou Ndiaye et, plus tard, aux membres autorisés de la rédaction Touba Infos de transformer un article préparé dans ChatGPT en publication réelle sur toubainfos.com, sans recopier manuellement chaque champ du CMS.

**Problème actuel :** les articles sont préparés dans la conversation puis les champs doivent être copiés un à un dans l’administration (titre, slug, chapô, extrait, HTML, rubrique, auteur, mots-clés, image, crédit et légende).

**Core actions :**
1. Créer un brouillon complet à partir de l’article validé dans la conversation.
2. Mettre à jour ce brouillon après une correction demandée par l’utilisateur.
3. Publier le brouillon uniquement après une validation explicite de l’utilisateur.

La suppression d’articles ne fait pas partie des outils de l’agent.

## Why LLM?

**Avantage conversationnel :** l’utilisateur peut dire « prépare cet article », demander des corrections naturelles, puis « je valide et publie », sans naviguer dans un long formulaire.

**Apport du LLM :** comprendre l’intention, structurer les champs du CMS, transformer le texte en HTML éditorial propre, proposer les métadonnées, contrôler la cohérence et résumer l’action avant confirmation.

**Ce qui manque au LLM sans connecteur :** accès à la base PostgreSQL de Touba Infos, possibilité de créer ou modifier un article, changement de statut et retour de l’URL publique.

## UI Overview

Aucune interface complexe n’est nécessaire dans la première version. L’expérience se déroule dans ChatGPT avec les liens du CMS existant.

1. **Premier état :** ChatGPT présente la fiche complète de l’article et son aperçu rédactionnel.
2. **Création :** après accord, l’outil crée un brouillon privé et renvoie son identifiant ainsi que le lien d’administration.
3. **Correction :** l’utilisateur demande une modification ; l’outil met à jour le même brouillon.
4. **Publication :** l’utilisateur prononce une validation explicite (« Je valide et publie »). ChatGPT affiche la confirmation d’action d’écriture, puis appelle l’outil de publication.
5. **État final :** l’agent renvoie le statut, le lien public et le lien d’administration.

## Product Context

- **Produit existant :** toubainfos.com
- **Dépôt :** falloundiaye7028/Touba-visuel
- **Hébergement :** Vercel, projet touba-visuel
- **Framework :** Next.js 15 App Router
- **Persistance :** PostgreSQL via Prisma, modèle InfoArticle
- **CMS actuel :** /touba-infos/admin
- **Authentification actuelle :** mot de passe d’administration et cookie HTTP-only
- **Connecteur prévu :** serveur MCP Streamable HTTP à /api/touba-infos/mcp
- **Authentification du connecteur :** OAuth pour la connexion ChatGPT, adossé à l’accès administrateur existant
- **Environnement :** branche dédiée et déploiement Preview avant toute fusion vers main

## UX Flows et architecture

### Flux 1 — Créer un brouillon

1. L'utilisateur prépare et relit l'article dans la conversation.
2. ChatGPT résume les données qui seront envoyées au CMS.
3. Après confirmation de l'action d'écriture, `create_article_draft` crée un brouillon persistant.
4. L'outil renvoie l'identifiant et le lien d'administration.

### Flux 2 — Corriger un brouillon

1. L'utilisateur demande une correction et identifie le brouillon concerné.
2. ChatGPT résume les seuls champs qui changeront.
3. Après confirmation, `update_article_draft` met à jour le même article.
4. L'outil renvoie la liste des champs modifiés et le lien d'administration.

### Flux 3 — Publier un article

1. L'utilisateur formule explicitement « Je valide et publie ».
2. ChatGPT présente la confirmation de l'action d'écriture.
3. `publish_article` contrôle le texte de validation, l'état de l'article et l'idempotence.
4. Le statut passe à `publie` sans modifier silencieusement le contenu.
5. L'outil renvoie le lien public et le lien d'administration.

### Flux 4 — Vérifier un article

1. L'utilisateur demande l'état d'un article.
2. `get_article_status` renvoie son statut et ses URLs sans modifier les données.

### Décisions d'architecture

- **Outils uniquement, sans vue MCP :** les entrées sont naturellement conversationnelles et les sorties tiennent dans un court résumé textuel.
- **Serveur stateless :** chaque requête Streamable HTTP est indépendante, ce qui convient aux fonctions Vercel.
- **Couche métier partagée :** le protocole MCP appelle un service de publication testable qui réutilise le store CMS existant.
- **Authentification hors arguments :** aucun mot de passe ni jeton n'apparaît dans les schémas des outils.
- **URLs canoniques :** toutes les réponses utilisent `https://toubainfos.com` et fournissent les liens public et d'administration pertinents.
- **Idempotence persistante :** la clé de création produit une empreinte SHA-256 enregistrée comme identifiant stable de l’article (`mcp_<empreinte>`). Elle résiste aux nouvelles instances Vercel sans ajouter une seconde table ; les mises à jour et la publication sont des opérations d’état naturellement idempotentes.
- **OAuth lié à l’administration :** le flux authorization code utilise PKCE S256, l’inscription dynamique du client et des jetons HMAC limités à la ressource MCP. L’écran d’autorisation vérifie `TI_ADMIN_PASSWORD` sans transmettre ce mot de passe à ChatGPT.
- **Déploiement progressif :** tests locaux, Preview Vercel, validation fonctionnelle, puis seulement fusion vers `main`.

## Outils MCP

### create_article_draft

Crée un article avec le statut `brouillon`.

Entrées principales :
- titre
- slug facultatif
- sousTitre
- extrait
- contenu HTML
- categorie
- genre
- auteur
- tempsLecture
- tags
- imageUrl facultative
- imageEmoji
- imageGradient
- credit facultatif
- legende facultative
- alaUne
- breaking
- epingle
- date
- sources facultatives
- idempotencyKey obligatoire

Sortie :
- articleId
- slug
- statut
- adminUrl
- avertissements éventuels

### update_article_draft

Met à jour uniquement un article encore en brouillon ou programmé.

Entrées :
- articleId
- champs à modifier
- idempotencyKey

Sortie :
- articleId
- statut
- adminUrl
- résumé des champs modifiés

### publish_article

Publie un article existant après validation explicite.

Entrées :
- articleId
- approved = true
- confirmationText
- idempotencyKey

Règles :
- refuse si `approved` n’est pas vrai ;
- refuse si le texte de confirmation ne correspond pas à une validation explicite ;
- refuse si l’article n’existe pas ;
- ne modifie pas silencieusement le contenu ;
- renvoie le lien public après publication.

Sortie :
- articleId
- slug
- statut = publie
- publicUrl
- adminUrl

### get_article_status

Outil en lecture seule permettant de vérifier l’existence, le statut et les URLs d’un article.

## Règles éditoriales et sécurité

- Publication impossible sans confirmation humaine.
- Aucun outil de suppression.
- Authentification obligatoire pour toutes les écritures.
- Validation Zod de chaque entrée.
- Taille maximale des champs et du HTML.
- Nettoyage du HTML : suppression des scripts, gestionnaires d’événements, iframes non autorisées et URLs dangereuses.
- Liste HTML autorisée adaptée au CMS : p, h2, h3, strong, em, ul, ol, li, blockquote, a, br.
- Liens externes normalisés avec `rel="noopener noreferrer"`.
- Détection des doublons par slug et idempotencyKey.
- Journalisation minimale des créations, mises à jour et publications, sans stocker le contenu de la conversation.
- Photos réelles privilégiées ; conservation du crédit et de la légende.
- Les sources sont conservées sous forme de liens dans le contenu lorsqu’elles sont fournies.
- Les outils d’écriture sont déclarés comme tels afin de déclencher la confirmation ChatGPT.

## Compatibilité avec le CMS

L’agent réutilise `adminCreate`, `adminUpdate`, `adminGetById` et `adminSetStatut` du store existant. Il ne crée pas une seconde base d’articles.

Les statuts existants restent :
- brouillon
- programme
- publie

Les catégories, genres et auteurs doivent respecter les valeurs déjà acceptées par le formulaire d’administration.

## Gestion des images

Version initiale :
- accepte une URL d’image déjà accessible ;
- conserve l’emoji et le dégradé comme repli ;
- renvoie un avertissement si aucune photo réelle n’est fournie ;
- ne génère pas automatiquement une fausse photo d’actualité.

L’import binaire direct d’une pièce jointe ChatGPT pourra être ajouté dans une version ultérieure après validation du flux sécurisé vers Vercel Blob.

## Critères d’acceptation

1. Le serveur répond correctement à l’initialisation MCP et expose exactement les quatre outils définis.
2. Un appel non authentifié à un outil d’écriture est refusé.
3. La création produit un brouillon persistant visible dans le CMS mais absent du site public.
4. Un même idempotencyKey ne crée jamais deux articles et refuse un second contenu différent.
5. La mise à jour modifie le brouillon existant.
6. La publication est refusée sans validation explicite.
7. La publication validée rend l’article accessible sur son URL publique.
8. Le HTML dangereux est nettoyé ou rejeté.
9. Aucun outil ne permet la suppression.
10. Le build Next.js et les tests passent.
11. Un déploiement Vercel Preview est vérifié avant fusion.
12. Le domaine de production n’est modifié qu’après validation finale de l’utilisateur.

## Hors périmètre de la première version

- Publication automatique sans validation.
- Suppression d’articles.
- Veille journalistique supplémentaire (le site possède déjà cet agent).
- Génération automatique de photos d’actualité.
- Publication automatique vers Facebook, TikTok, WhatsApp ou YouTube.
- Gestion multi-rôles complète de la rédaction.
