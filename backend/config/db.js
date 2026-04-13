const { Sequelize } = require("sequelize");

// connexion à MySQL (XAMPP)
const sequelize = new Sequelize("seniorcare", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // optionnel
});

module.exports = sequelize;