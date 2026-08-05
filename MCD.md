# Modèle Conceptuel de Données — Deal Express

## Entités et relations

USER (1) ──────< (N) DEAL │ │ │ id │ id │ email │ title │ password │ price │ role │ category └─ createdAt │ votes {hot, cold} │ isApproved └─ createdAt

USER (1) ──────< (N) COMMENT >────── (N) DEAL │ │ id │ content └─ createdAt


## Règles de gestion
1. Un USER peut créer plusieurs DEAL (1,N) ; un DEAL appartient à un seul USER (1,1)
2. Un USER peut écrire plusieurs COMMENT (1,N) ; un COMMENT appartient à un seul USER (1,1)
3. Un DEAL peut recevoir plusieurs COMMENT (1,N) ; un COMMENT est lié à un seul DEAL (1,1)
4. Un DEAL a exactement un compteur de votes hot et un compteur cold (1,1) — pas d'entité VOTE séparée dans la version actuelle (limite connue : impossible d'empêcher un même utilisateur de voter plusieurs fois sans traçabilité par utilisateur — évolution possible : entité VOTE liant userId + dealId)
5. Seuls les DEAL avec `isApproved = true` sont visibles publiquement

## Passage au MLD (MongoDB, dénormalisé)
Contrairement à un MLD relationnel classique, MongoDB favorise la référence légère (ObjectId) plutôt que la jointure : `authorId` dans `deals` et `comments` référence `users._id`, mais aucune contrainte de clé étrangère native n'est appliquée par la base — l'intégrité est garantie au niveau applicatif (contrôleurs), pas au niveau base de données.
