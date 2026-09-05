# Base de données

PostgreSQL est piloté par Prisma. Les identifiants métier sont des UUID ; les références humaines sont uniques dans l’organisation. Les montants locatifs courants sont stockés en entiers FCFA, sans flottants.

## Invariants

- Toutes les ressources métier sont rattachées à une organisation.
- Un paiement confirmé produit des allocations et un audit dans la même transaction.
- `PaymentAllocation` évite de confondre paiement et échéance.
- `contractVersion` sur `RentSchedule` préserve l’historique après avenant.
- Les règles de commission sont copiées dans `ruleSnapshot`.
- Les relevés propriétaires conservent leur `breakdown` historique.
- `deletedAt` archive les données critiques sans les effacer.

## Index

Les index couvrent les filtres tenant + statut/date, références, échéances, recherches de portefeuille et audit. Les listes API sont paginées et plafonnées à 50 ou 100 lignes.

## Migrations

En local : `npm run db:push` pour un prototype. En environnement partagé, créer une migration versionnée avec `npx prisma migrate dev --name <nom>`, inspecter le SQL, puis utiliser `npx prisma migrate deploy`.

Ne jamais lancer `db push` directement sur la production.
