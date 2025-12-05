const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { pool } = require('../../config/db');
const { sendVerificationEmail } = require('../../utils/emailService');

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET ;


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

    await pool.execute(
      `INSERT INTO users (fullname, email, password)
       VALUES (?, ?, ?)`,
      [fullname, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
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
      'SELECT id, fullname, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

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
      JWT_SECRET,
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

module.exports = {
  signupHandler: signup,
  signinHandler: signin,
  sendVerificationCode,
  changePassword
};