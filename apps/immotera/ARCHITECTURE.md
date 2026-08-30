# Architecture

## Principes

IMMOTERA est un monolithe modulaire Next.js App Router. Les composants serveur restent le choix par défaut ; l’état client est limité aux interactions riches (palette, assistant d’import, formulaires, tableaux). PostgreSQL est la source de vérité en production.

```text
Navigateur
  → proxy de protection
  → Server Components / Route Handlers
  → contexte utilisateur + organisation active
  → RBAC + validation Zod
  → service métier transactionnel
  → Prisma
  → PostgreSQL
```

## Multi-tenant

Chaque table métier porte `organizationId`. Le contexte serveur résout une `Membership` active avant chaque lecture ou écriture. Les requêtes doivent inclure l’organisation active ; les identifiants envoyés par le client ne constituent jamais une autorisation.

Le schéma est prêt à recevoir une défense supplémentaire avec Row Level Security PostgreSQL. Cette couche doit compléter, et non remplacer, les contrôles applicatifs.

## Modules

- Identité : `User`, `Session`, `Organization`, `Membership`, `Invitation`, `LoginLog`.
- Patrimoine : `Property`, `Building`, `Unit`, `Owner`, `Tenant`.
- CRM : `Lead`, `Visit`, matching déterministe.
- Locatif : `Contract`, `RentSchedule`, `Payment`, `PaymentAllocation`.
- Finance : `Expense`, `Commission`, `OwnerStatement`.
- Opérations : `MaintenanceTicket`, `Vendor`, `Document`, `Import`.
- Gouvernance : `Notification`, `AuditLog`, `Setting`.

## Adaptateurs

Les interfaces `PaymentProvider`, `MessagingProvider`, `StorageProvider` et `BillingProvider` isolent les fournisseurs. Wave et Orange Money restent en registre manuel tant que les API officielles et contraintes réglementaires ne sont pas validées.

## Mode démonstration

Le frontend inclut un jeu sénégalais synthétique pour permettre une prévisualisation sans base. Les routes serveur et services transactionnels sont néanmoins implémentés pour PostgreSQL. `DEMO_MODE` doit être désactivé en production.
