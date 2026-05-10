# 🧠 MindCare — Application de Suivi de Santé Mentale

Plateforme web de suivi de la santé mentale et du stress des étudiants.

---

## 📋 Prérequis

Installe ces logiciels avant tout :

| Logiciel | Version | Lien |
|---|---|---|
| Node.js | v18+ (LTS) | https://nodejs.org |
| XAMPP | Dernière version | https://www.apachefriends.org |
| VS Code | Dernière version | https://code.visualstudio.com |
| Git | Dernière version | https://git-scm.com |

---

## 📁 Structure du projet

```
mental_health_apps/
├── backend/          # Serveur Node.js + Express + MySQL
└── frontend/         # Interface React + Vite + Tailwind
```

---

## 🚀 Installation

### Étape 1 — Cloner le projet

```bash
git clone <url_du_repo>
cd mental_health_apps
```

### Étape 2 — Démarrer XAMPP

1. Ouvre **XAMPP Control Panel**
2. Démarre **Apache** et **MySQL**
3. Va sur http://localhost/phpmyadmin
4. Importe le fichier `mental_health_db.sql` (dans le dossier racine)

### Étape 3 — Installer le Backend

```bash
cd backend
npm install
```

Crée le fichier `.env` dans le dossier `backend/` :

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mental_health_db
DB_PORT=3306
JWT_SECRET=mindcare_secret_2024_junior
PORT=5000
```

### Étape 4 — Installer le Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Lancer le projet

Ouvre **2 terminaux** dans VS Code :

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
```
✅ Tu dois voir : `🚀 Serveur sur http://localhost:5000`

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
```
✅ Ouvre : http://localhost:5173

---

## 📦 Dépendances Backend

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mysql2": "^3.22.3",
    "sequelize": "^6.37.8"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Installe tout avec :
```bash
cd backend
npm install express cors cookie-parser dotenv bcryptjs jsonwebtoken sequelize mysql2
npm install -D nodemon
```

---

## 📦 Dépendances Frontend

```json
{
  "dependencies": {
    "axios": "^1.16.0",
    "chart.js": "^4.5.1",
    "react": "^19.2.6",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^19.2.6",
    "react-icons": "^5.0.0",
    "react-router-dom": "^7.15.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.5.0",
    "postcss": "^8.5.14",
    "tailwindcss": "^3.4.19",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

Installe tout avec :
```bash
cd frontend
npm install
npm install axios react-router-dom chart.js react-chartjs-2 react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
################################################################################
npm init -y
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

---

## 🛠️ Stack Technique

| Côté | Technologie |
|---|---|
| Frontend | React.js + Vite |
| Styles | Tailwind CSS |
| Icônes | Font Awesome 6 |
| Police | Poppins (Google Fonts) |
| Graphiques | Chart.js + react-chartjs-2 |
| Backend | Node.js + Express.js |
| Base de données | MySQL (XAMPP) |
| ORM | Sequelize |
| Authentification | JWT + Cookies HTTP |
| HTTP Client | Axios |

---

## 📌 Fonctionnalités implémentées

- [x] Inscription / Connexion / Déconnexion
- [x] Authentification JWT sécurisée
- [x] Tableau de bord étudiant
- [x] Sidebar de navigation
- [ ] Auto-évaluation PHQ-9 (en cours)
- [ ] Suivi humeur + graphiques (en cours)
- [ ] Liste conseillers (en cours)
- [ ] Prise de rendez-vous (en cours)

---

## ⚠️ Notes importantes

- Le backend tourne sur le **port 5000**
- Le frontend tourne sur le **port 5173**
- XAMPP doit être **démarré** avant de lancer le backend
- Le fichier `.env` n'est **pas versionné** — chaque développeur doit le créer manuellement

---

## 👥 Équipe

- **Junior** — Développeur principal
- **Collègue** — Développeur

---
############################################################### FONCTIONALITER A RESPECTER ##################################################

Fonctionnalités complètes de ton application

👤 MODULE 1 — Authentification

Inscription (nom, prénom, email, mot de passe)
Connexion sécurisée (JWT)
Déconnexion
Protection des pages (routes privées)


📊 MODULE 2 — Tableau de bord

Vue générale de l'état de santé mentale
Score de stress du jour
Dernière humeur enregistrée
Prochain rendez-vous
Graphique d'évolution sur 7 jours


📝 MODULE 3 — Auto-évaluation psychologique (PHQ-9)

Questionnaire de 9 questions officielles
Calcul automatique du score
Interprétation du résultat :

0-4 → Minimal
5-9 → Léger
10-14 → Modéré
15+ → Sévère


Historique des évaluations passées
Alerte si score élevé


😊 MODULE 4 — Suivi de l'humeur

Enregistrement humeur quotidienne
Niveau de stress (1 à 10)
Note personnelle
Graphique d'évolution (7 jours / 30 jours)
Historique complet


👨‍⚕️ MODULE 5 — Conseillers

Liste des conseillers disponibles
Fiche conseiller (nom, spécialité, photo)
Statut disponible / non disponible


📅 MODULE 6 — Rendez-vous

Prendre un rendez-vous avec un conseiller
Choisir date et heure
Ajouter un motif
Voir ses rendez-vous à venir
Annuler un rendez-vous
Statut : en attente / confirmé / annulé


👤 MODULE 7 — Profil étudiant

Voir ses informations personnelles
Modifier son profil
Voir son historique complet


🎨 Caractéristiques générales

Interface en français
Design moderne avec Tailwind CSS
Application responsive (mobile + desktop)
Couleurs apaisantes (bleu, vert, violet)
## 📄 Licence

Projet scolaire — 2024
