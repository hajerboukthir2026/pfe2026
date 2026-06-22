const mongoose = require("mongoose");

const ROLES = [
  "Administrateur",
  "PersonnelPermanent",
  "Stagiaire",
  "Famille",
];

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    motDePasse: { type: String, required: true },
    role: { type: String, required: true, enum: ROLES },
    telephone: { type: String, trim: true },
    actif: { type: Boolean, default: true },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
