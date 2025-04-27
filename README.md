# Pokedex Starter

## Description du projet

PokeEmpire est une application web moderne développée avec React et Vite, permettant aux utilisateurs de consulter, rechercher, acheter, vendre et gérer des Pokémon. L’application propose également un système de quêtes et de récompenses journalières, ainsi qu’une gestion d’utilisateurs avec authentification sécurisée. Elle s’appuie sur une API REST pour la gestion des données et offre une interface responsive et intuitive.

## Fonctionnalités principales

- **Affichage de la liste des Pokémon** : Parcourez une liste complète de Pokémon avec leurs images, noms et types.
- **Recherche et filtrage** : Recherchez un Pokémon par son nom ou filtrez-les selon différents critères (type, génération, etc.).
- **Fiche détaillée** : Consultez la fiche d’un Pokémon pour voir ses statistiques, ses types, ses évolutions et d’autres informations.
- **Achat de Pokémon** : Achetez de nouveaux Pokémon pour enrichir votre collection en utilisant la monnaie virtuelle (orbes).
- **Vente de Pokémon** : Vendez des Pokémon de votre collection pour récupérer des orbes.
- **Gestion de l’arsenal** : Visualisez et gérez les Pokémon que vous possédez.
- **Système de quêtes** : Accomplissez des quêtes dynamiques pour gagner des récompenses.
- **Récompense journalière** : Réclamez chaque jour une récompense gratuite (orbes).
- **Authentification sécurisée** : Inscription, connexion et gestion sécurisée de l’utilisateur via token JWT. Les tokens sont stockés de façon sécurisée côté client et transmis dans les headers pour chaque requête protégée.
- **Protection des routes** : Accès restreint à certaines pages et fonctionnalités selon l’état de connexion de l’utilisateur (routes privées côté client).
- **Déconnexion** : Suppression sécurisée du token et des informations utilisateur lors de la déconnexion.
- **Interface responsive** : Utilisation optimale sur ordinateur, tablette et mobile.

## Technologies utilisées

- **React** pour l’interface utilisateur.
- **Vite** pour le bundling et le développement rapide.
- **Axios** pour les appels API.
- **ESLint** pour la qualité du code.
- **CSS/SCSS** pour le style.
- **API REST** (backend local ou distant).
- **JWT (JSON Web Token)** pour l’authentification sécurisée.

---

## Instructions d’installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd pokedex-starter
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l’API**
   - Par défaut, l’application attend un backend accessible à l’adresse `http://localhost:3000/api`.
   - Adaptez l’URL dans les fichiers de service si besoin.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L’application sera accessible sur [http://localhost:5173](http://localhost:5173).

5. **Build pour la production**
   ```bash
   npm run build
   ```

6. **Linting du code**
   ```bash
   npm run lint
   ```

---

## Documentation de l’API

### Authentification

- **POST** `/auth/login`  
  Connexion d’un utilisateur.  
  Corps : `{ email, password }`  
  Réponse : `{ user, token }`
  
  > Le token JWT retourné doit être stocké côté client (par exemple dans le localStorage) et transmis dans le header `Authorization: Bearer <token>` pour toutes les requêtes protégées.

- **POST** `/auth/register`  
  Inscription d’un nouvel utilisateur.  
  Corps : `{ username, email, password }`  
  Réponse : `{ user, token }`

- **GET** `/users/me`  
  Récupère les informations de l’utilisateur connecté (token requis dans le header Authorization).

- **POST** `/auth/logout`  
  Déconnexion de l’utilisateur (suppression du token côté client).

---

### Pokémon

- **GET** `/pokemons`  
  Récupère la liste de tous les Pokémon.

- **GET** `/pokemons/:id`  
  Récupère les détails d’un Pokémon par son ID.

- **POST** `/pokemons`  
  Crée un nouveau Pokémon (token requis, admin).  
  Corps : données du Pokémon (JSON ou FormData).

- **PUT** `/pokemons/:id`  
  Met à jour un Pokémon existant (token requis, admin).  
  Corps : données du Pokémon.

- **DELETE** `/pokemons/:id`  
  Supprime un Pokémon (token requis, admin).

---

### Utilisateur

- **GET** `/users/me`  
  Récupère les données de l’utilisateur connecté (Pokémon possédés, orbes, etc.).

- **POST** `/users/me/buy/:pokemonId`  
  Achète un Pokémon (ajoute à l’arsenal de l’utilisateur, token requis).

- **POST** `/users/me/sell/:pokemonId`  
  Vend un Pokémon (retire de l’arsenal de l’utilisateur, token requis).

- **GET** `/users/me/quests`  
  Récupère le statut des quêtes et de la récompense journalière (token requis).

- **POST** `/users/me/daily-reward`  
  Réclame la récompense journalière (10 orbes, token requis).

---

### Quêtes

- **GET** `/quests`  
  Récupère toutes les quêtes dynamiques (token requis).

- **POST** `/quests`  
  Crée une nouvelle quête (token requis, admin).

- **PUT** `/quests/:id`  
  Met à jour une quête (token requis, admin).

- **DELETE** `/quests/:id`  
  Supprime une quête (token requis, admin).

- **PATCH** `/quests/:id/activate`  
  Active une quête (token requis, admin).

- **PATCH** `/quests/:id/deactivate`  
  Désactive une quête (token requis, admin).

- **POST** `/users/me/quests/:questId/claim`  
  Réclame la récompense d’une quête (token requis).

---

## Structure du projet

- `src/` : Code source (composants, pages, services…)
- `public/` : Fichiers statiques
- `README.md` : Documentation
- `package.json` : Dépendances et scripts

---

## Sécurité & bonnes pratiques

- Les tokens JWT sont stockés côté client (localStorage) et transmis dans le header Authorization pour chaque requête protégée.
- Les routes sensibles de l’application sont protégées côté client (redirection si non authentifié).
- Les informations utilisateur sont supprimées du stockage local lors de la déconnexion.
- Ne partagez jamais votre token JWT.

---

## Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou une pull request pour toute suggestion ou correction.

## Licence

Projet sous licence MIT.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
