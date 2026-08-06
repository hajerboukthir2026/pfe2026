const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    auteurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    de: { type: String, required: true, trim: true },
    contenu: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    lu: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
