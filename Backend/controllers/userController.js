const { pool } = require('../config/db');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [users] = await pool.execute(
            'SELECT id, fullname, email, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        res.status(200).json({
            success: true,
            data: {
                fullname: user.fullname,
                email: user.email,
                profile_picture: null,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        });
    }
};

// Get user theme preference
const getUserTheme = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [users] = await pool.execute(
            'SELECT theme FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            theme: users[0].theme || 'light'
        });
    } catch (error) {
        console.error('Error fetching user theme:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user theme'
        });
    }
};

// Update user theme preference
const updateUserTheme = async (req, res) => {
    try {
        const { userId, theme } = req.body;

        // Verify user exists
        const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update theme
        await pool.execute(
            'UPDATE users SET theme = ? WHERE id = ?',
            [theme, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Theme updated successfully'
        });
    } catch (error) {
        console.error('Error updating user theme:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user theme'
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullName } = req.body;

        // Verify user exists
        const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user profile
        await pool.execute(
            'UPDATE users SET fullname = ? WHERE id = ?',
            [fullName, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user profile'
        });
    }
};

// Update user name only
const updateUserName = async (req, res) => {
    try {
        const { userId, fullName } = req.body;

        if (!userId || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'User ID and full name are required'
            });
        }

        // Verify user exists
        const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user name
        await pool.execute(
            'UPDATE users SET fullname = ? WHERE id = ?',
            [fullName, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Name updated successfully'
        });
    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user name'
        });
    }
};

// Update user password
const updateUserPassword = async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        if (!email || !verificationCode || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Here you would verify the verification code
        // For now, we'll skip verification code check and just update password
        
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserName,
    updateUserPassword,
    getUserTheme,
    updateUserTheme
};
