const express=  require('express'); 
const router = express.Router();
const AuthController = require('../controller/AuthController');
const AuthToken = require('../middleware/AuthToken');
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', AuthToken,AuthController.profile);

module.exports = router;

    