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

module.exports = {
    getUserProfile,
    updateUserProfile
};
