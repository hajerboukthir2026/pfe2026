const express = require("express");
const router = express.Router();
const PlanningController = require("../controller/PlanningController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.use(AuthToken);

router.get(
  "/",
  requireRole("administrateur", "personnelPermanent", "stagiaire"),
  PlanningController.list
);

router.post(
  "/",
  requireRole("administrateur"),
  PlanningController.validateCreate,
  PlanningController.create
);

router.delete(
  "/:id",
  requireRole("administrateur"),
  PlanningController.remove
);

module.exports = router;
