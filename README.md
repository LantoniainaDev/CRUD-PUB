# API

## authentification [/]

- [/sigin] crée un compte d'utilisateur [method:post]
- [/login] se connecte avec un mot de passe et un email [method:post]
- [/logout] se deconnecte et vide le cookie [method:get]

- pour les requetes portégées, en l'abscence de cookie
l'utilisateur doit presenter son token dans les params de la requete  [.../?token=...]

## utilisateur [/user]
- [/] renvoit les données d'un itlisateur si et seulement s'il est connnécté ou présente son token[method:get]
- [/:id?filter=...] renvoit les données d'un utilisateur
specifiquement au filtre et dont l'id est spécifié[method:get]
- [/] modifie certaine données de l'utilisateur [method:put]
- [/:id] renvoit les données d'un utilisateur [method:delete]

```js
import axios from "axios";

const password = "lorem";
const name = "lorem";
const firstname = "lorem";

axios.post("/api/user",{ password,name,firstname})
```

- [/:id] permet a l'utilisateur de supprimer son compte [method:delete]

## tous les utlisateurs [/users]

- [/?filter=...] renvoit les données de tous les utilisateurs

## publications [/pubs]

- [/publish] poste une publication [method:post]
- [/allpubs] renvoit toutes les publications [method:get]
- [/allpubs/:id] renvoit les publications d'un utilisateur [method:get]
- [/post/:id] supprime une publication de l'utilisateur [method:delete]
- [/post/:id] renvot une seule publication [method:patch]

## commentaires de publication [/coms]

- [/:id] renvoit tous les commntaires de la publication [method:get]
- [/:target] commente une publication [method:post]
- [/:comId] modifie un commentaire [method:put]
- [/:comId] supprime un commentaire [method:delete]


# RELEASE VERSION

- ajouter un champ configuration dans la base de donnee des utilisateurs
- les images sur le site