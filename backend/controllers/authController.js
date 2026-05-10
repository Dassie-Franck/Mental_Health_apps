import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize } from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe)
      return res.status(400).json({ message: 'Tous les champs sont requis' });

    const [rows] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [email] }
    );
    if (rows.length > 0)
      return res.status(400).json({ message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(mot_de_passe, 10);
    await sequelize.query(
      'INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES (?,?,?,?,?)',
      { replacements: [nom, prenom, email, hash, 'etudiant'] }
    );

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const [rows] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      { replacements: [email] }
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const user = rows[0];
    const ok = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!ok)
      return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({
      message: 'Connexion réussie',
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
};

export const getMe = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT id, nom, prenom, email, role FROM users WHERE id = ?',
      { replacements: [req.user.id] }
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};