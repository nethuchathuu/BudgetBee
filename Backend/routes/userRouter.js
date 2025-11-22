const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyUser } = require('../middlewares/verifyUser');

// Get user profile
router.get('/profile/:userId', verifyUser, getUserProfile);

// Update user profile
router.put('/profile/:userId', verifyUser, updateUserProfile);

module.exports = router;
