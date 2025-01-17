# The Good Corner (TGC) 🎯🚀✨

## **Description**

**The Good Corner (TGC)** est une application complète (frontend, backend et base de données) entièrement conteneurisée avec Docker. Elle propose un site d'annonces en ligne où les utilisateurs peuvent publier, consulter et gérer des annonces selon leur rôle :

- **Admin** : Accès complet à toutes les fonctionnalités, y compris la gestion des utilisateurs (modification des rôles).
- **User** : Gestion de ses propres annonces et tags. Accès en lecture seule aux catégories et aux annonces des autres utilisateurs.
- **Invité** : Accès en lecture seule uniquement. 🎉

### **Fonctionnalités principales**

- **Système d'authentification sécurisé** : Connexion, inscription et déconnexion basées sur des tokens.
- **Rôles utilisateurs** :
  - L'admin peut modifier les rôles des utilisateurs.
  - Les utilisateurs peuvent uniquement modifier ou supprimer leurs propres annonces.
- **Base de données relationnelle** (PostgreSQL) pour gérer les annonces, utilisateurs et catégories.
- **Conteneurisation complète** avec Docker.
- Gestion des **CORS** en développement via un proxy configuré avec Vite. 🌐✨

### **Perspectives d'évolution**

- Ajout de fonctionnalités de panier pour permettre aux utilisateurs de réserver et payer des annonces en ligne.
- Gestion avancée des CORS en production. 🛒🔒
---

## **Technologies utilisées** 🎨💻

- **Frontend** :

  - React, ViteJS
  - Apollo Client, GraphQL
  - Styled Components, Material-UI
  - TypeScript, React Router DOM

- **Backend** :

  - Apollo Server, GraphQL
  - TypeORM, PostgreSQL
  - Argon2 (hachage de mots de passe), JSON Web Tokens
  - Class Validator, GraphQL Scalars

- **Base de données** :

  - PostgreSQL (conteneurisée dans Docker)

- **Conteneurisation** :

  - Docker Compose 🐳

---

## **Installation** 🔧📦

### **Prérequis**

- Docker et Docker Compose installés sur votre machine.
- Node.js (version ≥ 16) pour des développements locaux.

### **Étapes**

1. **Cloner le dépôt :**

   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_DEPOT>
   ```

2. **Lancer les conteneurs :**
   Docker Compose est configuré pour automatiser le lancement des services (frontend, backend, et base de données). Exécutez :

   ```bash
   docker-compose up --build
   ```

3. **Accéder à l'application :**

   - **Frontend** : [http://localhost:5173](http://localhost:5173)
   - **Backend** : [http://localhost:5000](http://localhost:5000)

4. **Vérifier les logs (en cas de problème) :**

   ```bash
   docker-compose logs
   ``` 🐾

---

## **Configuration** ⚙️🗂️

Le projet utilise deux fichiers `.env` pour la configuration des variables d'environnement, placés dans les répertoires **backend** et **db**.

### **Exemple de fichier ****`.env`**** pour la base de données :**

`database.env`

```
POSTGRES_PASSWORD=postgres
POSTGRES_USER=thegoodcorner
POSTGRES_DB=thegoodcorner
```

### **Exemple de fichier ****`.env`**** pour le backend :**

`backend.env`

```
JWT_SECRET=your_secret_key
JWT_EXPIRATION=3600
CORS_ORIGIN=http://localhost:5173
```

---

## **Structure du projet** 🏗️📁

### **Backend**

```
backend/
├── src/
│   ├── entities/          # Définition des entités TypeORM
│   ├── resolvers/         # Résolveurs GraphQL
│   ├── utils/             # Fonctions utilitaires
│   ├── auth.ts            # Middleware d'authentification
│   ├── datasource.ts      # Connexion à la base de données
│   └── index.ts           # Point d'entrée principal
```

### **Frontend**

```
frontend/
├── public/                # Fichiers statiques
├── src/
│   ├── api/               # Appels API (Apollo Client)
│   ├── assets/            # Images et autres ressources
│   ├── components/        # Composants réutilisables
│   ├── pages/             # Pages principales (ex. Connexion, Inscription)
│   └── App.tsx            # Point d'entrée principal du frontend
```

---

## **Commandes utiles** 💻📜

### **Frontend**

- **Démarrage local :**

  ```bash
  npm run dev
  ```

- **Build pour production :**

  ```bash
  npm run build
  ```

### **Backend**

- **Démarrage local :**
  ```bash
  npm run start
  ```

---

## **Déploiement** 🚀🌍

### **Étapes pour la production**

1. Construire les conteneurs Docker :
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```
2. Configurer les variables d'environnement spécifiques à la production dans les fichiers `.env`. 🛠️

---

## **Tests** 🧪✅

Pour le moment, les tests ne sont pas encore implémentés. Prévus dans les évolutions. 📅

