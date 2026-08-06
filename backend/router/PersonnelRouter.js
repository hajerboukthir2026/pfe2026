const express = require("express");
const router = express.Router();
const PersonnelController = require("../controller/PersonnelController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.use(AuthToken);

router.get(
  "/",
  requireRole("administrateur", "personnelPermanent", "stagiaire"),
  PersonnelController.list
);

router.post(
  "/",
  requireRole("administrateur"),
  PersonnelController.validateCreate,
  PersonnelController.create
);

router.put(
  "/:id",
  requireRole("administrateur"),
  PersonnelController.validateUpdate,
  PersonnelController.update
);

router.patch(
  "/:id/archive",
  requireRole("administrateur"),
  PersonnelController.archive
);

module.exports = router;
