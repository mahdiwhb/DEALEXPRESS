# Cahier des charges — Deal Express

## Contexte et objectif
Plateforme de partage de bons plans communautaires (façon Dealabs), permettant aux utilisateurs de publier, noter et commenter des deals, avec modération.

## Besoins fonctionnels

| Besoin | Description | Critère d'acceptation |
|---|---|---|
| Inscription/connexion | Un visiteur doit pouvoir créer un compte et se connecter | Mot de passe hashé, session via JWT, erreurs de validation explicites |
| Publier un deal | Un utilisateur connecté peut soumettre un deal (titre, prix, lien, catégorie) | Champs obligatoires validés côté serveur avant enregistrement |
| Voter sur un deal | Un utilisateur peut voter "hot" ou "cold" sur un deal | Un seul vote actif par utilisateur/deal, modifiable |
| Commenter | Un utilisateur peut commenter un deal | Commentaire lié à un deal et un auteur |
| Modérer | Un modérateur/admin peut approuver ou retirer un deal | Seuls les rôles autorisés ont accès à ces actions (contrôle par middleware) |

## Contraintes techniques
- API REST stateless (JWT, pas de session serveur)
- Base de données MongoDB (NoSQL, données faiblement structurées et évolutives : catégories de deals extensibles)
- Sécurité : mots de passe jamais stockés en clair, validation systématique des entrées

## Hors périmètre (assumé dès la conception)
- Pas de paiement intégré (le deal renvoie vers le site marchand externe)
- Pas de notifications temps réel (pourrait être une évolution future via WebSocket)
