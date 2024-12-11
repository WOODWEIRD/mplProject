const express = require('express');
const router = express.Router();
const adminController = require("../Controllers/adminController");

router.get('/allUsers', adminController.getAllUsers);
router.get('/deleteUser/:userId', adminController.deleteUser);

module.exports = router;