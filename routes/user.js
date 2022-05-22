const express = require('express');
const router = express.Router();
const userCrtl = require('../controllers/user')
const checkEmail = require('../middleware/email-validator');
const limiter = require('../middleware/limiter');
const checkPassword = require('../middleware/password-validator');

router.post('/signup',checkPassword, checkEmail, userCrtl.signup);
router.post('/login', limiter, userCrtl.login);

module.exports = router;