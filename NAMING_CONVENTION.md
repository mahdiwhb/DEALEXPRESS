# Charte de nommage — Deal Express

## Fichiers et dossiers
- Dossiers en minuscules (`controllers/`, `models/`, `routes/`)
- Fichiers de modèles en PascalCase singulier : `User.js`, `Deal.js`, `Comment.js`
- Fichiers de contrôleurs en camelCase suffixé : `dealController.js`, `authController.js`

## Variables et fonctions (JavaScript)
- camelCase pour variables et fonctions : `getUserById`, `dealId`
- PascalCase réservé aux modèles/classes Mongoose (`const Deal = mongoose.model(...)`)
- Constantes de configuration en UPPER_SNAKE_CASE (`JWT_SECRET`, `JWT_EXPIRE`)

## Routes API
- Toujours au pluriel et en minuscules : `/deals`, `/users`, `/comments`
- Verbes HTTP standards (GET/POST/PUT/DELETE), jamais de verbe dans l'URL (pas de `/getDeals`)

## Base de données (schémas Mongoose)
- Champs en camelCase : `createdAt`, `authorId`, `isApproved`
- Références vers d'autres documents suffixées `Id` ou `Ids` : `userId`, `commentIds`

## Application de cette charte
Vérifiable directement dans le code existant : `models/`, `routes/`, `controllers/` suivent cette convention de façon cohérente sur l'ensemble du projet.
