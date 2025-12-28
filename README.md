# EBank - Application de Gestion Bancaire

## 🏦 Description

Application web complète de gestion bancaire développée avec **Spring Boot 3** (Backend) et **React JS** (Frontend).

## 👥 Profils Utilisateurs

### AGENT_GUICHET
- Ajouter un nouveau client
- Créer un compte bancaire

### CLIENT
- Consulter le tableau de bord
- Effectuer des virements
- Changer le mot de passe

## 🛠️ Technologies Utilisées

### Backend
- **Spring Boot 3.2.0**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **MySQL 8**
- **Lombok**
- **JJWT** pour la gestion des tokens

### Frontend
- **React JS 18**
- **React Router 6**
- **Axios**

## 📋 Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- Node.js 16+ et npm
- MySQL 8
- Git

## 🚀 Installation et Démarrage

### 1. Configuration de la Base de Données

Créez une base de données MySQL :

```sql
CREATE DATABASE ebank_db;
```

### 2. Configuration du Backend

1. Naviguez vers le dossier backend :
```bash
cd ebank-backend
```

2. Configurez les informations de connexion dans `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ebank_db
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe

# Configuration Email (optionnel)
spring.mail.username=votre-email@gmail.com
spring.mail.password=votre-mot-de-passe-app
```

3. Compilez et démarrez le backend :
```bash
mvn clean install
mvn spring-boot:run
```

Le serveur démarrera sur `http://localhost:8080`

### 3. Configuration du Frontend

1. Naviguez vers le dossier frontend :
```bash
cd ebank-frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez l'application React :
```bash
npm start
```

L'application démarrera sur `http://localhost:3000`

## 🔐 Compte Agent par Défaut

Un compte agent est créé automatiquement au démarrage :

- **Login**: `agent`
- **Mot de passe**: `agent123`

## 📱 Fonctionnalités

### Use Case 1 : Authentification
- Login avec JWT (validité 1h)
- Mot de passe crypté avec BCrypt
- Messages d'erreur appropriés

### Use Case 2 : Ajouter un Client (Agent)
- Formulaire avec validation
- Génération automatique de login/mot de passe
- Envoi d'email avec les identifiants

### Use Case 3 : Créer un Compte Bancaire (Agent)
- Validation du RIB
- Vérification de l'identité client
- Création avec statut "Ouvert"

### Use Case 4 : Tableau de Bord (Client)
- Affichage du RIB et solde
- 10 dernières opérations
- Sélection de compte (si plusieurs)

### Use Case 5 : Virement (Client)
- Vérifications de sécurité
- Débit/Crédit instantané
- Traçabilité des opérations

### Use Case 6 : Changer Mot de Passe (Client)
- Validation de l'ancien mot de passe
- Cryptage du nouveau mot de passe

## 🔒 Sécurité

- Toutes les routes sont protégées par JWT
- Contrôle d'accès basé sur les rôles
- Validation des données côté backend
- Protection CSRF désactivée (API REST)
- CORS configuré pour le développement

## 📂 Structure du Projet

### Backend
```
ebank-backend/
├── src/main/java/com/ebank/
│   ├── config/          # Configuration Spring
│   ├── controller/      # Contrôleurs REST
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # Entités JPA
│   ├── repository/     # Repositories
│   ├── security/       # Configuration JWT
│   ├── service/        # Logique métier
│   └── exception/      # Gestion des exceptions
└── src/main/resources/
    └── application.properties
```

### Frontend
```
ebank-frontend/
├── public/
└── src/
    ├── api/            # Services Axios
    ├── components/     # Composants React
    ├── App.js
    └── index.js
```

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion

### Agent (AGENT_GUICHET)
- `POST /api/agent/clients` - Ajouter un client
- `POST /api/agent/comptes` - Créer un compte

### Client (CLIENT)
- `GET /api/client/dashboard?rib={rib}` - Tableau de bord
- `POST /api/client/virement` - Effectuer un virement
- `PUT /api/client/change-password` - Changer mot de passe

## 🎨 Personnalisation

Pour personnaliser le nom de la banque, modifiez :

1. **Frontend** : 
   - `src/components/Login.js` ligne 60
   - `src/components/Header.js` ligne 11

2. Remplacez "Votre Prénom & Votre Prénom Bank" par le nom souhaité

## 📝 Notes Importantes

- Token JWT valide pendant 1 heure
- Les emails nécessitent une configuration SMTP valide
- Le RIB doit contenir entre 16 et 24 chiffres
- Les mots de passe sont cryptés avec BCrypt

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans application.properties
- Assurez-vous que le port 8080 est libre

### Frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 8080
- Vérifiez la configuration CORS
- Inspectez la console du navigateur pour les erreurs

## 👨‍💻 Développement

Ce projet utilise :
- **IOC / Injection de dépendances** (Spring)
- **DTO Pattern** pour toutes les communications
- **Repository Pattern** pour l'accès aux données
- **JWT** pour l'authentification stateless

## 📄 Licence

Ce projet est développé dans un cadre éducatif.

---

Développé avec ❤️ pour le cours de Spring Boot & React
