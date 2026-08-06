const { body, validationResult } = require("express-validator");
const Message = require("../models/Message");
const User = require("../models/User");

const formatMessage = (message) => {
  const plain = message.toObject ? message.toObject() : message;
  return {
    id: plain._id.toString(),
    de: plain.de,
    contenu: plain.contenu,
    date: plain.date,
    lu: plain.lu,
    auteurId: plain.auteurId ? plain.auteurId.toString() : null,
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
  body("contenu").trim().notEmpty().withMessage("Message requis"),
];

exports.list = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages.map(formatMessage));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.create = async (req, res) => {
  if (!checkValidation(req, res)) return;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const message = await Message.create({
      auteurId: user._id,
      de: `${user.prenom} ${user.nom}`.trim(),
      contenu: req.body.contenu,
      date: new Date().toISOString().slice(0, 10),
      lu: false,
    });

    res.status(201).json(formatMessage(message));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message introuvable" });
    }

    message.lu = true;
    await message.save();
    res.json(formatMessage(message));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
