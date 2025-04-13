const express = require('express');
const router = express.Router();
const { signup, login } = require('../requestHandlers/authController');

//authentication routes for signup and login. Provides tokens used in authticiation middleware
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;