# Dictionnaire de données — Deal Express

## Collection `users`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| _id | ObjectId | auto | Identifiant unique MongoDB |
| email | String | unique, requis | Identifiant de connexion |
| password | String | requis | Hash bcrypt, jamais stocké en clair |
| role | String enum | user/moderator/admin | Contrôle d'accès |
| createdAt | Date | auto | Date de création du compte |

## Collection `deals`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| _id | ObjectId | auto | Identifiant unique |
| title | String | requis | Titre du deal |
| price | Number | requis, ≥ 0 | Prix affiché |
| category | String | requis | Catégorie du deal |
| authorId | ObjectId → users | requis | Référence à l'utilisateur créateur |
| votes | { hot: Number, cold: Number } | défaut 0 | Compteurs de votes |
| isApproved | Boolean | défaut false | Statut de modération |
| createdAt | Date | auto | Date de publication |

## Collection `comments`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| _id | ObjectId | auto | Identifiant unique |
| dealId | ObjectId → deals | requis | Deal commenté |
| authorId | ObjectId → users | requis | Auteur du commentaire |
| content | String | requis | Contenu du commentaire |
| createdAt | Date | auto | Date du commentaire |
