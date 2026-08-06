const { body, validationResult } = require("express-validator");
const Visite = require("../models/Visite");
const Resident = require("../models/Resident");
const User = require("../models/User");

const formatVisite = (visite) => {
  const plain = visite.toObject ? visite.toObject() : visite;
  return {
    id: plain._id.toString(),
    famille: plain.familleNom,
    resident: plain.residentNom,
    familleId: plain.familleId ? plain.familleId.toString() : null,
    residentId: plain.residentId ? plain.residentId.toString() : null,
    date: plain.date,
    heure: plain.heure,
    statut: plain.statut,
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
  body("date").trim().notEmpty().withMessage("Date requise"),
  body("heure").trim().notEmpty().withMessage("Heure requise"),
  body("residentId").optional({ values: "falsy" }).isMongoId().withMessage("ID résident invalide"),
  body("resident").optional().trim(),
  body("famille").optional().trim(),
];

exports.validateStatut = [
  body("statut")
    .isIn(["en attente", "acceptée", "refusée"])
    .withMessage("Statut invalide"),
];

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "famille") {
      filter.familleId = req.user.id;
    }

    const visites = await Visite.find(filter).sort({ date: -1, heure: -1 });
    res.json(visites.map(formatVisite));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { date, heure, residentId, resident, famille } = req.body;
    let familleId = null;
    let familleNom = famille || "";
    let residentNom = resident || "";
    let resolvedResidentId = residentId || null;

    if (req.user.role === "famille") {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
      familleId = user._id;
      familleNom = `${user.prenom} ${user.nom}`.trim();

      if (user.residentId) {
        const linked = await Resident.findById(user.residentId);
        if (linked) {
          resolvedResidentId = linked._id;
          residentNom = linked.nom;
        }
      }
    } else {
      familleNom = famille || "Administration";
    }

    if (resolvedResidentId && !residentNom) {
      const r = await Resident.findById(resolvedResidentId);
      if (!r) {
        return res.status(404).json({ message: "Résident introuvable" });
      }
      residentNom = r.nom;
    }

    if (!residentNom) {
      return res.status(422).json({ message: "Résident requis" });
    }

    const visite = await Visite.create({
      familleId,
      familleNom,
      residentId: resolvedResidentId,
      residentNom,
      date,
      heure,
      statut: "en attente",
    });

    res.status(201).json(formatVisite(visite));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.updateStatut = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const visite = await Visite.findById(req.params.id);
    if (!visite) {
      return res.status(404).json({ message: "Visite introuvable" });
    }

    visite.statut = req.body.statut;
    await visite.save();
    res.json(formatVisite(visite));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
