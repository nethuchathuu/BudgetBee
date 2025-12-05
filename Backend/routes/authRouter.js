const express = require('express');
const { signupHandler, signinHandler, sendVerificationCode, changePassword, sendResetCode, resetPassword } = require('../controllers/auth_controller/authController');
const { verifyUser } = require('../middlewares/verifyUser');

const authRouter = express.Router();
// Route for user signup
authRouter.post('/signup', signupHandler);
//Route for signin
authRouter.post('/signin', signinHandler);
// Send verification code (for password change - requires auth)
authRouter.post('/send-code', verifyUser, sendVerificationCode);
// Change password (requires auth)
authRouter.put('/change-password', verifyUser, changePassword);
// Send password reset code (for forgot password - no auth required)
authRouter.post('/send-reset-code', sendResetCode);
// Reset password (no auth required)
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;