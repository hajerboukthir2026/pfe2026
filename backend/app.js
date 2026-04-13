const express = require('express');
const AuthRouter = require('./router/AuthRouter');
const router = express.Router();





// Routes (tu les ajoutes ici après)
router.use("/auth",AuthRouter);
// app.use('/api/residents', require('./routes/residents'));

module.exports = router;