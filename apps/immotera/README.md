# INTELLIGENCE IMMOBILIER V1

**La plateforme intelligente de gestion immobilière.** INTELLIGENCE IMMOBILIER est une application SaaS multi-tenant de gestion immobilière pour le Sénégal et l’Afrique francophone. La signature officielle et ses règles d’utilisation sont définies dans [BRAND.md](./BRAND.md).

## Prérequis

- Node.js 24 (20.9 minimum)
- PostgreSQL 15+
- npm 10+

## Installation

```bash
npm ci
cp .env.example .env.local
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Ouvrir `http://localhost:3000`. Sans `DATABASE_URL`, l’interface démarre en mode démonstration. Le compte seed est `demo@intelligenceimmobilier.com` / `Demo2026!`.

## Commandes

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

## Variables

| Variable | Usage |
| --- | --- |
| `DATABASE_URL` | URL PostgreSQL serveur uniquement |
| `AUTH_SECRET` | Signature des sessions Auth.js |
| `NEXTAUTH_URL` | Origine canonique de l’authentification |
| `NEXT_PUBLIC_APP_URL` | Origine publique pour les métadonnées |
| `STORAGE_PROVIDER` | Adaptateur documentaire (`local` hors production, `blob` sur Vercel ; interface extensible S3/Supabase) |
| `DOCUMENT_MAX_SIZE_MB` | Limite unique des fichiers documentaires, `20` par défaut |
| `DOCUMENT_SIGNING_SECRET` | Signature des liens temporaires ; repli sur `AUTH_SECRET` |
| `BLOB_STORE_ID` | Identifiant du Vercel Blob privé (OIDC recommandé) |
| `BLOB_READ_WRITE_TOKEN` | Jeton Blob de compatibilité si OIDC n’est pas utilisé |
| `OPENAI_API_KEY` | Assistant facultatif, serveur uniquement |
| `RESEND_API_KEY` | Notifications email facultatives |
| `WHATSAPP_TOKEN` | WhatsApp Business officiel uniquement |
| `DEMO_MODE` | Données de démonstration, jamais en production |

## Structure

- `src/app` : App Router, pages publiques, espace privé et API.
- `src/components` : shell produit et surfaces métier.
- `src/lib/domain` : calculs purs testés (loyers, commissions, matching).
- `src/lib/services` : transactions métier serveur.
- `prisma` : schéma PostgreSQL et seed.
- `e2e` : workflows Playwright.

## Documents privés

Le module `/documents` accepte réellement PDF, JPG/JPEG, PNG, WEBP, DOC et DOCX. L’extension, le MIME, la taille et les magic bytes sont vérifiés côté serveur. En développement, les fichiers restent dans `uploads/documents` (répertoire ignoré par Git). Sur Vercel, configurez un store Blob privé et `STORAGE_PROVIDER=blob` ; les fichiers de plus de 4,5 Mo utilisent un upload direct multipart vers Blob, puis une finalisation serveur qui revalide le contenu avant l’écriture en base.

Les boutons Voir et Télécharger génèrent une URL applicative signée valable cinq minutes. Aucune URL Blob privée ni URL signée durable n’est enregistrée en base. La suppression utilisateur est logique ; la purge physique doit être exécutée après la période de conservation définie par l’organisation.

Voir aussi [ARCHITECTURE.md](./ARCHITECTURE.md), [SECURITY.md](./SECURITY.md), [DATABASE.md](./DATABASE.md) et [DEPLOYMENT.md](./DEPLOYMENT.md).
