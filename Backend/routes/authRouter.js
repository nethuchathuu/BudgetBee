const express = require('express');
const { signupHandler, signinHandler, sendVerificationCode, changePassword } = require('../controllers/auth_controller/authController');
const { verifyUser } = require('../middlewares/verifyUser');

const authRouter = express.Router();
// Route for user signup
authRouter.post('/signup', signupHandler);
//Route for signin
authRouter.post('/signin', signinHandler);
// Send verification code
authRouter.post('/send-code', verifyUser, sendVerificationCode);
// Change password
authRouter.put('/change-password', verifyUser, changePassword);

module.exports = authRouter;