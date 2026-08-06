const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { toAppRole, fromAppRole } = require("../utils/appRole");

const PERSONNEL_DB_ROLES = ["PersonnelPermanent", "Stagiaire"];

const formatPersonnel = (user) => {
  const plain = user.toObject ? user.toObject() : user;
  return {
    id: plain._id.toString(),
    nom: `${plain.prenom} ${plain.nom}`.trim(),
    prenom: plain.prenom,
    nomFamille: plain.nom,
    email: plain.email,
    role: toAppRole(plain.role),
    specialite: plain.specialite || "",
    statut: plain.actif ? "actif" : "archivé",
    telephone: plain.telephone || "",
  };
};

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const liste = errors.array();
    res.status(422).json({
      message: liste[0]?.msg || "Données invalides",
      errors: liste,
    });
    return false;
  }
  return true;
};

exports.validateCreate = [
  body("nom").trim().notEmpty().withMessage("Nom requis"),
  body("prenom").trim().notEmpty().withMessage("Prénom requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Mot de passe minimum 6 caractères")
    .matches(/\d/)
    .withMessage("Doit contenir au moins un chiffre"),
  body("role")
    .isIn(["personnelPermanent", "stagiaire"])
    .withMessage("Rôle personnel invalide"),
  body("specialite").optional().trim(),
];

exports.validateUpdate = [
  body("nom").optional().trim().notEmpty().withMessage("Nom requis"),
  body("prenom").optional().trim().notEmpty().withMessage("Prénom requis"),
  body("role")
    .optional()
    .isIn(["personnelPermanent", "stagiaire"])
    .withMessage("Rôle personnel invalide"),
  body("specialite").optional().trim(),
];

exports.list = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: PERSONNEL_DB_ROLES } })
      .select("-motDePasse")
      .sort({ nom: 1 });
    res.json(users.map(formatPersonnel));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { nom, prenom, email, motDePasse, role, specialite } = req.body;
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
      role: fromAppRole(role),
      specialite: specialite || "",
      actif: true,
    });

    res.status(201).json(formatPersonnel(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.update = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const user = await User.findById(req.params.id);
    if (!user || !PERSONNEL_DB_ROLES.includes(user.role)) {
      return res.status(404).json({ message: "Personnel introuvable" });
    }

    const { nom, prenom, role, specialite } = req.body;
    if (nom !== undefined) user.nom = nom;
    if (prenom !== undefined) user.prenom = prenom;
    if (role !== undefined) user.role = fromAppRole(role);
    if (specialite !== undefined) user.specialite = specialite;

    await user.save();
    res.json(formatPersonnel(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.archive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !PERSONNEL_DB_ROLES.includes(user.role)) {
      return res.status(404).json({ message: "Personnel introuvable" });
    }

    user.actif = false;
    await user.save();
    res.json(formatPersonnel(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
