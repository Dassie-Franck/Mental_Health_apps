# 📋 CAHIER DE CHARGE — MindCare
## Application de Suivi de Santé Mentale et du Stress des Étudiants

---

> ⚠️ **DOCUMENT SPÉCIAL POUR IA COLLABORATRICE**
> Ce document contient TOUT l'état actuel du projet, la logique de codage,
> les conventions utilisées, et les modules déjà implémentés.
> Une IA qui reçoit ce document peut continuer le projet immédiatement
> sans recommencer depuis zéro.

---

## 1. 🎯 PRÉSENTATION DU PROJET

### Thème
Application web de suivi de la santé mentale et du stress des étudiants avec :
- Outils d'auto-évaluation psychologique
- Suivi des indicateurs de stress
- Mise en relation rapide avec des conseillers

### Nom de l'application
**MindCare**

### Type de projet
Projet de soutenance scolaire — Application web fullstack

### Contraintes importantes
- Le développeur connaît **React** et **PHP** (niveau intermédiaire)
- On utilise **MySQL via XAMPP** (pas MongoDB)
- Stack choisie : **React + Vite (frontend)** / **Node.js + Express (backend)**
- Tout l'interface est en **français**
- Design avec **Tailwind CSS + Font Awesome + Google Fonts (Poppins)**
- Pas de complexité excessive — code simple et lisible

---

## 2. 🛠️ STACK TECHNIQUE COMPLÈTE

| Couche | Technologie | Version |
|---|---|---|
| Frontend | React.js + Vite | React 19, Vite 6 |
| Styles | Tailwind CSS | 3.4.19 |
| Icônes | Font Awesome | 6.5.0 (CDN) |
| Police | Poppins | Google Fonts (CDN) |
| Graphiques | Chart.js + react-chartjs-2 | 4.5.1 |
| Routing | React Router DOM | 7.15.0 |
| HTTP Client | Axios | 1.16.0 |
| Backend | Node.js + Express | Express 5.2.1 |
| Base de données | MySQL via XAMPP | - |
| ORM | Sequelize | 6.37.8 |
| Authentification | JWT + Cookies HTTP | jsonwebtoken 9.0.3 |
| Password | bcryptjs | 3.0.3 |
| Dev server | Nodemon | 3.0.1 |

---

## 3. 📁 STRUCTURE DU PROJET

```
mental_health_apps/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Connexion MySQL via Sequelize
│   ├── controllers/
│   │   ├── authController.js        # ✅ FAIT
│   │   ├── moodController.js        # ❌ À FAIRE
│   │   ├── assessmentController.js  # ✅ À FAIRE
│   │   ├── counselorController.js   # ❌ À FAIRE
│   │   └── appointmentController.js # ❌ À FAIRE
│   ├── middleware/
│   │   └── authMiddleware.js        # ✅ FAIT
│   ├── models/
│   │   ├── User.js                  # ✅ FAIT (non utilisé — on utilise SQL brut)
│   │   ├── Mood.js                  # ❌ À FAIRE
│   │   ├── Assessment.js            # ❌ À FAIRE
│   │   ├── Counselor.js             # ❌ À FAIRE
│   │   └── Appointment.js           # ❌ À FAIRE
│   ├── routes/
│   │   ├── authRoutes.js            # ✅ FAIT
│   │   ├── moodRoutes.js            # ❌ À FAIRE
│   │   ├── assessmentRoutes.js      # ✅ À FAIRE
│   │   ├── counselorRoutes.js       # ❌ À FAIRE
│   │   └── appointmentRoutes.js     # ❌ À FAIRE
│   ├── .env                         # ✅ FAIT
│   ├── package.json                 # ✅ FAIT
│   └── server.js                    # ✅ FAIT
│
└── frontend/
    ├── public/
    │   └── index.html               # ✅ FAIT (avec CDN FA + Poppins)
    ├── src/
    │   ├── assets/                  # Images statiques
    │   ├── components/
    │   │   ├── Sidebar.jsx          # ✅ FAIT
    │   │   └── Layout.jsx           # ✅ FAIT
    │   ├── context/
    │   │   └── AuthContext.jsx      # ✅ FAIT
    │   ├── pages/
    │   │   ├── Login.jsx            # ✅ FAIT
    │   │   ├── Register.jsx         # ✅ FAIT
    │   │   ├── Dashboard.jsx        # ✅ FAIT (stats statiques pour l'instant)
    │   │   ├── Assessment.jsx       #  ✅ À FAIRE
    │   │   ├── MoodTracker.jsx      # ❌ À FAIRE
    │   │   ├── Counselors.jsx       # ❌ À FAIRE
    │   │   ├── Appointment.jsx      # ❌ À FAIRE
    │   │   └── Profile.jsx          # ❌ À FAIRE
    │   ├── services/
    │   │   └── api.js               # ✅ FAIT
    │   ├── App.jsx                  # ✅ FAIT
    │   ├── main.jsx                 # ✅ FAIT
    │   └── index.css                # ✅ FAIT
    ├── index.html                   # ✅ FAIT
    ├── tailwind.config.js           # ✅ FAIT
    ├── vite.config.js               # ✅ FAIT (défaut Vite)
    └── package.json                 # ✅ FAIT
```

---

## 4. 🗄️ BASE DE DONNÉES COMPLÈTE

### Nom de la base : `mental_health_db`
### Gestionnaire : MySQL via XAMPP phpMyAdmin

---

### TABLE 1 : `users`
Table principale de tous les utilisateurs (étudiants, conseillers, admins)
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('etudiant', 'conseiller', 'admin') DEFAULT 'etudiant',
    telephone VARCHAR(20),
    avatar VARCHAR(255),
    est_actif BOOLEAN DEFAULT TRUE,
    derniere_connexion DATETIME,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### TABLE 2 : `profils_etudiants`
Informations spécifiques aux étudiants
```sql
CREATE TABLE profils_etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    numero_etudiant VARCHAR(50) UNIQUE,
    promotion VARCHAR(50),
    filiere VARCHAR(100),
    annee_etude INT,
    mode_anonyme BOOLEAN DEFAULT FALSE,
    consentement_notifications BOOLEAN DEFAULT TRUE,
    consentement_partage_donnees BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### TABLE 3 : `profils_conseillers`
Informations spécifiques aux conseillers
```sql
CREATE TABLE profils_conseillers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialite VARCHAR(100),
    diplome VARCHAR(255),
    disponibilites TEXT,
    max_rendezvous_par_jour INT DEFAULT 5,
    est_disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### TABLE 4 : `questionnaires`
Types de questionnaires (PHQ-9, PSS, etc.)
```sql
CREATE TABLE questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    seuil_alerte_min INT DEFAULT 10,
    seuil_alerte_max INT DEFAULT 27,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Données insérées : PHQ-9 (id=1), PSS (id=2)
```

### TABLE 5 : `questions`
Questions des questionnaires
```sql
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT NOT NULL,
    ordre INT NOT NULL,
    texte VARCHAR(500) NOT NULL,
    ponderation INT DEFAULT 1,
    options_reponse JSON,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
);
-- 9 questions PHQ-9 + 10 questions PSS déjà insérées
```

### TABLE 6 : `auto_evaluations`
Résultats des évaluations psychologiques
```sql
CREATE TABLE auto_evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questionnaire_id INT NOT NULL,
    score_total INT NOT NULL,
    niveau VARCHAR(20),  -- 'vert', 'orange', 'rouge'
    date_realisation DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes_libres TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);
```

### TABLE 7 : `reponses`
Détail des réponses par évaluation
```sql
CREATE TABLE reponses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id INT NOT NULL,
    question_id INT NOT NULL,
    valeur_reponse INT NOT NULL,
    FOREIGN KEY (evaluation_id) REFERENCES auto_evaluations(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

### TABLE 8 : `journal_quotidien`
Suivi quotidien humeur + stress + sommeil
```sql
CREATE TABLE journal_quotidien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_jour DATE NOT NULL,
    humeur INT NOT NULL CHECK (humeur BETWEEN 1 AND 10),
    niveau_stress INT NOT NULL CHECK (niveau_stress BETWEEN 1 AND 10),
    duree_sommeil DECIMAL(3,1),
    qualite_sommeil INT CHECK (qualite_sommeil BETWEEN 1 AND 5),
    activite_physique BOOLEAN DEFAULT FALSE,
    notes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date_jour)
);
```

### TABLE 9 : `facteurs_contextuels`
Facteurs de stress (examens, deadlines, etc.)
```sql
CREATE TABLE facteurs_contextuels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);
-- Données : Examens, Deadlines, Conflits, Isolement, Problèmes familiaux,
--           Problèmes financiers, Santé, Charge de travail, Sommeil, Pression sociale
```

### TABLE 10 : `journal_facteurs`
Liaison journal ↔ facteurs de stress
```sql
CREATE TABLE journal_facteurs (
    journal_id INT NOT NULL,
    facteur_id INT NOT NULL,
    intensite INT CHECK (intensite BETWEEN 1 AND 3),
    PRIMARY KEY (journal_id, facteur_id),
    FOREIGN KEY (journal_id) REFERENCES journal_quotidien(id) ON DELETE CASCADE,
    FOREIGN KEY (facteur_id) REFERENCES facteurs_contextuels(id)
);
```

### TABLE 11 : `rendez_vous`
Prise de rendez-vous étudiant ↔ conseiller
```sql
CREATE TABLE rendez_vous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    conseiller_id INT NOT NULL,
    date_heure DATETIME NOT NULL,
    duree_minutes INT DEFAULT 30,
    motif VARCHAR(255),
    statut ENUM('demande', 'confirme', 'annule', 'termine') DEFAULT 'demande',
    lien_reunion VARCHAR(255),
    notes_conseiller TEXT,
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiant_id) REFERENCES users(id),
    FOREIGN KEY (conseiller_id) REFERENCES users(id)
);
```

### TABLE 12 : `messages`
Messagerie interne étudiant ↔ conseiller
```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    contenu TEXT NOT NULL,
    est_lu BOOLEAN DEFAULT FALSE,
    lu_a DATETIME,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expediteur_id) REFERENCES users(id),
    FOREIGN KEY (destinataire_id) REFERENCES users(id)
);
```

### TABLE 13 : `alertes`
Alertes automatiques si stress/score élevé
```sql
CREATE TABLE alertes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    conseiller_id INT,
    type_alerte ENUM('stress_eleve', 'crise_phq9', 'absence_journal', 'idees_noires') NOT NULL,
    niveau ENUM('vert', 'orange', 'rouge') DEFAULT 'orange',
    message TEXT,
    est_traitee BOOLEAN DEFAULT FALSE,
    traitee_le DATETIME,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conseiller_id) REFERENCES users(id)
);
```

### TABLE 14 : `notifications`
Notifications push in-app
```sql
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    est_lue BOOLEAN DEFAULT FALSE,
    lien VARCHAR(255),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### TABLE 15 : `sessions`
Gestion des tokens JWT
```sql
CREATE TABLE sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255),
    ip_address VARCHAR(45),
    date_expiration DATETIME NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 5. 🔧 FICHIERS CLÉS DÉJÀ CODÉS

### `backend/.env`
```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mental_health_db
DB_PORT=3306
JWT_SECRET=mindcare_secret_2024_junior
PORT=5000
```

### `backend/config/db.js`
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté');
  } catch (err) {
    console.error('❌ Erreur MySQL:', err.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
```

### `backend/server.js`
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Serveur sur http://localhost:${process.env.PORT || 5000}`);
  });
});
```

### `backend/middleware/authMiddleware.js`
```javascript
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Non autorisé' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};
```

### `frontend/src/services/api.js`
```javascript
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});
export default api;
```

### `frontend/tailwind.config.js`
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
      colors: {
        primary: '#6c63ff',
        'primary-dark': '#5a52d5',
      }
    }
  },
  plugins: []
}
```

---

## 6. 🧠 LOGIQUE DE CODAGE — CONVENTIONS IA

> Cette section explique EXACTEMENT comment coder pour rester cohérent avec le projet.

### 6.1 Convention Backend

#### Structure d'un controller
```javascript
// Toujours utiliser sequelize.query() avec SQL brut
// NE PAS utiliser les modèles Sequelize (on a choisi SQL brut)
export const maFonction = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT ... FROM table WHERE id = ?',
      { replacements: [valeur] }
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
```

#### Structure d'une route
```javascript
import express from 'express';
import { fonction1, fonction2 } from '../controllers/monController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/route', protect, fonction1);      // Route protégée
router.post('/route', protect, fonction2);     // Route protégée
router.get('/publique', fonction1);            // Route publique

export default router;
```

#### Ajouter une route dans server.js
```javascript
// Toujours ajouter les nouvelles routes dans server.js
import monNouvelleRoute from './routes/maNouvelleRoute.js';
app.use('/api/nouvelle', monNouvelleRoute);
```

### 6.2 Convention Frontend

#### Structure d'une page
```jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function MaPage() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/ma-route')
      setData(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Contenu de la page */}
    </Layout>
  )
}
```

#### Composants réutilisables
```jsx
// Toujours wrapper les pages avec <Layout>
// Layout contient la Sidebar automatiquement
// Pas de padding/margin sur le wrapper — Layout s'en occupe
```

#### Classes Tailwind standards du projet
```
// Cards : bg-white rounded-2xl shadow-sm p-6
// Bouton principal : bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl
// Input : w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary bg-gray-50
// Titre page : text-2xl font-bold text-gray-800
// Sous-titre : text-gray-500 text-sm
// Icône dans box colorée : w-12 h-12 bg-{color}-50 rounded-xl flex items-center justify-center
// Alerte erreur : bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg
// Alerte succès : bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg
```

### 6.3 Palette de couleurs
```
Primary : #6c63ff (violet/indigo)
Primary Dark : #5a52d5
Succès : green-500
Danger : red-500
Warning : yellow-500
Info : blue-500
Fond global : gray-50
Cards : white
Texte principal : gray-800
Texte secondaire : gray-500
```

### 6.4 Ordre d'implémentation d'un module
Pour chaque nouveau module, toujours suivre cet ordre :
1. **Backend Controller** — écrire les fonctions CRUD
2. **Backend Routes** — créer le fichier de routes
3. **server.js** — enregistrer la nouvelle route
4. **Frontend Page** — créer la page React
5. **App.jsx** — ajouter la route React Router
6. **Sidebar** — vérifier que le lien existe déjà

---

## 7. 📊 MODULES ET STATUTS

### ✅ MODULE 1 — Authentification (TERMINÉ)
- Inscription (POST /api/auth/register)
- Connexion (POST /api/auth/login)
- Déconnexion (POST /api/auth/logout)
- Profil connecté (GET /api/auth/me)
- JWT stocké en cookie HTTP-only
- Middleware protect pour routes privées
- Pages : Login.jsx, Register.jsx
- Design : Split screen (gauche violet, droite formulaire)

### ✅ MODULE 2 — Dashboard (TERMINÉ — stats statiques)
- Sidebar avec navigation complète
- Cards de statistiques (humeur, stress, évaluations, RDV)
- Actions rapides
- Conseil du jour
- ⚠️ Les stats sont statiques pour l'instant — à connecter après les autres modules

### ❌ MODULE 3 — Auto-évaluation PHQ-9 (À FAIRE)
- GET /api/assessments/questions/:questionnaireId — récupérer questions
- POST /api/assessments — sauvegarder une évaluation
- GET /api/assessments/history/:userId — historique
- Calcul score : 0-4=Minimal, 5-9=Léger, 10-14=Modéré, 15+=Sévère
- Alerte automatique si score >= 10

### ❌ MODULE 4 — Suivi Humeur (À FAIRE)
- POST /api/moods — enregistrer humeur du jour
- GET /api/moods/:userId — historique des humeurs
- Graphique Chart.js (Line chart sur 7/30 jours)
- Tableau journal_quotidien

### ❌ MODULE 5 — Conseillers (À FAIRE)
- GET /api/counselors — liste des conseillers
- Les conseillers sont des users avec role='conseiller'
- Jointure users + profils_conseillers

### ❌ MODULE 6 — Rendez-vous (À FAIRE)
- POST /api/appointments — créer un RDV
- GET /api/appointments/student/:userId — RDV de l'étudiant
- PUT /api/appointments/:id — modifier statut
- Table rendez_vous

### ❌ MODULE 7 — Profil (À FAIRE)
- GET/PUT profil étudiant
- Table profils_etudiants

---

## 8. 🔗 RELATIONS BASE DE DONNÉES

```
users (1) ──────── (N) journal_quotidien
users (1) ──────── (N) auto_evaluations
users (1) ──────── (N) rendez_vous (comme etudiant)
users (1) ──────── (N) rendez_vous (comme conseiller)
users (1) ──────── (1) profils_etudiants
users (1) ──────── (1) profils_conseillers
users (1) ──────── (N) messages (expediteur)
users (1) ──────── (N) messages (destinataire)
users (1) ──────── (N) alertes
users (1) ──────── (N) notifications
questionnaires (1) ── (N) questions
questionnaires (1) ── (N) auto_evaluations
auto_evaluations (1) ─ (N) reponses
journal_quotidien (N) ─ (N) facteurs_contextuels (via journal_facteurs)
```

---

## 9. ⚙️ CONFIGURATION PORTS

| Service | Port | URL |
|---|---|---|
| Backend Express | 5000 | http://localhost:5000 |
| Frontend Vite | 5173 | http://localhost:5173 |
| MySQL XAMPP | 3306 | localhost/phpmyadmin |

---

## 10. 🚀 COMMANDES DE LANCEMENT

```bash
# Backend
cd mental_health_apps/backend
npm run dev

# Frontend
cd mental_health_apps/frontend
npm run dev
```

---

## 11. 📌 POINTS D'ATTENTION POUR L'IA COLLABORATRICE

1. **Ne jamais utiliser les modèles Sequelize** — on utilise `sequelize.query()` avec SQL brut
2. **Toujours utiliser `{ replacements: [...] }`** pour éviter les injections SQL
3. **Toujours wrapper les pages dans `<Layout>`** pour avoir la sidebar
4. **Le frontend est sur Vite** — pas Create React App — les imports sont sensibles à la casse
5. **L'authentification utilise des cookies** — toujours `withCredentials: true` dans axios
6. **Tout le texte est en français** — pas d'anglais dans l'interface
7. **La couleur principale est `#6c63ff`** — définie comme `primary` dans Tailwind
8. **La police est Poppins** — chargée via CDN dans index.html
9. **Font Awesome est en CDN** — pas installé via npm
10. **Le prochain module à coder est le MODULE 3 (PHQ-9)**

---

## 12. 📝 HISTORIQUE DES DÉCISIONS TECHNIQUES

| Décision | Raison |
|---|---|
| Vite au lieu de Create React App | CRA avait des erreurs d'installation |
| MySQL au lieu de MongoDB | Développeur utilise XAMPP |
| SQL brut au lieu de modèles Sequelize | Plus simple, évite les conflits |
| JWT en cookies HTTP-only | Plus sécurisé que localStorage |
| Tailwind CSS | Design rapide et professionnel |
| Font Awesome en CDN | Évite les problèmes d'installation npm |
| Split-screen pour auth | Design moderne et professionnel |

---

*Document généré automatiquement — Version 1.0 — Projet MindCare*
