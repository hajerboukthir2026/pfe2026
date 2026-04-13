const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const sequelize = require("./config/db");
const appStart = require("./app");

const app = express();
const PORT = process.env.PORT || 5000;
sequelize.sync()
sequelize.authenticate()
  .then(() => console.log("Connexion à la base de données réussie"))
  .catch((err) => console.error("Erreur de connexion à la base de données:", err));
// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/v1", appStart);


  app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
