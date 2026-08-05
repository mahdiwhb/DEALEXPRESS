# Estimation de charge et considérations d'exécution répartie — Deal Express

## Contexte

Deal Express est une API REST Node.js/Express avec MongoDB, actuellement dimensionnée pour un usage personnel/démonstration (pas de trafic réel mesuré). Cette analyse pose une estimation raisonnée de sa capacité actuelle et des leviers disponibles en cas de montée en charge.

## 1. Estimation de la capacité actuelle (instance unique)

**Hypothèses de dimensionnement (valeurs standards pour une architecture Node.js single-thread) :**
- Node.js gère les I/O de façon asynchrone non-bloquante : la capacité dépend surtout du temps de réponse MongoDB et de la RAM disponible, pas du CPU pour ce type de charge (CRUD simple)
- Temps de réponse moyen estimé par requête : 20-50 ms (lecture MongoDB indexée) à 100-150 ms (écriture avec validation + hash bcrypt sur les routes d'auth)
- bcrypt est volontairement coûteux en CPU (protection contre le brute-force) : c'est le point le plus limitant de l'API, pas les routes CRUD classiques

**Estimation :** une seule instance Node.js (config standard, 512 Mo-1 Go RAM) peut raisonnablement absorber de l'ordre de **50 à 150 requêtes/seconde** sur les routes CRUD standards, mais seulement quelques dizaines de requêtes/seconde sur les routes register/login à cause du coût CPU de bcrypt.

## 2. Le vrai goulot d'étranglement : MongoDB, pas Node.js

Le pool de connexions Mongoose par défaut (100 connexions) et le nombre de requêtes simultanées vers MongoDB sont plus limitants que Node.js lui-même. Sans index sur les champs de recherche fréquents (ex. recherche de deals par catégorie), les temps de réponse se dégraderaient rapidement à mesure que la collection grossit.

**Action concrète à prévoir avant montée en charge réelle :** vérifier/ajouter des index MongoDB sur les champs utilisés dans les filtres (`category`, `status`, `createdAt`).

## 3. Scénario d'exécution répartie (si la charge dépassait la capacité d'une instance)

Si le trafic dépassait ce que l'instance unique peut absorber, l'architecture actuelle (stateless, JWT — pas de session serveur à synchroniser) se prête bien à une distribution horizontale :

1. **Plusieurs instances Node.js** derrière un load balancer (round-robin) — possible sans modification de code car aucune donnée de session n'est stockée en mémoire locale (JWT = stateless par design)
2. **MongoDB en réplica set** plutôt qu'une instance unique, pour répartir les lectures
3. **Cache Redis** devant les routes de lecture les plus fréquentes (liste des deals, par exemple) pour réduire la charge sur MongoDB
4. Séparer la route register/login (coûteuse en CPU à cause de bcrypt) sur un pool d'instances dédié, pour ne pas dégrader les routes CRUD standards en cas de pic d'inscriptions

## Conclusion

L'architecture actuelle (stateless, JWT, MVC) n'empêche pas une évolution vers l'exécution répartie — c'est même un choix de conception qui la facilite. Le vrai travail de dimensionnement nécessiterait des tests de charge réels (ex. avec k6 ou Artillery) pour remplacer ces estimations théoriques par des mesures.
