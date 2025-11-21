const express = require('express');
const router = express.Router();
const limitsController = require('../controllers/limitsController');

// Get user limits (auth optional for development)
router.get('/:user_id', limitsController.getLimits);

// Save/Update user limits
router.post('/', limitsController.saveLimits);

// Check limits and create notifications if exceeded
router.post('/check', limitsController.checkLimits);

module.exports = router;
