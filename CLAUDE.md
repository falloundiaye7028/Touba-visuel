# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project overview

**Touba Visuel (ATV — Agence Touba Visuel)** is the website and online-ordering
platform for a communication/print agency based in Touba, Senegal. Customers
browse a catalogue of 88+ communication supports (print, signage, textile,
digital…), place orders, pay online (Stripe card, Wave, Orange Money, or
cash-on-delivery), and track order status. The site also hosts AI tools
(image/post/voice generators), a blog, local news, and several standalone
campaign/event landing pages.

The UI language is **French** (`<html lang="fr">`), targeting the Senegalese
market. Prices are in **FCFA / XOF**. Code identifiers, comments, and commit
messages are in French — follow that convention.

## Tech stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS 3** for styling (custom theme, see below)
- **Prisma 5** ORM over **PostgreSQL**
- **Stripe** for card payments; Wave + Orange Money for mobile money
- **framer-motion** (animations), **lucide-react** (icons), **react-hook-form** + **zod** (forms/validation)
- **next-auth**, **bcryptjs**, **nodemailer** are installed for auth/email (schema has `User`/`Account`/`Session`), but admin is currently gated by a shared secret, not NextAuth sessions.
- Deployment target: **Vercel**

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server → http://localhost:3000
npm run build        # prisma generate && next build (Prisma client generated on build)
npm start            # production server
npm run lint         # ESLint (eslint-config-next)

npm run db:push      # push Prisma schema to the database (no migrations dir)
npm run db:studio    # open Prisma Studio
npm run db:generate  # regenerate Prisma client
```

There is **no test suite** configured. `npm run lint` and `npm run build` are
the checks to run before committing.

## Environment variables

Secrets live in `.env.local` (gitignored — never commit env files). Variables
referenced in code:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `STRIPE_SECRET_KEY` | Stripe API key (card checkout) |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js publishable key (client) |
| `NEXTAUTH_URL` | Base URL used for payment success/cancel redirects |
| `WAVE_API_KEY`, `WAVE_API_URL` | Wave mobile-money checkout API |
| `ADMIN_SECRET` | Shared secret protecting `/admin` and `/api/admin/*` |

## Project structure

```
prisma/schema.prisma      # DB models: User, Account, Session, Order, Payment, Support + enums
src/
  app/                    # Next.js App Router (pages + API routes)
    page.tsx              # Home
    catalogue/            # Catalogue listing + [slug] support detail
    commande/             # Order form
    suivi/                # Order tracking (by order number)
    paiement/             # Payment info page
    admin/                # Admin order-management dashboard
    blog/                 # Blog listing + [slug] articles
    touba-infos/          # Local news listing + [slug]
    generateur-ia/        # AI social-post generator
    generateur-visuels/   # AI image generator UI
    generateur-voix/      # AI text-to-speech UI
    services-ia/          # AI services landing
    magal/, tabaski/,     # Standalone campaign / event landing pages
    marche-ocass/         #   (Marché Ocass commercial portal)
    api/
      orders/             # POST create order (+ payment session), GET track order
      admin/orders/       # GET list / PATCH update orders (admin-secret gated)
      generate-image/     # AI image (Pollinations) — edge runtime
      generate-post/      # AI marketing posts (text.pollinations.ai) — edge runtime
      generate-voix/      # AI TTS (ttsmp3.com / Amazon Polly) — edge runtime
      payment/stripe/webhook/  # Stripe webhook → marks order paid
    layout.tsx            # Root layout: metadata, SEO/JSON-LD, PWA, global chrome
    sitemap.ts, robots.ts # SEO
  components/             # ~24 shared React components (Header, Footer, Hero, ChatbotIA…)
  lib/
    db.ts                 # Prisma client singleton
    supports.ts           # CATALOGUE data (categories + supports, source of truth)
    blog.ts               # Blog article data
    touba-infos.ts        # Local news data
    rateLimit.ts          # In-memory rate limiter helper
    utils.ts              # cn(), formatPrix(), formatDate(), generateOrderNumber()
  types/index.ts          # Shared TS types (Order, PaymentMethod, enums…)
  middleware.ts           # Security: admin gate, rate limiting, injection/UA blocking
public/                   # Images, PWA splash screens, sw.js, favicon, static HTML
```

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

## Key conventions & patterns

- **Catalogue is code-defined.** The live product catalogue lives in
  `src/lib/supports.ts` (`CATALOGUE` array), not the database. The `Support`
  Prisma model exists but the site reads from this file. Add/edit products
  there.
- **Order numbers**: generated by `generateOrderNumber()` → `TV-YYMMDD-####`.
- **Prisma singleton**: always import `prisma` from `@/lib/db` (avoids
  connection exhaustion in dev). Don't instantiate `new PrismaClient()`.
- **Money**: amounts are FCFA integers; Stripe amounts multiply by 100 with
  currency `xof`. Format for display with `formatPrix()`.
- **API route runtimes**: the three AI routes use `export const runtime = "edge"`;
  DB-backed routes (`orders`, `admin/orders`, stripe webhook) use
  `export const dynamic = "force-dynamic"` (Node runtime, needed for Prisma).
- **Validation & sanitisation**: order/API inputs are hand-validated and
  sanitised inside route handlers (see `api/orders/route.ts`: `sanitize()`,
  `isValidEmail`, `isValidPhone`, `isValidPrice`, allow-listed payment methods).
  Keep this defensive style for new endpoints.
- **Admin auth**: `/admin` and `/api/admin/*` require the `ADMIN_SECRET` via the
  `x-admin-secret` header (or `admin-token` cookie), enforced in
  `src/middleware.ts` and re-checked in the admin API handlers. There is no
  NextAuth login flow wired up despite the dependency being present.
- **Security middleware** (`src/middleware.ts`) runs on all non-static routes:
  admin gating, IP rate limiting (10/min on order POST, 60/min general),
  SQLi/XSS/path-traversal pattern blocking, scanner user-agent blocking, and
  method restrictions. `next.config.mjs` adds strict security headers + CSP —
  **when integrating a new external domain (script, image, API, font), add it
  to the matching CSP directive in `next.config.mjs`** or requests will be
  blocked.

## Styling

Tailwind custom theme (`tailwind.config.ts`):
- Brand palette: `vert` (green, `vert-900` `#07402b` is the primary brand color
  / `themeColor`), `or` (gold), `orange`. Prefer these over ad-hoc hex values.
- Fonts: `font-sans` = Inter, `font-arabic` = Amiri.
- Gradients: `bg-gradient-touba`, `bg-gradient-hero`, `bg-gradient-atv`.
- Use `cn()` from `@/lib/utils` to compose conditional class names.

## Git workflow

- Work on the designated feature branch; commit with clear, descriptive
  **French** messages following the existing convention
  (`feat:`, `fix:` prefixes — e.g. `feat: site institutionnel…`,
  `fix: generateur-voix — …`).
- Run `npm run lint` and `npm run build` before pushing.
- Do **not** open a pull request unless explicitly asked.
- Never commit `.env*` files or secrets.

## Notes & gotchas

- **Rate limiting is in-memory** (`Map` in `middleware.ts` / `rateLimit.ts`), so
  it resets per serverless instance and is best-effort only — not a substitute
  for a shared store in production.
- AI generators call **third-party public endpoints** (pollinations.ai,
  ttsmp3.com); the image route returns the URL for the browser to fetch
  directly to avoid server-side timeouts on Vercel.
- Several routes/pages are **campaign-specific** (`magal`, `tabaski`,
  `marche-ocass`, `public/diomaye-mbacke.html`) and largely independent of the
  core ordering flow.
- PWA: `public/sw.js` service worker is registered in the root layout; splash
  screens and manifest are configured for iOS.
