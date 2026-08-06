const express = require('express');
const AuthRouter = require('./router/AuthRouter');
const UserRouter = require('./router/UserRouter');
const ResidentRouter = require('./router/ResidentRouter');
const PersonnelRouter = require('./router/PersonnelRouter');
const VisiteRouter = require('./router/VisiteRouter');
const MessageRouter = require('./router/MessageRouter');
const PlanningRouter = require('./router/PlanningRouter');
const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/residents", ResidentRouter);
router.use("/personnel", PersonnelRouter);
router.use("/visites", VisiteRouter);
router.use("/messages", MessageRouter);
router.use("/plannings", PlanningRouter);

module.exports = router;