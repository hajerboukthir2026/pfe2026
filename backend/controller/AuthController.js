const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { toAppRole } = require("../utils/appRole");

exports.validateRegister = [
  body("nom").trim().notEmpty().withMessage("Nom requis"),
  body("prenom").trim().notEmpty().withMessage("Prénom requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caractères")
    .matches(/\d/)
    .withMessage("Doit contenir au moins un chiffre"),
  body("role")
    .isIn(["Famille"])
    .withMessage("Seule l'inscription Famille est autorisée"),
  body("telephone")
    .optional()
    .isMobilePhone("ar-TN")
    .withMessage("Numéro de téléphone invalide"),
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("motDePasse").notEmpty().withMessage("Mot de passe requis"),
];

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
};

exports.register = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { nom, prenom, email, motDePasse, role, telephone } = req.body;

    const existant = await User.findOne({ email });
    if (existant) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hash = await bcrypt.hash(motDePasse, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      motDePasse: hash,
      role: "Famille",
      telephone,
      actif: false,
    });

    res.status(201).json({
      message: "Compte créé. En attente d'activation par l'administrateur.",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.login = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (!user.actif) {
      return res.status(403).json({
        message: "Compte inactif. Contactez l'administrateur.",
      });
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const appRole = toAppRole(user.role);
    const token = jwt.sign(
      { id: user._id.toString(), role: appRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: appRole });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-motDePasse");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const plain = user.toObject();
    plain.role = toAppRole(plain.role);
    plain.label = `${plain.prenom} ${plain.nom}`.trim();

    res.json(plain);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
