# 🔧 Configuration Requise pour EBank

## ⚠️ IMPORTANT - À FAIRE AVANT DE LANCER

### 1️⃣ Configurer MySQL

Vous devez connaître votre mot de passe MySQL root. Pour le trouver ou le réinitialiser :

#### Option A : Si vous connaissez le mot de passe
Testez la connexion :
```bash
mysql -u root -p
```

#### Option B : Si vous ne connaissez pas le mot de passe
Vous devrez peut-être le réinitialiser selon votre installation MySQL.

### 2️⃣ Modifier application.properties

Ouvrez le fichier :
```
ebank-backend\src\main\resources\application.properties
```

Modifiez la ligne 7 avec VOTRE mot de passe MySQL :
```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE_ICI
```

### 3️⃣ Créer la base de données (Optionnel)

La base sera créée automatiquement, mais vous pouvez la créer manuellement :

```sql
mysql -u root -p
CREATE DATABASE ebank_db;
EXIT;
```

## 🚀 Lancer l'Application

### Backend (Terminal 1)
```bash
cd "c:\Users\Hp\Desktop\projet controle\ebank-backend"
mvn spring-boot:run
```

Attendez de voir : **"Started EbankApplication"**

### Frontend (Terminal 2)
```bash
cd "c:\Users\Hp\Desktop\projet controle\ebank-frontend"
npm install
npm start
```

L'application s'ouvrira sur http://localhost:3000

## 🔑 Connexion

**Compte Agent par défaut :**
- Login: `agent`
- Mot de passe: `agent123`

## ❌ Si le mot de passe MySQL est vide

Changez la ligne 7 de application.properties en :
```properties
spring.datasource.password=
```

## ❌ Erreurs Courantes

### "Access denied for user 'root'"
➡️ Mot de passe MySQL incorrect dans application.properties

### "Port 8080 already in use"
➡️ Un autre processus utilise le port. Tuez-le ou changez le port dans application.properties

### "Communications link failure"
➡️ MySQL n'est pas démarré. Démarrez le service MySQL

## 📞 Ports utilisés
- Backend : http://localhost:8080
- Frontend : http://localhost:3000
