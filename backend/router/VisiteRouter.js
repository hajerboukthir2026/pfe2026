const express = require("express");
const router = express.Router();
const VisiteController = require("../controller/VisiteController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.use(AuthToken);

router.get(
  "/",
  requireRole("administrateur", "famille"),
  VisiteController.list
);

router.post(
  "/",
  requireRole("administrateur", "famille"),
  VisiteController.validateCreate,
  VisiteController.create
);

router.patch(
  "/:id/statut",
  requireRole("administrateur"),
  VisiteController.validateStatut,
  VisiteController.updateStatut
);

module.exports = router;
