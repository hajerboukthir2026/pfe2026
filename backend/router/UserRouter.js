const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const AuthToken = require("../middleware/AuthToken");
const requireRole = require("../middleware/requireRole");

router.use(AuthToken, requireRole("administrateur"));

router.get("/", UserController.list);
router.post("/", UserController.validateCreate, UserController.create);
router.patch("/:id", UserController.validateUpdate, UserController.update);
router.delete("/:id", UserController.remove);

module.exports = router;
