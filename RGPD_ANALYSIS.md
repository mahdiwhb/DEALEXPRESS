# Analyse RGPD — Deal Express

## Données personnelles traitées
| Donnée | Finalité | Base légale | Conservation |
|---|---|---|---|
| Email | Identification, connexion | Exécution du contrat (CGU implicites) | Durée du compte actif |
| Mot de passe (hashé) | Authentification | Exécution du contrat | Durée du compte actif |
| Contenu publié (deals, commentaires) | Fonctionnement du service | Intérêt légitime | Durée du compte + modération |

## Mesures déjà en place (vérifiables dans le code)
- **Minimisation :** aucune donnée personnelle superflue collectée (pas de téléphone, pas d'adresse)
- **Sécurité :** mot de passe hashé avec bcrypt, jamais stocké ni transmis en clair
- **Contrôle d'accès :** middleware de rôles empêchant l'accès aux données d'autres utilisateurs

## Ce qui manque pour une conformité RGPD complète (honnêteté assumée)
- Pas de politique de confidentialité rédigée
- Pas de mécanisme explicite de droit à l'oubli (suppression de compte + données associées)
- Pas de consentement explicite à la création de compte (CGU/politique de confidentialité non présentées)

## Plan de mise en conformité (si le projet devait être mis en production réelle)
1. Rédiger une politique de confidentialité claire
2. Ajouter une route `DELETE /users/me` avec suppression en cascade des deals/commentaires liés (ou anonymisation)
3. Ajouter une case à cocher de consentement explicite à l'inscription
