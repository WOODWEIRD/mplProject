const express = require('express');
const router = express.Router();
const accountController = require("../Controllers/accountController");

router.get('/', accountController.getLogin);
router.get('/register', accountController.getRegister);
router.post('/register', accountController.register);
router.post('/login', accountController.login);

module.exports = router;