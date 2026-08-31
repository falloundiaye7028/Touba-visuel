# IntelligenceImmobilier AI

L’assistant suit une architecture tool-based. Les outils disponibles sont `getRentArrears`, `getVacantProperties`, `getExpiringLeases`, `getMonthlyRevenue` et `getOwnerStatements`.

Chaque outil :

1. résout l’utilisateur et l’organisation active ;
2. vérifie la permission requise ;
3. exécute une requête bornée et filtrée par tenant ;
4. renvoie uniquement les champs nécessaires.

Le modèle ne reçoit aucune chaîne de connexion et ne produit aucun SQL. Les montants affichés doivent être issus des résultats d’outils. Toute mutation future utilisera une commande métier idempotente avec confirmation utilisateur et audit.

La génération d’annonces doit recevoir une représentation structurée du bien et omettre toute caractéristique absente ; elle ne peut pas inférer une piscine, un standing ou une proximité non enregistrée.
