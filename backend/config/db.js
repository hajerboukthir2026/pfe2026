const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/seniorcare";

  await mongoose.connect(uri);
  console.log("Connexion MongoDB réussie");
};

module.exports = connectDB;
