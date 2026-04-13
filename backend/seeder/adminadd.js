require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDB(); // 🔥 مهم جدا

    const existAdmin = await User.findOne({ email: "admin@admin.com" });

    if (existAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      nom: "admin",
      prenom: "admin",
      email: "admin@admin.com",
      motDePasse: hashedPassword,
      role: "Administrateur",
      telephone: "55740526",
    });

    console.log("✅ Admin created successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();