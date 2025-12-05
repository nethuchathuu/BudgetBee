const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateUserName, updateUserPassword, getUserTheme, updateUserTheme } = require('../controllers/userController');
const { verifyUser } = require('../middlewares/verifyUser');

// Get user profile
router.get('/profile/:userId', verifyUser, getUserProfile);

// Update user profile (legacy)
router.put('/profile/:userId', verifyUser, updateUserProfile);

// Update user name only
router.put('/updateName', verifyUser, updateUserName);

// Update user password
router.put('/updatePassword', verifyUser, updateUserPassword);

// Get user theme
router.get('/theme/:userId', verifyUser, getUserTheme);

// Update user theme
router.post('/theme', verifyUser, updateUserTheme);

module.exports = router;
