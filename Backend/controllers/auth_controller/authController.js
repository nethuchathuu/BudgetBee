const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { pool } = require('../../config/db');
const { sendVerificationEmail, sendSignupVerificationLink } = require('../../utils/emailService');

// Signup function 
const signup = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword} = req.body;
    

    // Input validation
    if (!fullname) return res.status(400).json({ error: "Full name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (confirmPassword !== password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check duplicate email in users table
    const [existingUsers] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with verified = false (0)
    const [result] = await pool.execute(
      `INSERT INTO users (fullname, email, password, verified)
       VALUES (?, ?, ?, ?)`,
      [fullname, email, hashedPassword, 0]
    );

    const userId = result.insertId;

    // Generate verification token
    const verifyToken = jwt.sign(
      { id: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Construct verification URL
    // Assuming frontend runs on port 5173 by default for Vite, or use env
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email?token=${verifyToken}`;

    // Send verification email
    await sendSignupVerificationLink(email, verifyUrl);

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 1. Find user by email
    const [users] = await pool.execute(
      'SELECT id, fullname, email, password, verified FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({ error: 'Please verify your email before signing in.' });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error during signin' });
  }
};

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

// Send verification code
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with expiration (5 minutes)
    verificationCodes.set(email, {
      code,
      expires: Date.now() + 5 * 60 * 1000
    });

    // Send email with verification code
    try {
      await sendVerificationEmail(email, code);
      console.log(`✅ Verification code sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message);
      
      // For development: Still allow testing even if email fails
      console.log(`\n⚠️  EMAIL NOT CONFIGURED - Testing Mode`);
      console.log(`📧 Verification code for ${email}: ${code}`);
      console.log(`⏰ Expires in 5 minutes\n`);
      
      // Comment out this return to allow testing without email
      // return res.status(500).json({ 
      //   success: false, 
      //   message: 'Failed to send verification email. Please check your email configuration.' 
      // });
    }
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
};

// Change password with verification
const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword, verificationCode } = req.body;

    // Validation
    if (!email || !oldPassword || !newPassword || !confirmNewPassword || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.'
      });
    }

    // Verify code
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is incorrect.'
      });
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    if (storedData.code !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is incorrect.'
      });
    }

    // Get user and verify old password
    const [users] = await pool.execute('SELECT id, password FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Your old password is incorrect.'
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Clear verification code
    verificationCodes.delete(email);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, try again.'
    });
  }
};

// Send password reset code
const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email exists in database
    const [users] = await pool.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with expiration (10 minutes for password reset)
    verificationCodes.set(email, {
      code,
      expires: Date.now() + 10 * 60 * 1000,
      type: 'reset'
    });

    // Send email with verification code
    try {
      await sendVerificationEmail(email, code);
      console.log(`✅ Password reset code sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message);
      
      // For development: Still allow testing even if email fails
      console.log(`\n⚠️  EMAIL NOT CONFIGURED - Testing Mode`);
      console.log(`📧 Password reset code for ${email}: ${code}`);
      console.log(`⏰ Expires in 10 minutes\n`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Error sending reset code:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
};

// Reset password with verification code
const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // Validation
    if (!email || !verificationCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Verify code
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is incorrect or has expired'
      });
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    if (storedData.code !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is incorrect'
      });
    }

    // Check if email exists
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Clear verification code
    verificationCodes.delete(email);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.'
    });
  }
};

// Verify Email function
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Update user verified status
    await pool.execute(
      'UPDATE users SET verified = 1 WHERE id = ?',
      [decoded.id]
    );

    // Return success JSON instead of redirect
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).json({ error: 'Invalid or expired verification token' });
  }
};

// Google Auth function
const googleAuth = async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    // Check if user exists
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length > 0) {
      // User exists, log them in
      const user = users[0];
      
      // Ensure user is verified (Google accounts are trusted)
      if (!user.verified) {
        await pool.execute('UPDATE users SET verified = 1 WHERE id = ?', [user.id]);
      }

      const token = jwt.sign(
        { id: user.id, fullname: user.fullname, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } else {
      // User does not exist, create new user
      // Generate a random password
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Insert with verified = 1
      const [result] = await pool.execute(
        'INSERT INTO users (fullname, email, password, verified) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 1]
      );

      const newUser = {
        id: result.insertId,
        fullname: name,
        email: email
      };

      const token = jwt.sign(
        { id: newUser.id, fullname: newUser.fullname, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: newUser
      });
    }
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
};

module.exports = {
  signupHandler: signup,
  signinHandler: signin,
  sendVerificationCode,
  changePassword,
  sendResetCode,
  resetPassword,
  googleAuth,
  verifyEmail
};