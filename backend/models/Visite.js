const mongoose = require("mongoose");

const visiteSchema = new mongoose.Schema(
  {
    familleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    familleNom: { type: String, required: true, trim: true },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      default: null,
    },
    residentNom: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    heure: { type: String, required: true, trim: true },
    statut: {
      type: String,
      enum: ["en attente", "acceptée", "refusée"],
      default: "en attente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visite", visiteSchema);
