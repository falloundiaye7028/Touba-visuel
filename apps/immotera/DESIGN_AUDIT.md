# Audit UI/UX — INTELLIGENCE IMMOBILIER

## Constats principaux

- L’identité précédente repose sur un vert institutionnel générique et n’exploite pas le bleu nuit, le cyan, l’argent ni le symbole « ii » du logo officiel.
- Le nom du produit est parfois concaténé, alors que la marque doit toujours apparaître sous la forme **INTELLIGENCE IMMOBILIER** dans l’interface.
- La sidebar ne peut pas être réduite, la topbar ne propose ni ajout rapide ni accès direct au copilote, et le thème sombre n’est pas disponible.
- Le dashboard est propre mais trop proche d’un modèle administratif standard : quatre KPI, un seul graphique et peu de décisions directement actionnables.
- Les pages métier possèdent déjà une bonne couverture fonctionnelle et responsive ; elles doivent être harmonisées par un système de tokens plutôt que réécrites au risque de casser les workflows.
- Le logo officiel n’est pas encore utilisé dans la landing page, l’authentification, la navigation ou les métadonnées sociales.
- Les couleurs, bordures, rayons et ombres sont encore largement distribués dans une feuille globale minifiée, ce qui limite la cohérence des modes clair et sombre.

## Direction retenue

Conserver toutes les routes, données de démonstration, formulaires et interactions existantes, puis appliquer une couche de design propriétaire centralisée : bleu nuit structurel, surfaces claires, accent cyan maîtrisé, chiffres tabulaires, rayons sobres, bordures fines et états sémantiques distincts. La refonte commence par le shell et le dashboard, puis propage les mêmes tokens aux pages métier, à l’IA, à la landing page et à l’authentification.
