const express = require("express");
const router = express.Router();
const MessageController = require("../controller/MessageController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.use(AuthToken);

router.get("/", requireRole("administrateur"), MessageController.list);

router.post(
  "/",
  requireRole("famille"),
  MessageController.validateCreate,
  MessageController.create
);

router.patch(
  "/:id/read",
  requireRole("administrateur"),
  MessageController.markRead
);

module.exports = router;
