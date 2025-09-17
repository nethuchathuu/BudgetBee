const express = require('express');
const { signupHandler, signinHandler } = require('../controllers/auth_controller/authController');

const authRouter = express.Router();
// Route for user signup
authRouter.post('/signup', signupHandler);
//Route for signin
authRouter.post('/signin', signinHandler);

module.exports = authRouter;