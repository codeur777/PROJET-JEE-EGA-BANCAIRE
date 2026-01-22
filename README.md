[3 tools called]

# EGA BANK - Système Bancaire Complet

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-9.1-blue.svg)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)

Un système bancaire complet développé avec Spring Boot (backend) et Angular (frontend), offrant une gestion intégrale des clients, comptes bancaires, transactions et authentification sécurisée.

## 📋 Table des Matières

- [🗂️ Architecture](#-architecture)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#-technologies)
- [⚡ Prérequis](#-prérequis)
- [🚀 Installation](#-installation)
- [📊 Configuration](#-configuration)
- [🎯 Utilisation](#-utilisation)
- [🔗 API Endpoints](#-api-endpoints)
- [🧪 Tests](#-tests)
- [📦 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)
- [👥 Auteurs](#-auteurs)

## 🗂️ Architecture

```
EGA-BANK/
├── BACKEND/                 # API REST Spring Boot
│   ├── src/
│   │   ├── main/java/com/example/EGA/
│   │   │   ├── config/      # Configuration sécurité, JWT
│   │   │   ├── controller/  # Contrôleurs REST
│   │   │   ├── entity/      # Entités JPA
│   │   │   ├── repository/  # Repositories JPA
│   │   │   ├── service/     # Logique métier
│   │   │   └── dto/         # Objets de transfert
│   │   └── resources/       # Configuration, scripts SQL
│   └── pom.xml
├── FRONTEND/                # Application Angular
│   ├── ega/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/     # Services, guards, interceptors
│   │   │   │   ├── modules/  # Modules Angular
│   │   │   │   └── shared/   # Composants partagés
│   │   └── package.json
└── README.md
```

## ✨ Fonctionnalités

### 👥 Gestion des Clients
- ✅ Inscription et authentification des clients
- ✅ Gestion des profils (informations personnelles, documents)
- ✅ Historique des opérations

### 💰 Gestion des Comptes
- ✅ Création de comptes courants et épargne
- ✅ Consultation des soldes et mouvements
- ✅ Gestion des statuts de compte

### 💸 Transactions Bancaires
- ✅ Dépôts et retraits
- ✅ Virements entre comptes
- ✅ Historique des transactions avec filtres de date

### 🛡️ Administration
- ✅ Gestion des agents bancaires
- ✅ Dashboard avec statistiques complètes
- ✅ Supervision des clients et comptes

### 📄 Documents et Relevés
- ✅ Génération de relevés PDF
- ✅ Téléchargement sécurisé des documents
- ✅ Upload de justificatifs client

### 🔐 Sécurité
- ✅ Authentification JWT multi-rôles (ADMIN, AGENT, CLIENT)
- ✅ Autorisation basée sur les rôles
- ✅ Protection CSRF et CORS

## 🛠️ Technologies

### Backend
- **Framework** : Spring Boot 4.0.1
- **Langage** : Java 21
- **Base de données** : MySQL 9.1
- **ORM** : Hibernate/JPA
- **Sécurité** : Spring Security + JWT
- **Documentation** : Swagger/OpenAPI
- **Génération PDF** : iText 8
- **Build** : Maven

### Frontend
- **Framework** : Angular 21
- **Langage** : TypeScript
- **UI Framework** : Bootstrap 5
- **Charts** : Chart.js
- **HTTP Client** : RxJS
- **Build** : Angular CLI

### DevOps
- **Version Control** : Git
- **Code Quality** : ESLint, Prettier
- **Testing** : JUnit, Vitest

## ⚡ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Java** : JDK 21 ou supérieur
- **Node.js** : Version 18+ avec npm
- **MySQL** : Version 8.0 ou supérieure
- **Maven** : Version 3.6+
- **Git** : Pour le clonage du repository

## 🚀 Installation

### 1. Clonage du Repository

```bash
git clone https://github.com/codeur777/PROJET-JEE-EGA-BANCAIRE.git
cd ega-bank
```

### 2. Configuration de la Base de Données

```sql
-- Créer la base de données
CREATE DATABASE ega_bank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer l'utilisateur
CREATE USER 'ega_user'@'localhost' IDENTIFIED BY 'ega1234';
GRANT ALL PRIVILEGES ON ega_bank.* TO 'ega_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration Backend

```bash
cd BACKEND/EGA

# Compiler le projet
.\mvn clean compile

# Démarrer le serveur
.\mvn.cmd spring-boot:run
```

Le backend sera accessible sur `http://localhost:8082`

### 4. Configuration Frontend

```bash
cd FRONTEND/ega

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## 📊 Configuration

### Variables d'Environnement

#### Backend (`application.yml`)
```yaml
server:
  port: 8082

spring:
  datasource:
    url: jdbc:mysql://localhost:3307/ega_bank?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ega_user
    password: ega1234

jwt:
  secret: "EgaBankSecretKeyForSecurityAndJwtTokenValidation2026"
  expiration: 86400000
```

#### Frontend (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8082/api'
};
```

### Données de Test

Le système inclut des données de test automatiquement insérées :

- **Administrateur** : `admin@egabank.tg` / `admin123`
- **Clients** : `john.doe@gmail.com`, `anna.smith@gmail.com` / `client123`
- **Comptes** : Comptes courants et épargne pré-configurés

## 🎯 Utilisation

### 1. Accès à l'Application

1. Ouvrir `http://localhost:4200` dans votre navigateur
2. Se connecter avec les identifiants admin ou créer un compte client

### 2. Interface Administrateur

- **Dashboard** : Statistiques générales, graphiques
- **Gestion Clients** : Liste et détails des clients
- **Gestion Agents** : Création et suppression d'agents
- **Gestion Comptes** : Supervision des comptes bancaires

### 3. Interface Client

- **Profil** : Gestion des informations personnelles
- **Comptes** : Consultation des soldes et mouvements
- **Transactions** : Historique et opérations
- **Relevés** : Téléchargement de relevés PDF

## 🔗 API Endpoints

### Authentification
```
POST /api/auth/login           # Connexion utilisateur
POST /api/auth/register        # Inscription utilisateur
POST /api/client-auth/create   # Créer compte client
POST /api/client-auth/login    # Connexion client
```

### Gestion Clients
```
GET  /api/clients              # Lister tous les clients
GET  /api/clients/{id}         # Détails client
PUT  /api/clients/{id}         # Modifier client
POST /api/clients/add          # Ajouter client
DELETE /api/clients/{id}       # Supprimer client
```

### Gestion Comptes
```
GET  /api/comptes              # Lister tous les comptes
GET  /api/comptes/{id}         # Détails compte
POST /api/comptes              # Créer compte
POST /api/comptes/{id}/deposit/{amount}   # Dépôt
POST /api/comptes/{id}/withdraw/{amount}  # Retrait
```

### Transactions
```
GET  /api/transactions                          # Toutes les transactions
GET  /api/transactions/historique/{compteId}    # Historique compte
POST /api/transactions/depot                    # Dépôt
POST /api/transactions/retrait                  # Retrait
POST /api/transactions/virement                 # Virement
```

### Administration
```
GET  /api/admin/agents          # Lister agents
POST /api/admin/agents          # Créer agent
DELETE /api/admin/agents/{id}   # Supprimer agent
```

### Documents
```
GET /api/releves/pdf/{compteId}  # Télécharger relevé PDF
```

## 🧪 Tests

### Tests Backend
```bash
cd BACKEND/EGA
mvn test
```

### Tests Frontend
```bash
cd FRONTEND/ega
npm test
```

### Tests d'API avec Postman
Importez la collection Postman depuis `docs/postman_collection.json`

## 📦 Déploiement

### Production Backend
```bash
cd BACKEND/EGA
mvn clean package -DskipTests
java -jar target/EGA-0.0.1-SNAPSHOT.jar
```

### Production Frontend
```bash
cd FRONTEND/ega
npm run build --prod
# Les fichiers buildés sont dans dist/ega/
```

### Docker (Optionnel)
```bash
# Build et run avec Docker Compose
docker-compose up -d
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Code
- **Backend** : Suivre les conventions Spring Boot
- **Frontend** : Respecter le style Angular et les règles ESLint
- **Commits** : Messages clairs et descriptifs
- **Tests** : Couverture minimale de 80%

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Équipe EGA BANK** - *Développement initial*
- **Contributeurs** - Voir [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 📞 Support

Pour obtenir de l'aide :
- 📧 Email : nawfalibrahim68@gmail.com
## 🔄 Versions

Voir les [tags sur ce repository](https://github.com/codeur777/PROJET-JEE-EGA-BANCAIRE/tags) pour les différentes versions disponibles.

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !** ⭐

*Développé avec ❤️ pour la communauté bancaire.*