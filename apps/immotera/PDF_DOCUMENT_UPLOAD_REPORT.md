# INTELLIGENCE IMMOBILIER / PDF DOCUMENT UPLOAD REPORT

## Statut

- Branche : `codex/document-upload-pdf`
- Production : non modifiée
- Build : réussi
- Tests unitaires : 17/17 réussis
- Tests Playwright : 26/26 réussis

## Correctif livré

L'ancien parcours « Documents » n'était qu'une interface : il ne gérait ni téléversement de fichier, ni stockage privé, ni contrôle serveur sur la ressource liée. Le module est désormais un vrai flux de documents sécurisé : sélection ou glisser-déposer, validation, stockage privé, création de la fiche, bibliothèque filtrable, visualisation/téléchargement temporaire et suppression logique.

## Fichiers principaux

- `src/components/DocumentUploadDialog.tsx` : dialogue d'import, métadonnées, progression et glisser-déposer.
- `src/components/ResourceDocuments.tsx` : bibliothèque globale et documents liés aux biens/projets.
- `src/app/api/documents/*` : API d'import, finalisation, liste, accès signé et suppression.
- `src/lib/documents/*` : configuration centralisée, validation binaire, stockage privé, signature et contrôle des ressources.
- `src/lib/services/documents.ts` : persistance, journal d'audit et suppression logique.
- `prisma/schema.prisma` et `prisma/migrations/20260902090000_secure_documents/` : modèle enrichi et migration non destructive.

## Stockage et accès

En environnement configuré, les fichiers utilisent Vercel Blob avec accès `private`. Le navigateur reçoit une URL d'accès de l'application, signée pour cinq minutes ; l'URL permanente du Blob n'est jamais exposée ni stockée comme lien de partage. En développement, un stockage local privé, hors du dossier public, permet les tests sans service distant.

Formats acceptés : PDF, JPG/JPEG, PNG, WEBP, DOC et DOCX. La taille maximale vient d'une unique variable `DOCUMENT_MAX_SIZE_MB` (20 Mo par défaut). L'extension, le type MIME et la signature binaire sont contrôlés ; un DOCX doit en outre contenir la structure interne attendue.

## Sécurité, rôles et multi-tenant

- Le serveur vérifie systématiquement la session, l'appartenance à l'organisation, les droits et la propriété de la ressource liée.
- `owner`, `admin` et `manager` peuvent lire, importer et supprimer ; `agent` peut seulement lire sauf permission explicite ; `viewer` lit uniquement.
- Les actions `DOCUMENT_UPLOADED`, `DOCUMENT_VIEWED`, `DOCUMENT_DOWNLOADED` et `DOCUMENT_DELETED` sont auditées.
- La suppression est logique ; une stratégie de purge différée protège contre les suppressions accidentelles.
- Les documents liés à `PROJECT` sont actuellement rattachés aux biens gérés, car le modèle de données ne possède pas encore d'entité Projet autonome.

## Vérifications réalisées

`npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e` et `npm run build` ont réussi. Les scénarios couvrent le PDF valide, les formats et signatures rejetés, la taille excessive, l'isolation tenant, les droits, la suppression, les liens Bien/Projet et les URLs de visualisation/téléchargement.

Captures disponibles :

- `artifacts/document-upload/dialog-chromium.jpg`
- `artifacts/document-upload/library-chromium.jpg`
- `artifacts/document-upload/dialog-mobile.jpg`
- `artifacts/document-upload/library-mobile.jpg`

## Prévisualisation et prérequis avant production

La Preview Vercel complète est disponible sur `https://intelligenceimmobilier-j7ubjujci-touba-visuel.vercel.app` (statut Ready). Aucune promotion de production n'a été effectuée. Un Blob privé dédié `intelligenceimmobilier-documents-preview` est connecté en région `cdg1`, et une base Neon PostgreSQL dédiée `intelligenceimmobilier-preview-db` est connectée uniquement à l'environnement Preview. Les deux migrations Prisma ont été appliquées.

Le parcours réel a été vérifié de bout en bout sur cette Preview : création d'un compte et d'une organisation temporaires, import d'un PDF fictif lié à un bien, écriture dans Neon, stockage dans le Blob privé, génération d'un lien signé, restitution d'un PDF 1.4 de 695 octets, suppression logique et disparition de la bibliothèque. Les données et le Blob temporaires ont ensuite été supprimés.

Avant toute mise en production, il reste à créer ou relier les ressources de production séparées, appliquer la migration dans cet environnement, puis vérifier l'antivirus/quarantaine et le travail planifié de purge des fichiers orphelins ou supprimés.
