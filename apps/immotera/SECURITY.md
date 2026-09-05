# Sécurité

## Modèle de menace

Menaces prioritaires : accès croisé entre organisations, élévation de privilège, fraude ou correction financière silencieuse, vol de session, upload malveillant, exposition d’un document sensible, injection, abus de l’API et fuite de secrets.

## Contrôles implémentés

- Auth.js avec cookie `httpOnly`, `sameSite=lax`, `secure` en production et sessions limitées.
- RBAC serveur : OWNER, ADMIN, MANAGER, AGENT, ACCOUNTANT, VIEWER.
- Résolution de l’organisation active via membership ; toutes les requêtes métier filtrent `organizationId`.
- Validation Zod des entrées API.
- Transactions PostgreSQL pour paiement → allocations → soldes → reçu → audit.
- Numéros de reçu uniques ; montants en entiers FCFA ; aucune modification financière silencieuse.
- Soft delete pour les données métier importantes.
- Audit append-only des actions critiques.
- Limitation de débit sur les paiements ; en production, remplacer le stockage mémoire par Redis distribué.
- En-têtes `DENY`, `nosniff`, politique de référent stricte et permissions navigateur réduites.
- Clés et secrets uniquement côté serveur.

## Documents et uploads

Le module Documents utilise un stockage privé (`@vercel/blob` en hébergement Vercel, système de fichiers privé uniquement en développement). La limite vient exclusivement de `DOCUMENT_MAX_SIZE_MB` et vaut 20 Mo par défaut. Le serveur contrôle extension, MIME déclaré, correspondance extension/MIME, taille, magic bytes et checksum SHA-256 avant la création de la ligne `Document`.

Le chemin de stockage est aléatoire et préfixé par l’organisation ; le nom original n’est jamais utilisé comme clé. Les lectures passent par une URL applicative HMAC liée au document, au tenant, à la disposition et à une expiration de cinq minutes. La session, la membership active, `documents.read` et `organizationId` sont revérifiés au moment de servir le contenu. Les actions `DOCUMENT_UPLOADED`, `DOCUMENT_VIEWED`, `DOCUMENT_DOWNLOADED` et `DOCUMENT_DELETED` sont auditables sans journaliser le contenu.

La suppression métier est un soft delete. Le blob n’est pas purgé immédiatement afin d’éviter une destruction accidentelle ; une tâche de rétention contrôlée devra purger les blobs après le délai contractuel. Avant production, ajouter une analyse antivirus asynchrone et une quarantaine si le niveau de risque documentaire l’exige.

## IA

L’assistant n’accède jamais à Prisma ni à SQL libre. Il appelle des outils en lecture seule qui réappliquent contexte et permissions. Une action mutante nécessite une fonction métier dédiée et une confirmation explicite dans l’interface.

## Secrets, logs et récupération

- Secrets dans Vercel/gestionnaire de secrets, jamais dans Git ni dans les logs.
- Masquer jetons, mots de passe, pièces d’identité et coordonnées bancaires.
- Sauvegardes PostgreSQL quotidiennes, PITR selon le fournisseur, test de restauration trimestriel.
- Journaliser les incidents et conserver un runbook de révocation des sessions et rotations de clés.

## Avant production

Configurer CSP, Redis pour rate limiting, antivirus des uploads, RLS PostgreSQL, emails de vérification/réinitialisation, politique de conservation et test d’intrusion. Ces mécanismes techniques ne constituent pas à eux seuls une conformité juridique complète.
