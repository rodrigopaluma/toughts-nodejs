const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');

// Helpers
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/dashboard', checkAuth, ToughtsController.dashboard);
router.get('/', ToughtsController.showToughts);

module.exports = router;