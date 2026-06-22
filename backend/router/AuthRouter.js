const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.post(
  "/register",
  AuthController.validateRegister,
  AuthController.register
);
router.post("/login", AuthController.validateLogin, AuthController.login);
router.get("/profile", AuthToken, AuthController.profile);

/** Route de test : réservée à l'administrateur (Phase 1.3) */
router.get(
  "/admin-check",
  AuthToken,
  requireRole("administrateur"),
  (req, res) => {
    res.json({ message: "Accès administrateur confirmé", userId: req.user.id });
  }
);

module.exports = router;
