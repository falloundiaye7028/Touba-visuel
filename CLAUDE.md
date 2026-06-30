# CLAUDE.md — Agence Touba Visuel (ATV)

## Project Overview

**Touba Visuel** is a Next.js 15 e-commerce and communication platform for **Agence Touba Visuel (ATV)**, a graphic design and printing agency based in Touba, Sénégal. The site allows clients to browse 88+ communication supports, place orders, track order status, pay online, and use AI generation tools.

- **Deployed at**: https://touba-visuel.vercel.app
- **Language**: French (fr_SN locale)
- **Currency**: XOF (CFA Franc)
- **Target market**: Touba, Dakar, and all of Sénégal

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animation | Framer Motion 11 |
| Database | PostgreSQL via Prisma 5 |
| Auth | NextAuth 4 |
| Payments | Stripe, Wave, Orange Money |
| Forms | React Hook Form + Zod |
| AI | Pollinations.ai (images), ttsmp3.com (TTS) |
| Deploy | Vercel |
| PWA | Service Worker (`public/sw.js`) + Web App Manifest |

---

## Development Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # prisma generate + next build
npm start            # Production server
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB (no migrations)
npm run db:studio    # Open Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client
```

---

## Environment Variables

Required in `.env.local`:

```env
DATABASE_URL=                         # PostgreSQL connection string
STRIPE_SECRET_KEY=                    # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=   # Stripe publishable key
STRIPE_WEBHOOK_SECRET=                # Stripe webhook signing secret
WAVE_API_KEY=                         # Wave Mobile Money API key
WAVE_API_URL=                         # Wave API base URL
NEXTAUTH_URL=                         # App base URL (e.g. http://localhost:3000)
NEXTAUTH_SECRET=                      # Random secret for NextAuth
ADMIN_SECRET=                         # Secret token for /admin access
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Header, Footer, PWA, SEO, JSON-LD)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global CSS
│   ├── robots.ts               # Robots.txt generation
│   ├── sitemap.ts              # Sitemap generation
│   ├── admin/                  # Admin dashboard (order management)
│   ├── blog/                   # Marketing blog (static data from lib/blog.ts)
│   │   └── [slug]/
│   ├── catalogue/              # Product catalogue (88+ supports)
│   │   └── [slug]/             # Individual support detail page
│   ├── commande/               # Order form
│   ├── generateur-ia/          # AI post/content generator
│   ├── generateur-visuels/     # AI image generator (Pollinations.ai)
│   ├── generateur-voix/        # AI voice/TTS generator (ttsmp3.com)
│   ├── magal/                  # Grand Magal de Touba countdown/info page
│   ├── marche-ocass/           # Marché Ocass commercial portal
│   ├── paiement/               # Payment info page
│   ├── services-ia/            # AI services landing page
│   ├── suivi/                  # Order tracking page
│   ├── tabaski/                # Tabaski seasonal promotion page
│   ├── touba-infos/            # Local news portal
│   │   └── [slug]/
│   └── api/
│       ├── orders/route.ts         # POST: create order + payment | GET: fetch by orderNumber
│       ├── admin/orders/route.ts   # Admin: list/update orders (requires ADMIN_SECRET)
│       ├── generate-image/route.ts # Edge: AI image generation via Pollinations.ai
│       ├── generate-post/route.ts  # AI social post generator
│       ├── generate-voix/route.ts  # TTS voice generation
│       └── payment/stripe/webhook/ # Stripe webhook handler
├── components/                 # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ChatbotIA.tsx           # In-page AI chatbot
│   ├── WhatsAppFloat.tsx       # Floating WhatsApp button
│   ├── BannierePromo.tsx       # Promotional banner (top of layout)
│   ├── MockupLateral.tsx       # Lateral product mockup widget
│   ├── ScrollProgress.tsx      # Page scroll progress bar
│   ├── ScrollReveal.tsx        # Scroll-triggered animation wrapper
│   ├── MagalCountdown.tsx      # Countdown to Grand Magal
│   ├── TikTokSection.tsx       # TikTok feed embed section
│   ├── Realisations.tsx        # Portfolio/work showcase
│   ├── Temoignages.tsx         # Client testimonials
│   ├── StatsSection.tsx        # Company stats display
│   ├── FAQ.tsx                 # FAQ accordion
│   ├── CategorieCard.tsx       # Catalogue category card
│   ├── BlogCard.tsx            # Blog article card
│   ├── OrderStatusBadge.tsx    # Order status pill/badge
│   ├── SupportCard.tsx         # Individual support product card
│   ├── AlbumShooting.tsx       # Photo album / shooting gallery
│   ├── BrandingSection.tsx     # Branding/identity section
│   ├── EspacePublicitaire.tsx  # Ad space component
│   ├── LogosClients.tsx        # Client logos strip
│   └── MotDirecteur.tsx        # Director's message
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── utils.ts                # Utilities (cn, generateOrderNumber, etc.)
│   ├── supports.ts             # CATALOGUE static data (88+ supports, 8 categories)
│   ├── blog.ts                 # ARTICLES static data (marketing blog)
│   ├── touba-infos.ts          # News articles static data
│   └── rateLimit.ts            # Server-side rate limiting helper
├── middleware.ts               # Edge middleware: admin auth, rate limiting, security
└── types/
    └── index.ts                # Shared TypeScript types and enums
```

---

## Database Schema (Prisma / PostgreSQL)

### Models

- **User** — `CLIENT | ADMIN | GESTIONNAIRE` roles, linked to NextAuth accounts/sessions
- **Account / Session** — NextAuth OAuth tables
- **Order** — Core business entity: client info, support type, quantity, pricing, status
- **Payment** — Payment records linked to orders (Stripe session, Wave ref, etc.)
- **Support** — (DB version, mirrors static `lib/supports.ts` catalogue)

### Order Lifecycle

```
EN_ATTENTE → CONFIRME → EN_PRODUCTION → PRET → LIVRE
                                              └→ ANNULE
```

### Payment Status Flow

```
NON_PAYE → EN_ATTENTE_PAIEMENT → PAYE
                               └→ ECHOUE → (REMBOURSE)
```

### Payment Methods

- `CARTE_BANCAIRE` — Stripe checkout
- `WAVE` — Wave Mobile Money (Sénégal)
- `ORANGE_MONEY` — Manual transfer with reference number
- `LIVRAISON` — Cash on delivery

---

## Catalogue Structure

All catalogue data lives in `src/lib/supports.ts` as a static `CATALOGUE` array. **No database reads for the catalogue** — it is purely in-memory.

**8 categories, 88+ supports:**
1. `impression-papier` — Flyers, affiches, cartes de visite, brochures, calendriers...
2. `signaletique-grand-format` — Banderoles, roll-up, bâches, panneaux, enseignes...
3. `textile-objets` — T-shirts, mugs, casquettes, tote bags, stylos...
4. `numerique-digital` — Logos, posts réseaux sociaux, vidéos animées...
5. `evenementiel` — Backdrop, step & repeat, invitations, photobooth...
6. `conditionnement-emballage` — Boîtes, sacs papier, étiquettes produits...
7. `identite-corporate` — Kit démarrage, uniformes, habillage flotte...
8. `presse-medias` — Insertions presse, dossiers de presse, communiqués...

Prices are in **CFA Francs (XOF)** — always use integers or floats, never format as EUR/USD.

---

## Design System

### Brand Colors (Tailwind custom tokens)

```
vert-900  (#07402b)  — Primary dark green (brand main color)
vert-700  (#0a6342)  — Primary green
or-400    (#ffc800)  — Gold/yellow
or-500    (#ffb300)  — Deep gold
orange-400 (#ff7a2a) — Orange accent
```

### Gradient Utilities

- `bg-gradient-touba` — Signature 4-stop diagonal (dark green → green → orange → gold)
- `bg-gradient-hero` — Hero overlay (green → transparent)
- `bg-gradient-atv` — ATV brand gradient

### Typography

- **Body**: `Inter, system-ui, sans-serif`
- **Arabic/Wolof religious text**: `Amiri, serif` (class `font-arabic`)

### Theme Color

`#07402b` — used in `<meta name="theme-color">` and PWA manifest.

---

## Security Architecture

### Middleware (`src/middleware.ts`)

Applied to all routes except `_next/static`, `_next/image`, `favicon.ico`, `images/`:

1. **Admin protection** — `/admin` and `/api/admin` require `x-admin-secret` header or `admin-token` cookie matching `ADMIN_SECRET` env var
2. **API rate limiting** — POST `/api/orders`: 10 req/min per IP; all `/api/*`: 60 req/min per IP
3. **Injection detection** — Blocks XSS, SQL injection, path traversal in query strings
4. **User-agent blocking** — Blocks `sqlmap`, `nikto`, `nessus`, `masscan`, `zgrab`, `nuclei`
5. **Method restriction** — Non-API routes only accept `GET` and `HEAD`
6. **Security headers** — Adds `X-Request-ID`, removes `X-Powered-By`, sets cache headers

### `next.config.mjs` Security Headers

Full CSP, HSTS, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

**Allowed external connect-src**: Stripe, Wave, Orange Sonatel, Pollinations.ai, ttsmp3.com.

### API Route Validation

`/api/orders` sanitizes all string inputs, validates email/phone formats, enforces price bounds (`0–10,000,000 XOF`), and whitelists payment methods before any DB write.

---

## AI Features

### Image Generator (`/generateur-visuels`)

- API route: `/api/generate-image` (Edge runtime)
- Backend: **Pollinations.ai** (`image.pollinations.ai/prompt/...`)
- Returns a URL directly — client loads image from Pollinations, avoiding Vercel timeout/proxy issues
- Max dimensions: 1024×1024

### Voice/TTS Generator (`/generateur-voix`)

- API route: `/api/generate-voix`
- Backend: **ttsmp3.com** (Amazon Polly Neural proxy)
- 6 voices available; text cleaned before submission

### Post Generator (`/generateur-ia` and `/services-ia`)

- API route: `/api/generate-post`
- Uses **Pollinations.ai text API** (`text.pollinations.ai`)

### AI Chatbot (`ChatbotIA` component)

- Client-side component embedded in root layout
- Available on every page

---

## PWA Configuration

- `public/manifest.json` — Web App Manifest (name: "ATV", theme: `#07402b`)
- `public/sw.js` — Service Worker (registered inline in `layout.tsx`)
- `public/icon-192.png`, `public/icon-512.png` — PWA icons
- `public/apple-touch-icon.png` — iOS icon (180×180)
- `public/splash/` — 9 iOS splash screens for various device sizes
- `appleWebApp.capable: true` with `statusBarStyle: "black-translucent"`

---

## Static Content Data Files

All blog and news content is **static TypeScript data** (no CMS/DB):

- `src/lib/blog.ts` — Marketing articles (`ARTICLES` array), categories: Stratégie Digitale, Réseaux Sociaux, Identité Visuelle, Étude de Cas, WhatsApp Marketing, Communication Terrain
- `src/lib/touba-infos.ts` — News portal articles (`ARTICLES_INFO` array), categories: Mouridisme, Touba, Sénégal, Afrique, International, Économie, Sport, Culture

To add new content, append objects to these arrays following the existing interface shapes.

---

## Key Conventions

1. **French everywhere** — All UI text, variable names for business logic, error messages, and comments are in French. Code identifiers (functions, TS types) may be English.
2. **XOF prices as numbers** — Never convert to other currencies in the UI. Display with `toLocaleString('fr-SN')` for thousand separators.
3. **Prisma db:push (no migrations)** — Schema changes go through `npm run db:push`. No migration files are tracked.
4. **Static catalogue, dynamic orders** — The product catalogue (`lib/supports.ts`) is never read from the DB. Orders and payments are always DB-backed.
5. **Edge runtime for AI routes** — AI generation routes use `export const runtime = "edge"` for lower latency; do not use Node.js-only APIs there.
6. **Admin via secret header, not session** — Admin pages are protected by `ADMIN_SECRET` env var checked in middleware, not a NextAuth session. Do not add session-based admin auth without updating middleware.
7. **No CMS** — Blog and news content is hardcoded in `lib/`. To publish content, edit those files and deploy.
8. **Seasonal pages** — `/magal`, `/tabaski`, `/marche-ocass` are standalone pages with their own `layout.tsx` where needed. They target specific cultural/religious dates.
9. **Image handling** — Only `res.cloudinary.com` and `images.unsplash.com` are in the Next.js `remotePatterns` whitelist. AI-generated images from Pollinations are loaded directly by the browser via `<img>` tags, not via Next.js `<Image>`.
10. **`cn()` utility** — Use `src/lib/utils.ts` `cn()` (clsx + tailwind-merge) for conditional class names everywhere.

---

## API Routes Reference

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/api/orders` | Create order + initiate payment | None (rate-limited) |
| GET | `/api/orders?num=ATV-XXXX` | Fetch order by number | None |
| GET/PATCH | `/api/admin/orders` | List/update orders | `ADMIN_SECRET` |
| POST | `/api/generate-image` | AI image generation | None |
| POST | `/api/generate-post` | AI social post generation | None |
| POST | `/api/generate-voix` | TTS voice generation | None |
| POST | `/api/payment/stripe/webhook` | Stripe event handler | Stripe signature |

---

## Git Workflow

- **Main branch**: `main`
- **Active feature branch**: `claude/claude-md-docs-bkkz3u`
- Push to `origin <branch>` with `-u` flag
- Commit messages follow: `feat:`, `fix:`, `refactor:`, `docs:` prefixes in French description style (e.g., `feat: marche-ocass — portail commercial de Touba`)
