 
import { sequelize } from '../config/db.js';

// Récupérer les questions d'un questionnaire
export const getQuestions = async (req, res) => {
  try {
    const { questionnaireId } = req.params;
    const [questions] = await sequelize.query(
      'SELECT * FROM questions WHERE questionnaire_id = ? ORDER BY ordre',
      { replacements: [questionnaireId] }
    );
    const [questionnaire] = await sequelize.query(
      'SELECT * FROM questionnaires WHERE id = ?',
      { replacements: [questionnaireId] }
    );
    res.json({ questionnaire: questionnaire[0], questions });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Sauvegarder une évaluation
export const saveAssessment = async (req, res) => {
  try {
    const { questionnaire_id, reponses, notes_libres } = req.body;
    const userId = req.user.id;

    // Calculer le score total
    const score_total = reponses.reduce((sum, r) => sum + r.valeur, 0);

    // Déterminer le niveau selon PHQ-9
    let niveau;
    if (score_total <= 4) niveau = 'vert';
    else if (score_total <= 9) niveau = 'orange';
    else niveau = 'rouge';

    // Insérer l'évaluation
    const [result] = await sequelize.query(
      `INSERT INTO auto_evaluations 
       (user_id, questionnaire_id, score_total, niveau, notes_libres) 
       VALUES (?, ?, ?, ?, ?)`,
      { replacements: [userId, questionnaire_id, score_total, niveau, notes_libres || null] }
    );

    const evaluationId = result;

    // Insérer les réponses
    for (const r of reponses) {
      await sequelize.query(
        'INSERT INTO reponses (evaluation_id, question_id, valeur_reponse) VALUES (?, ?, ?)',
        { replacements: [evaluationId, r.question_id, r.valeur] }
      );
    }

    // Créer une alerte si score élevé
    if (score_total >= 10) {
      await sequelize.query(
        `INSERT INTO alertes (user_id, type_alerte, niveau, message) 
         VALUES (?, 'crise_phq9', ?, ?)`,
        { replacements: [userId, niveau, `Score PHQ-9 élevé : ${score_total}/27`] }
      );
    }

    res.status(201).json({
      message: 'Évaluation sauvegardée',
      score: score_total,
      niveau,
      evaluation_id: evaluationId
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Historique des évaluations
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const [evaluations] = await sequelize.query(
      `SELECT ae.*, q.nom as questionnaire_nom 
       FROM auto_evaluations ae
       JOIN questionnaires q ON ae.questionnaire_id = q.id
       WHERE ae.user_id = ?
       ORDER BY ae.date_realisation DESC
       LIMIT 10`,
      { replacements: [userId] }
    );
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};