-- ======================================================
-- BASE DE DONNÉES : mental_health_db
-- ======================================================

CREATE DATABASE IF NOT EXISTS mental_health_db;
USE mental_health_db;

-- ======================================================
-- 1. TABLE UTILISATEURS (avec champ role)
-- ======================================================
CREATE TABLE IF NOT EXISTS users (
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
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ======================================================
-- 2. TABLE PROFIL ÉTUDIANT (spécifique)
-- ======================================================
CREATE TABLE IF NOT EXISTS profils_etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    numero_etudiant VARCHAR(50) UNIQUE,
    promotion VARCHAR(50),
    filiere VARCHAR(100),
    annee_etude INT,
    mode_anonyme BOOLEAN DEFAULT FALSE,
    consentement_notifications BOOLEAN DEFAULT TRUE,
    consentement_partage_donnees BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_numero_etudiant (numero_etudiant)
);

-- ======================================================
-- 3. TABLE PROFIL CONSEILLER (spécifique)
-- ======================================================
CREATE TABLE IF NOT EXISTS profils_conseillers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialite VARCHAR(100),
    diplome VARCHAR(255),
    disponibilites TEXT, -- Stocké en JSON
    max_rendezvous_par_jour INT DEFAULT 5,
    est_disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- ======================================================
-- 4. TABLE QUESTIONNAIRES (types)
-- ======================================================
CREATE TABLE IF NOT EXISTS questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL, -- ex: "PHQ-9", "PSS"
    description TEXT,
    seuil_alerte_min INT DEFAULT 10,
    seuil_alerte_max INT DEFAULT 27,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- 5. TABLE QUESTIONS (des questionnaires)
-- ======================================================
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT NOT NULL,
    ordre INT NOT NULL,
    texte VARCHAR(500) NOT NULL,
    ponderation INT DEFAULT 1,
    options_reponse JSON, -- ex: [0,1,2,3] ou ["Jamais","Parfois","Souvent","Toujours"]
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    INDEX idx_questionnaire (questionnaire_id)
);

-- ======================================================
-- 6. TABLE AUTO-ÉVALUATIONS (résultats)
-- ======================================================
CREATE TABLE IF NOT EXISTS auto_evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questionnaire_id INT NOT NULL,
    score_total INT NOT NULL,
    niveau VARCHAR(20), -- vert, orange, rouge
    date_realisation DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    notes_libres TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id),
    INDEX idx_user (user_id),
    INDEX idx_date (date_realisation),
    INDEX idx_score (score_total)
);

-- ======================================================
-- 7. TABLE RÉPONSES (détail des réponses par évaluation)
-- ======================================================
CREATE TABLE IF NOT EXISTS reponses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id INT NOT NULL,
    question_id INT NOT NULL,
    valeur_reponse INT NOT NULL, -- 0-3 ou 1-5 selon échelle
    FOREIGN KEY (evaluation_id) REFERENCES auto_evaluations(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    INDEX idx_evaluation (evaluation_id),
    INDEX idx_question (question_id)
);

-- ======================================================
-- 8. TABLE JOURNAL QUOTIDIEN (stress/humeur)
-- ======================================================
CREATE TABLE IF NOT EXISTS journal_quotidien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_jour DATE NOT NULL,
    humeur INT NOT NULL CHECK (humeur BETWEEN 1 AND 10),
    niveau_stress INT NOT NULL CHECK (niveau_stress BETWEEN 1 AND 10),
    duree_sommeil DECIMAL(3,1), -- en heures
    qualite_sommeil INT CHECK (qualite_sommeil BETWEEN 1 AND 5),
    activite_physique BOOLEAN DEFAULT FALSE,
    notes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date_jour),
    INDEX idx_user (user_id),
    INDEX idx_date (date_jour),
    INDEX idx_stress (niveau_stress)
);

-- ======================================================
-- 9. TABLE FACTEURS CONTEXTUELS (liés au journal)
-- ======================================================
CREATE TABLE IF NOT EXISTS facteurs_contextuels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE -- "examens", "deadlines", "conflits", etc.
);

CREATE TABLE IF NOT EXISTS journal_facteurs (
    journal_id INT NOT NULL,
    facteur_id INT NOT NULL,
    intensite INT CHECK (intensite BETWEEN 1 AND 3), -- 1=faible, 2=moyen, 3=fort
    PRIMARY KEY (journal_id, facteur_id),
    FOREIGN KEY (journal_id) REFERENCES journal_quotidien(id) ON DELETE CASCADE,
    FOREIGN KEY (facteur_id) REFERENCES facteurs_contextuels(id)
);

-- ======================================================
-- 10. TABLE RENDEZ-VOUS
-- ======================================================
CREATE TABLE IF NOT EXISTS rendez_vous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    conseiller_id INT NOT NULL,
    date_heure DATETIME NOT NULL,
    duree_minutes INT DEFAULT 30,
    motif VARCHAR(255),
    statut ENUM('demande', 'confirme', 'annule', 'termine') DEFAULT 'demande',
    lien_reunion VARCHAR(255), -- lien visio (Zoom/Meet)
    notes_conseiller TEXT,
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiant_id) REFERENCES users(id),
    FOREIGN KEY (conseiller_id) REFERENCES users(id),
    INDEX idx_etudiant (etudiant_id),
    INDEX idx_conseiller (conseiller_id),
    INDEX idx_date (date_heure),
    INDEX idx_statut (statut)
);

-- ======================================================
-- 11. TABLE MESSAGES
-- ======================================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    contenu TEXT NOT NULL,
    est_lu BOOLEAN DEFAULT FALSE,
    lu_a DATETIME,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expediteur_id) REFERENCES users(id),
    FOREIGN KEY (destinataire_id) REFERENCES users(id),
    INDEX idx_expediteur (expediteur_id),
    INDEX idx_destinataire (destinataire_id),
    INDEX idx_date (date_envoi),
    INDEX idx_lu (est_lu)
);

-- ======================================================
-- 12. TABLE ALERTES
-- ======================================================
CREATE TABLE IF NOT EXISTS alertes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- étudiant concerné
    conseiller_id INT, -- conseiller assigné (si traité)
    type_alerte ENUM('stress_eleve', 'crise_phq9', 'absence_journal', 'idees_noires') NOT NULL,
    niveau ENUM('vert', 'orange', 'rouge') DEFAULT 'orange',
    message TEXT,
    est_traitee BOOLEAN DEFAULT FALSE,
    traitee_le DATETIME,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conseiller_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_traitee (est_traitee),
    INDEX idx_type (type_alerte),
    INDEX idx_date (date_creation)
);

-- ======================================================
-- 13. TABLE NOTIFICATIONS
-- ======================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'rappel', 'alerte', 'message', 'rdv'
    est_lue BOOLEAN DEFAULT FALSE,
    lien VARCHAR(255),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_lue (est_lue),
    INDEX idx_date (date_envoi)
);

-- ======================================================
-- 14. TABLE LOGS (audit - RGPD)
-- ======================================================
CREATE TABLE IF NOT EXISTS logs_connexion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100), -- 'login', 'logout', 'evaluation', 'message'
    ip_address VARCHAR(45),
    user_agent TEXT,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_date (date_action),
    INDEX idx_action (action)
);

-- ======================================================
-- 15. TABLE SESSIONS (gestion authentification)
-- ======================================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    date_expiration DATETIME NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expiration (date_expiration)
);

-- ======================================================
-- DONNÉES INITIALES (par défaut)
-- ======================================================

-- Insertion des questionnaires
INSERT INTO questionnaires (nom, description, seuil_alerte_min, seuil_alerte_max) VALUES
('PHQ-9', 'Questionnaire sur la dépression (Patient Health Questionnaire-9)', 10, 27),
('PSS', 'Échelle de stress perçu (Perceived Stress Scale)', 14, 40);

-- Insertion des questions PHQ-9
INSERT INTO questions (questionnaire_id, ordre, texte, options_reponse) VALUES
(1, 1, 'Peu d''intérêt ou de plaisir à faire des choses', '[0,1,2,3]'),
(1, 2, 'Se sentir down, déprimé(e), ou désespéré(e)', '[0,1,2,3]'),
(1, 3, 'Difficultés à s''endormir ou à rester endormi(e), ou dormir trop', '[0,1,2,3]'),
(1, 4, 'Se sentir fatigué(e) ou manquer d''énergie', '[0,1,2,3]'),
(1, 5, 'Manque d''appétit ou manger excessivement', '[0,1,2,3]'),
(1, 6, 'Se sentir mal dans sa peau - ou avoir l''impression d''être un(e) raté(e)', '[0,1,2,3]'),
(1, 7, 'Difficultés à se concentrer (ex: lire le journal, regarder la télé)', '[0,1,2,3]'),
(1, 8, 'Parler ou bouger lentement, ou être agité(e)', '[0,1,2,3]'),
(1, 9, 'Pensées que vous seriez mieux mort(e) ou de vous faire du mal', '[0,1,2,3]');

-- Insertion des questions PSS
INSERT INTO questions (questionnaire_id, ordre, texte, options_reponse) VALUES
(2, 1, 'À quelle fréquence avez-vous été contrarié(e) à cause de quelque chose qui est arrivé de manière inattendue ?', '[0,1,2,3,4]'),
(2, 2, 'À quelle fréquence vous êtes-vous senti(e) incapable de contrôler les choses importantes dans votre vie ?', '[0,1,2,3,4]'),
(2, 3, 'À quelle fréquence vous êtes-vous senti(e) nerveux(se) ou stressé(e) ?', '[0,1,2,3,4]'),
(2, 4, 'À quelle fréquence avez-vous réussi à faire face à vos problèmes ?', '[0,1,2,3,4]'),
(2, 5, 'À quelle fréquence avez-vous senti que les choses allaient dans votre sens ?', '[0,1,2,3,4]'),
(2, 6, 'À quelle fréquence vous êtes-vous senti(e) incapable de faire face à tout ce que vous aviez à faire ?', '[0,1,2,3,4]'),
(2, 7, 'À quelle fréquence avez-vous pu contrôler votre irritation ?', '[0,1,2,3,4]'),
(2, 8, 'À quelle fréquence vous êtes-vous senti(e) au sommet de vos affaires ?', '[0,1,2,3,4]'),
(2, 9, 'À quelle fréquence vous êtes-vous mis(e) en colère à cause de choses incontrôlables ?', '[0,1,2,3,4]'),
(2, 10, 'À quelle fréquence avez-vous senti que les difficultés s''accumulaient au point de ne pas pouvoir les surmonter ?', '[0,1,2,3,4]');

-- Insertion des facteurs contextuels
INSERT INTO facteurs_contextuels (nom) VALUES
('Examens'),
('Deadlines / rendus'),
('Conflits personnels'),
('Isolement'),
('Problèmes familiaux'),
('Problèmes financiers'),
('Santé personnelle'),
('Charge de travail'),
('Manque de sommeil'),
('Pression sociale');

-- Insertion d'un compte admin par défaut (mot de passe = admin123 - à changer)
-- Le mot de passe sera hashé en bcrypt dans l'application, ici c'est un exemple
-- INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES ('Admin', 'System', 'admin@mentalhealth.com', 'admin123', 'admin');

-- ======================================================
-- FIN DU SCRIPT
-- ======================================================