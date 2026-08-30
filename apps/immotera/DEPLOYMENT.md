# Déploiement

## Vercel + PostgreSQL managé

1. Créer une base PostgreSQL managée avec sauvegardes et PITR.
2. Définir la racine du projet Vercel sur `apps/immotera`.
3. Ajouter les variables de `.env.example` dans les environnements Preview et Production.
4. Désactiver `DEMO_MODE` en production.
5. Exécuter `prisma migrate deploy` dans une étape contrôlée avant promotion.
6. Construire avec `npm run build`.
7. Vérifier `/`, `/login`, `/dashboard`, création de bien et paiement sur Preview.

## Contrôles de lancement

- Origine `NEXTAUTH_URL` exacte et HTTPS.
- Secret Auth d’au moins 32 octets aléatoires.
- Base inaccessible publiquement ou filtrée par réseau.
- Bucket documentaire privé et URLs signées.
- Alertes erreur, latence, taux d’échec paiement, quota DB et espace disque.
- Sauvegarde/restauration testée.
- DNS, email transactionnel et pages légales validés.

Le build n’effectue aucune connexion à la base. Les migrations restent une opération explicite.
