# SAMA BUSINESS — Plateforme SaaS de gestion commerciale

> Vendez. Gérez. Encaissez. Fidélisez.
> Assistant intelligent de gestion pour commerçants et PME du Sénégal (extensible à l'Afrique francophone).

SAMA BUSINESS est développé **au sein du dépôt existant** (Next.js 15 + Prisma + PostgreSQL),
en tant qu'application **autonome et isolée** sous le préfixe de routes `/sama`, sans casser
le site Touba Visuel existant.

## Accès

| Espace | URL |
| --- | --- |
| Landing publique | `/sama` |
| Inscription | `/sama/inscription` |
| Connexion | `/sama/connexion` |
| Application (privée) | `/sama/dashboard` |
| Boutique publique | `/sama/boutique/{slug}` |
| Super Admin | `/sama/super-admin` |

## Architecture

- **Framework** : Next.js 15 (App Router, Server Components + Server Actions), React 18, TypeScript strict.
- **Base de données** : PostgreSQL via Prisma. Tous les modèles SAMA sont préfixés `Sama*`
  et coexistent avec les modèles Touba Visuel sans collision.
- **Authentification** : NextAuth (JWT + Credentials email/téléphone, mots de passe hachés bcrypt).
- **Multi-tenant** : chaque donnée métier est reliée à `businessId`. L'accès est vérifié
  **côté serveur** via l'appartenance (`SamaMember`) dans `src/lib/sama/tenant.ts`. Une entreprise
  ne voit jamais les données d'une autre.
- **Rôles & permissions** : 6 rôles (Propriétaire, Gérant, Vendeur, Caissier, Gestion stock,
  Commercial) avec permissions granulaires appliquées côté serveur (`src/lib/sama/constants.ts`).
- **Argent** : montants stockés en **entiers FCFA** (pas de virgule flottante). Système multidevise prêt.
- **Numérotation** : séquences par entreprise et par année — `CMD-2026-000001`, `FAC-…`, `DEV-…`,
  `REC-…`, `VTE-…` (`src/lib/sama/numbering.ts`).
- **Mobile-first** : bottom navigation, gros boutons, formulaires simples ; sidebar sur desktop.

## Organisation du code

```
src/
├── app/sama/
│   ├── page.tsx                 # Landing marketing
│   ├── (auth)/                  # inscription, connexion
│   ├── onboarding/              # assistant de démarrage
│   ├── nouvelle-entreprise/     # création d'entreprise
│   ├── (app)/                   # espace privé (layout shell + garde onboarding)
│   │   ├── dashboard, ventes, commandes, produits, stock, clients,
│   │   ├── depenses, factures, rapports, boutique, marketing,
│   │   ├── employes, fournisseurs, notifications, abonnement, parametres, plus
│   ├── boutique/[slug]/         # boutique publique + panier
│   └── super-admin/             # administration plateforme
├── components/sama/             # UI réutilisable (formulaires, shell, cartes…)
└── lib/sama/
    ├── auth.ts, tenant.ts       # sécurité & multi-tenancy
    ├── constants.ts, money.ts   # métier & monnaie
    ├── numbering.ts, limits.ts  # numérotation & quotas de plan
    ├── queries.ts, plans.ts     # analytics & plans
    └── actions/                 # Server Actions (products, customers, sales,
                                 # orders, expenses, invoices, settings,
                                 # subscription, admin, account)
```

## Modules livrés (V1 MVP — fonctionnels, reliés à la BDD)

- ✅ Authentification (inscription, connexion, déconnexion, sessions)
- ✅ Entreprise + onboarding guidé
- ✅ Tableau de bord (indicateurs réels : CA, marge, dépenses, encaissements, créances, graphe 7j)
- ✅ Produits (CRUD, catégories, SKU, prix achat/vente/grossiste)
- ✅ Stock (mouvements, historique, alertes rupture, valeur du stock)
- ✅ Clients / CRM (fiches, historique d'achats, créances, WhatsApp)
- ✅ Ventes (panier, décrément stock, calcul de marge, paiements partiels/crédit, reçu, annulation avec restauration du stock)
- ✅ Commandes (création manuelle + boutique en ligne, statuts)
- ✅ Dépenses (catégories, suivi mensuel)
- ✅ Factures & reçus (génération, impression/PDF via navigateur)
- ✅ Rapports (CA, coût, marge, résultat estimatif, canaux, top produits, dépenses)
- ✅ Boutique publique (catalogue, panier, commande web + WhatsApp)
- ✅ Abonnements (4 plans, essai 14 j, limites appliquées)
- ✅ Super Admin (KPI SaaS : MRR, ARPU, conversion ; activation/suspension/prolongation ; tarifs configurables)
- ✅ Notifications, journal d'activité, rôles & permissions

## Modules livrés (V2 gestion)

- ✅ Devis (`DEV-2026-…`) : création, impression/PDF, **conversion en vente** (stock + reçu).
- ✅ Fournisseurs : fiches CRUD, produits associés, **grand livre des dettes** (achats/paiements/retours).
- ✅ Employés : **invitation par téléphone** (mot de passe temporaire), gestion des rôles, activation/désactivation.
- ✅ Imports CSV / Excel : produits et clients, reconnaissance des en-têtes FR, aperçu avant import, respect des limites de plan.

## Modules livrés (V3 — SAMA AI)

- ✅ **Assistant SAMA AI** (`/sama/ai`) : chat qui répond sur les données **réelles** de l'entreprise
  (ventes du jour, produit le plus rentable, ruptures, clients inactifs, meilleur vendeur, évolution…).
  Les chiffres sont calculés côté serveur (moteur déterministe) — **jamais inventés** ; le modèle ne
  sert qu'à formuler à partir des faits fournis.
- ✅ **Synthèse & recommandations** : résumé d'activité + conseils générés à partir des vrais indicateurs.
- ✅ **Contenu marketing IA** (bouton « Créer du contenu avec l'IA » sur chaque produit) : titre,
  description, publications Facebook / Instagram / TikTok / WhatsApp, slogan, hashtags, offre promo,
  avec ton configurable (professionnel, vendeur, premium, simple, dynamique).
- Accès réservé au plan **Pro IA** (ou pendant l'essai actif) ; sinon page d'upsell honnête.
- Modèle appelé côté serveur via `text.pollinations.ai` (sans clé exposée au client).

## Finition V1 (polish)

- ✅ **Upload d'images** : photos de produits, logo et bannière — compression/redimensionnement
  côté client (canvas → data URL), sans dépendance à un stockage externe (migrable vers un
  stockage objet). Affichées dans le catalogue et la boutique.
- ✅ **Recherche globale** (`/sama/recherche` + barre du haut) : clients, produits, ventes,
  factures/devis, commandes — par nom, téléphone, référence ou numéro.
- ✅ **Exports CSV / Excel** : produits, clients, ventes, dépenses, stock (route protégée par
  session/tenant, BOM UTF-8 pour Excel).
- ✅ **PWA installable** : manifest dédié (`/sama-manifest.webmanifest`), service worker
  (`/sama-sw.js`, réseau d'abord + repli hors-ligne), « Ajouter à l'écran d'accueil ».
- ✅ **Mode sombre** : bascule persistée (localStorage) avec application anti-flash au chargement.
- 📄 **PDF** : via l'impression navigateur des reçus, factures et devis (bouton Télécharger/Imprimer).

## Roadmap (préparée dans l'architecture)

- **V2 (reste)** : campagnes, multi-boutiques, permissions personnalisées par membre.
- **V3** : SAMA AI (assistant business, analyses, contenu marketing, rapports IA).
- **V4** : grossistes, marketplace B2B, intégrations paiement (Wave/Orange Money API), livraison, API partenaires.

Les modules non encore implémentés affichent un état honnête « Bientôt disponible » — **aucun faux bouton**.

## Variables d'environnement

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_SECRET=<secret aléatoire long>
NEXTAUTH_URL=https://votre-domaine        # en production
ADMIN_SECRET=<secret pour /api/sama/seed et /admin>
SAMA_SUPERADMIN_EMAILS=vous@exemple.com   # emails super-admin (séparés par des virgules)
```

## Démarrage

```bash
npm install
npx prisma db push          # crée les tables (SAMA + existantes)
npm run dev                 # http://localhost:3000/sama

# Compte de démonstration « Sama Fashion » (produits, 15 clients, 25 ventes, 10 commandes) :
curl -X POST http://localhost:3000/api/sama/seed -H "x-admin-secret: $ADMIN_SECRET"
# Connexion démo : demo@sama.local / demo1234
```

## Sécurité

Isolation multi-tenant côté serveur, validation Zod, hachage bcrypt, rate-limiting et filtrage
d'injections (middleware), soft-delete des produits, journal d'activité des actions sensibles,
secrets jamais exposés côté client.

> Les résultats financiers affichés sont des indicateurs de gestion et ne remplacent pas une comptabilité certifiée.
