# IntelligenceImmobilier V1

**L’intelligence immobilière.** IntelligenceImmobilier est une application SaaS multi-tenant de gestion immobilière pour le Sénégal et l’Afrique francophone.

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
| `STORAGE_PROVIDER` | Adaptateur documentaire (`mock`, `blob`, `s3`, `supabase`) |
| `STORAGE_BUCKET` | Conteneur privé de documents |
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

Voir aussi [ARCHITECTURE.md](./ARCHITECTURE.md), [SECURITY.md](./SECURITY.md), [DATABASE.md](./DATABASE.md) et [DEPLOYMENT.md](./DEPLOYMENT.md).
