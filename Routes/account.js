const express = require('express');
const router = express.Router();
const accountController = require("../Controllers/accountController");
const registerValidator = require('../Middleware/validators/registerValidator')

router.get('/', accountController.getLogin);
router.get('/register', accountController.getRegister);
router.post('/register', registerValidator.add, accountController.register);
router.post('/login', accountController.login);

module.exports = router;