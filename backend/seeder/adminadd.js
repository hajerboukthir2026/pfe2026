require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const existAdmin = await User.findOne({ email: "admin@admin.com" });

    if (existAdmin) {
      console.log("Admin déjà existant");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      nom: "admin",
      prenom: "admin",
      email: "admin@admin.com",
      motDePasse: hashedPassword,
      role: "Administrateur",
      telephone: "55740526",
      actif: true,
    });

    console.log("Admin créé avec succès (admin@admin.com / 123456)");
    process.exit(0);
  } catch (error) {
    console.error("Erreur:", error.message);
    process.exit(1);
  }
};

createAdmin();
