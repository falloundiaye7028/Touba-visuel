# Déploiement

## Vercel + PostgreSQL managé

1. Créer une base PostgreSQL managée avec sauvegardes et PITR.
2. Définir la racine du projet Vercel sur `apps/immotera`.
   Le fichier `vercel.json` force le preset `nextjs` pour éviter un projet détecté comme site statique.
3. Créer un Vercel Blob avec accès privé, l’associer au projet et définir `STORAGE_PROVIDER=blob`. Préférer `BLOB_STORE_ID` + OIDC Vercel ; `BLOB_READ_WRITE_TOKEN` reste possible pour compatibilité.
4. Ajouter les autres variables de `.env.example` dans les environnements Preview et Production, dont `DOCUMENT_MAX_SIZE_MB=20` et un `DOCUMENT_SIGNING_SECRET` d’au moins 32 octets.
   En production, définir `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` sur `https://intelligenceimmobilier.com`.
5. Désactiver `DEMO_MODE` en production.
6. Exécuter `prisma migrate deploy` dans une étape contrôlée avant promotion. La migration `20260902090000_secure_documents` doit être appliquée avant d’activer l’upload.
7. Construire avec `npm run build`.
8. Vérifier `/`, `/login`, `/dashboard`, `/documents`, l’upload PDF, la visualisation, le téléchargement et la suppression logique sur Preview.
9. Affecter `intelligenceimmobilier.com` au projet, puis ajouter `www.intelligenceimmobilier.com` avec redirection vers le domaine canonique.

## Contrôles de lancement

- Origine `NEXTAUTH_URL` exacte et HTTPS.
- Secret Auth d’au moins 32 octets aléatoires.
- Base inaccessible publiquement ou filtrée par réseau.
- Bucket documentaire privé et URLs signées.
- Upload direct privé opérationnel jusqu’à la limite configurée, callback/finalisation serveur et absence de blob orphelin en cas d’échec.
- Alertes erreur, latence, taux d’échec paiement, quota DB et espace disque.
- Sauvegarde/restauration testée.
- DNS, email transactionnel et pages légales validés.

Le build n’effectue aucune connexion à la base. Les migrations restent une opération explicite.
