import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  mot_de_passe: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('etudiant', 'conseiller', 'admin'), defaultValue: 'etudiant' },
  telephone: { type: DataTypes.STRING(20) },
  avatar: { type: DataTypes.STRING(255) },
  est_actif: { type: DataTypes.BOOLEAN, defaultValue: true },
  derniere_connexion: { type: DataTypes.DATE },
}, { timestamps: true, createdAt: 'date_creation', updatedAt: 'date_modification' });

export default User;