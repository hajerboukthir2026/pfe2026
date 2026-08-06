const mongoose = require("mongoose");

const planningSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["personnel", "stage"],
      required: true,
    },
    // Planning personnel permanent
    personnel: { type: String, trim: true, default: "" },
    jour: { type: String, trim: true, default: "" },
    debut: { type: String, trim: true, default: "" },
    fin: { type: String, trim: true, default: "" },
    service: { type: String, trim: true, default: "" },
    // Planning stage
    stagiaire: { type: String, trim: true, default: "" },
    superviseur: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planning", planningSchema);
