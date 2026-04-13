const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Règles de validation ───────────────────────────────────
exports.validateRegister = [
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse')
    .isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères')
    .matches(/\d/).withMessage('Doit contenir au moins un chiffre'),
  body('role')
    .isIn(['admin', 'personnel', 'famille']).withMessage('Rôle invalide'),
  body('telephone')
    .optional()
    .isMobilePhone('ar-TN').withMessage('Numéro de téléphone invalide'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
];

// ─── Helper erreurs ─────────────────────────────────────────
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// ─── Register ──────────────────────────────────────────────
exports.register = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { nom, prenom, email, motDePasse, role, telephone } = req.body;

    const existant = await User.findOne({where: { email }});
    if (existant) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(motDePasse, 10);

    const user = await User.create({ nom, prenom, email, motDePasse: hash, role, telephone });

    res.status(201).json({ message: 'Compte créé avec succès', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ─── Login ─────────────────────────────────────────────────
exports.login = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
     
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ─── Profile ───────────────────────────────────────────────
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    console.log(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};