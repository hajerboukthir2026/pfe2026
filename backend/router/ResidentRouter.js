const express = require("express");
const router = express.Router();
const ResidentController = require("../controller/ResidentController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

const allRoles = [
  "administrateur",
  "personnelPermanent",
  "stagiaire",
  "famille",
];

router.get(
  "/",
  AuthToken,
  requireRole(...allRoles),
  ResidentController.list
);

router.post(
  "/",
  AuthToken,
  requireRole("administrateur"),
  ResidentController.validateCreate,
  ResidentController.create
);

router.put(
  "/:id",
  AuthToken,
  requireRole("administrateur"),
  ResidentController.validateUpdate,
  ResidentController.update
);

router.patch(
  "/:id/archive",
  AuthToken,
  requireRole("administrateur"),
  ResidentController.archive
);

router.patch(
  "/:id/notes",
  AuthToken,
  requireRole("administrateur", "personnelPermanent", "stagiaire"),
  ResidentController.validateNote,
  ResidentController.addNote
);

router.post(
  "/:id/mesures",
  AuthToken,
  requireRole("administrateur", "personnelPermanent", "stagiaire"),
  ResidentController.validateMesure,
  ResidentController.addMesure
);

module.exports = router;
