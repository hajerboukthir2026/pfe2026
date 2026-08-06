const { body, validationResult } = require("express-validator");
const Resident = require("../models/Resident");

const formatResident = (resident) => {
  const plain = resident.toObject ? resident.toObject() : resident;
  return {
    id: plain._id.toString(),
    nom: plain.nom,
    age: plain.age,
    chambre: plain.chambre,
    notes: plain.notes || "",
    statut: plain.statut,
    mesures: plain.mesures || [],
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
  body("age").isInt({ min: 0, max: 130 }).withMessage("Âge invalide"),
  body("chambre").trim().notEmpty().withMessage("Chambre requise"),
  body("notes").optional().trim(),
];

exports.validateUpdate = [
  body("nom").optional().trim().notEmpty().withMessage("Nom requis"),
  body("age").optional().isInt({ min: 0, max: 130 }).withMessage("Âge invalide"),
  body("chambre").optional().trim().notEmpty().withMessage("Chambre requise"),
  body("notes").optional().trim(),
];

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "famille") {
      const User = require("../models/User");
      const user = await User.findById(req.user.id);
      if (user?.residentId) {
        filter._id = user.residentId;
      } else {
        return res.json([]);
      }
    }

    const residents = await Resident.find(filter).sort({ nom: 1 });
    res.json(residents.map(formatResident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { nom, age, chambre, notes } = req.body;
    const resident = await Resident.create({
      nom,
      age: Number(age),
      chambre,
      notes: notes || "",
      statut: "actif",
      mesures: [],
    });
    res.status(201).json(formatResident(resident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.update = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Résident introuvable" });
    }

    const { nom, age, chambre, notes } = req.body;
    if (nom !== undefined) resident.nom = nom;
    if (age !== undefined) resident.age = Number(age);
    if (chambre !== undefined) resident.chambre = chambre;
    if (notes !== undefined) resident.notes = notes;

    await resident.save();
    res.json(formatResident(resident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.archive = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Résident introuvable" });
    }

    resident.statut = "archivé";
    await resident.save();
    res.json(formatResident(resident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.validateNote = [
  body("note").trim().notEmpty().withMessage("Note requise"),
];

exports.validateMesure = [
  body("date").trim().notEmpty().withMessage("Date requise"),
  body("tension").trim().notEmpty().withMessage("Tension requise"),
  body("poids").trim().notEmpty().withMessage("Poids requis"),
];

exports.addNote = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Résident introuvable" });
    }

    const note = req.body.note.trim();
    resident.notes = resident.notes ? `${resident.notes}\n${note}` : note;
    await resident.save();
    res.json(formatResident(resident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.addMesure = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Résident introuvable" });
    }

    resident.mesures.push({
      date: req.body.date,
      tension: req.body.tension,
      poids: req.body.poids,
    });
    await resident.save();
    res.json(formatResident(resident));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
