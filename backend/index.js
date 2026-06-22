const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const appStart = require("./app");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", appStart);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Serveur lancé sur le port ${PORT}`)
    );
  } catch (err) {
    console.error("Impossible de démarrer le serveur:", err.message);
    process.exit(1);
  }
};

startServer();
