const mongoose = require("mongoose");

const mesureSchema = new mongoose.Schema(
  {
    date: { type: String, trim: true },
    tension: { type: String, trim: true },
    poids: { type: String, trim: true },
  },
  { _id: false }
);

const residentSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    chambre: { type: String, required: true, trim: true },
    notes: { type: String, default: "", trim: true },
    statut: {
      type: String,
      enum: ["actif", "archivé"],
      default: "actif",
    },
    mesures: { type: [mesureSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resident", residentSchema);
