const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { toAppRole, fromAppRole, APP_ROLES } = require("../utils/appRole");

const formatUser = (user) => {
  const plain = user.toObject ? user.toObject() : user;
  return {
    id: plain._id.toString(),
    nom: plain.nom,
    prenom: plain.prenom,
    label: `${plain.prenom} ${plain.nom}`.trim(),
    email: plain.email,
    role: toAppRole(plain.role),
    statut: plain.actif ? "actif" : "inactif",
    telephone: plain.telephone || "",
    specialite: plain.specialite || "",
    residentId: plain.residentId ? plain.residentId.toString() : null,
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
    .custom((value) => APP_ROLES.has(value))
    .withMessage("Rôle invalide"),
  body("telephone")
    .optional({ values: "falsy" })
    .isMobilePhone("ar-TN")
    .withMessage("Numéro de téléphone invalide"),
  body("specialite").optional().trim(),
  body("actif").optional().isBoolean().withMessage("actif doit être un booléen"),
  body("residentId")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("ID résident invalide"),
];

exports.validateUpdate = [
  body("actif").optional().isBoolean().withMessage("actif doit être un booléen"),
  body("specialite").optional().trim(),
  body("residentId")
    .optional({ values: "null" })
    .custom((value) => value === null || value === "" || /^[a-f\d]{24}$/i.test(value))
    .withMessage("ID résident invalide"),
];

exports.list = async (req, res) => {
  try {
    const users = await User.find().select("-motDePasse").sort({ createdAt: -1 });
    res.json(users.map(formatUser));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { nom, prenom, email, motDePasse, role, telephone, actif, specialite, residentId } =
      req.body;

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
      telephone,
      specialite: specialite || "",
      actif: actif !== undefined ? actif : true,
      residentId: residentId || null,
    });

    res.status(201).json(formatUser(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.update = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const { actif, residentId, specialite } = req.body;

    if (actif !== undefined) user.actif = actif;
    if (specialite !== undefined) user.specialite = specialite;
    if (residentId !== undefined) {
      user.residentId = residentId || null;
    }

    await user.save();
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "Vous ne pouvez pas supprimer votre propre compte",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Compte supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
