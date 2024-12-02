const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

router.post('/', themeController.validateTheme);

module.exports = router;
