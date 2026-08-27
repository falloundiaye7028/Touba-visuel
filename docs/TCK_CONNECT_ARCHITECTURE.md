# TCK CONNECT — architecture fonctionnelle et feuille de route

> Les personnes, montants et dossiers visibles dans la démonstration sont fictifs. Aucun paiement n'est initié tant qu'un fournisseur agréé n'est pas configuré.

## 1. Architecture cible

TCK CONNECT est un **monolithe modulaire Next.js** au démarrage : interface React mobile-first, API serveur versionnée, services métier indépendants et PostgreSQL. Cette forme réduit le coût d'exploitation tout en conservant des frontières permettant d'extraire ultérieurement les paiements, notifications et rapports.

```text
Web / PWA terrain / portail public
              │ HTTPS
Next.js (UI + API /api/tck/v1)
  ├─ Identité, MFA, sessions et RBAC
  ├─ Membres, contributions et reçus
  ├─ Finances, achats et validations
  ├─ Projets, commissions et demandes
  ├─ Patrimoine, stocks et Grand Magal
  └─ Audit, rapports et notifications
              │
PostgreSQL ─ stockage objet ─ file de tâches
              │
Adaptateurs : Mobile Money / banque / SMS / WhatsApp / e-mail / carte
```

Les écritures comptables et événements d'audit sont append-only. Une correction crée une contre-écriture liée à l'original. Les dossiers médicaux, sociaux et disciplinaires sont chiffrés au niveau applicatif et exclus des index, exports et rapports publics.

## 2. Rôles et séparation des responsabilités

Les quatorze rôles demandés sont définis dans `src/lib/tck/permissions.ts`. Une autorisation combine : **rôle + action + commission + zone + projet**. Le serveur recalcule systématiquement cette décision ; masquer un bouton ne constitue pas une protection.

Le workflow d'une dépense suit `brouillon → soumise → approuvée → payée → auditée`. Le demandeur ne peut pas approuver, un approbateur ne peut pas payer et aucun acteur précédent ne peut auditer. Le quorum initial est 13 et doit être paramétrable par type et montant de dépense.

## 3. Entités relationnelles principales

| Domaine | Entités principales |
| --- | --- |
| Identité | User, Role, Permission, Session, Device, MFAChallenge, ScopeAssignment |
| Membres | Member, Zone, District, Dahira, Country, Consent, MemberCard, DuplicateCandidate |
| Collecte | Collector, CollectionPoint, Contribution, PaymentIntent, Receipt, CashClosure, Reconciliation, Anomaly |
| Finances | Account, Budget, BudgetLine, ExpenseRequest, Approval, LedgerEntry, Reversal, Supplier, Quote, PurchaseOrder, Reception |
| Opérations | Project, Milestone, Task, Risk, Incident, HSERecord, QualityControl, WorkOrder, ImpactMetric |
| Organisation | Commission, Mandate, Meeting, Vote, Resolution, Document, Signature |
| Citoyens | CitizenRequest, ConfidentialCase, Attachment, Assignment, StatusHistory, SLA |
| Patrimoine | Asset, AssetType, GeoFeature, Maintenance, StockItem, StockMovement, Vehicle, FuelLog |
| Transversal | AuditEvent, Notification, Template, PublicReport, Partner, MagalEdition |

Les tables volumineuses (`Contribution`, `LedgerEntry`, `AuditEvent`, `Notification`) sont partitionnées par mois et identifiées par UUIDv7. Les recherches de membres s'appuient sur des colonnes normalisées et des index dédiés, sans exposer le téléphone brut.

## 4. Arborescence des écrans du MVP

- Connexion, MFA, récupération et gestion des appareils
- Vue d'ensemble adaptée au rôle
- Membres : registre, fiche, contribution, carte QR, import, doublons, diaspora
- Collecte : saisie, paiement, reçu, carnet, caisse journalière, rapprochement, anomalies
- Finances : budgets, demande, approbations, paiement, achats, fournisseurs, grand livre
- Projets : portefeuille, fiche, jalons, terrain, HSE/qualité, réception et impact
- Commissions : feuille de route, réunions, tâches, budget et rapports
- Demandes : guichet public, triage, affectation, intervention et historique
- Transparence : chiffres anonymisés, projets, carte et rapports mensuels
- Administration : utilisateurs, rôles, périmètres, adaptateurs, quorum, audit

## 5. Parcours prioritaires

1. **Adhésion** : recherche de doublon → consentement → identifiant TCK → carte QR → notification.
2. **Contribution espèces** : membre → collecteur habilité → reçu numéroté → clôture caisse → rapprochement → anomalie éventuelle.
3. **Paiement numérique** : intention locale → redirection fournisseur → webhook signé → contribution comptabilisée → reçu. Aucun succès n'est déduit du seul retour navigateur.
4. **Dépense** : demande + justificatifs → contrôles budgétaires → quorum → paiement indépendant → écriture immuable → audit.
5. **Demande citoyenne** : numéro → consentement/localisation → triage → service et SLA → intervention → preuve → clôture et notification.

## 6. API v1 prévue

- `POST /auth/sessions`, `POST /auth/mfa/verify`, `DELETE /auth/sessions/:id`
- `GET|POST /members`, `GET|PATCH /members/:id`, `POST /members/import`, `POST /members/merge`
- `GET|POST /contributions`, `POST /cash-closures`, `POST /reconciliations`
- `POST /payments/intents`, `POST /payments/:provider/webhook` (signature et idempotence obligatoires)
- `GET|POST /expenses`, `POST /expenses/:id/approvals`, `POST /expenses/:id/payments`, `POST /ledger/:id/reversals`
- `GET|POST /projects`, `GET|POST /requests`, `POST /requests/:id/transitions`
- `GET /public/projects`, `GET /public/reports`, `GET /public/impact`

Toutes les mutations exigent une clé d'idempotence, produisent un événement d'audit et utilisent un contrôle de concurrence optimiste. Pagination par curseur uniquement sur les grands registres.

## 7. Déploiement et exploitation

- Environnements séparés développement, recette et production ; secrets dans un coffre.
- PostgreSQL haute disponibilité, réplica de lecture, sauvegarde quotidienne et restauration testée trimestriellement.
- Stockage objet privé avec URL signées, antivirus et politique de conservation.
- CSP stricte, TLS, cookies `HttpOnly/Secure/SameSite`, rate limiting, rotation des sessions et MFA privilégié.
- Métriques techniques et métier, journaux sans données sensibles, alertes sur anomalies financières.
- Cache PWA limité aux référentiels terrain autorisés ; file chiffrée hors ligne et résolution explicite des conflits.

## 8. Feuille de route

1. **Socle** : schéma PostgreSQL, identité, RBAC/périmètres, audit et CI.
2. **MVP collecte** : membres, collecteurs, contributions, reçus, caisse et exports.
3. **MVP gouvernance** : budgets, dépenses, quorum, projets, commissions et demandes.
4. **Transparence** : rapports anonymisés, carte publique, indicateurs et notifications.
5. **Terrain** : PWA hors ligne, patrimoine, stocks, maintenance et Grand Magal.
6. **Échelle** : partitionnement, workers, réplica, tests de charge jusqu'à deux millions de membres.

## 9. Hypothèses à valider

- Structure officielle des zones, cellules, dahiras et commissions.
- Organes habilités, règles de délégation et seuils de quorum par montant.
- Plan comptable, comptes bancaires et règles sénégalaises de conservation.
- Fournisseurs officiellement contractualisés pour paiement et messagerie.
- Responsable de traitement, durées de conservation et procédure d'exercice des droits.
