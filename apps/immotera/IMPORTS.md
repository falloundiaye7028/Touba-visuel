# Imports CSV / XLSX

L’assistant V1 couvre fichier, aperçu, mapping, validation et rapport final. La lecture XLSX est chargée dynamiquement afin de ne pas alourdir le bundle principal.

Le pipeline serveur cible doit :

1. valider taille, extension, signature et MIME ;
2. stocker temporairement le fichier en privé ;
3. normaliser en lignes sans formule active ;
4. appliquer un mapping explicite ;
5. valider chaque ligne avec Zod ;
6. détecter les doublons dans l’organisation ;
7. écrire dans une transaction par lot ;
8. conserver `Import` et `ImportRow` pour le rapport et le rollback.

Types prioritaires : biens, propriétaires, locataires, contrats et loyers. Les erreurs doivent citer numéro de ligne, colonne, valeur et correction attendue sans exposer de données d’un autre tenant.
