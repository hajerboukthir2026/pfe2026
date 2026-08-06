const { body, validationResult } = require("express-validator");
const Planning = require("../models/Planning");

const formatPlanning = (planning) => {
  const plain = planning.toObject ? planning.toObject() : planning;
  const base = {
    id: plain._id.toString(),
    type: plain.type,
    service: plain.service || "",
    debut: plain.debut || "",
    fin: plain.fin || "",
  };

  if (plain.type === "personnel") {
    return {
      ...base,
      personnel: plain.personnel || "",
      jour: plain.jour || "",
    };
  }

  return {
    ...base,
    stagiaire: plain.stagiaire || "",
    superviseur: plain.superviseur || "",
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
  body("type").isIn(["personnel", "stage"]).withMessage("Type de planning invalide"),
  body("service").trim().notEmpty().withMessage("Service requis"),
  body("debut").trim().notEmpty().withMessage("Début requis"),
  body("fin").trim().notEmpty().withMessage("Fin requis"),
];

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    } else if (req.user.role === "personnelPermanent") {
      filter.type = "personnel";
    } else if (req.user.role === "stagiaire") {
      filter.type = "stage";
    }

    const plannings = await Planning.find(filter).sort({ createdAt: -1 });
    res.json(plannings.map(formatPlanning));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const { type, service, debut, fin, personnel, jour, stagiaire, superviseur } =
      req.body;

    if (type === "personnel" && (!personnel || !jour)) {
      return res
        .status(422)
        .json({ message: "Personnel et jour requis pour un planning permanent" });
    }
    if (type === "stage" && (!stagiaire || !superviseur)) {
      return res
        .status(422)
        .json({ message: "Stagiaire et superviseur requis pour un planning de stage" });
    }

    const planning = await Planning.create({
      type,
      service,
      debut,
      fin,
      personnel: personnel || "",
      jour: jour || "",
      stagiaire: stagiaire || "",
      superviseur: superviseur || "",
    });

    res.status(201).json(formatPlanning(planning));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const planning = await Planning.findByIdAndDelete(req.params.id);
    if (!planning) {
      return res.status(404).json({ message: "Planning introuvable" });
    }
    res.json({ message: "Planning supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
