const db = require('../config/db');
const { runLimitChecks } = require('../utils/limitChecker');

// Get user limits
const getLimits = async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = `
      SELECT * FROM user_limits
      WHERE user_id = ?
    `;

    const [rows] = await db.execute(query, [user_id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      // Return default limits if not set
      res.status(200).json({
        user_id,
        daily_limit: 0,
        weekly_limit: 0,
        monthly_limit: 0,
        yearly_limit: 0,
        alert_threshold: 80
      });
    }
  } catch (error) {
    console.error('Error fetching limits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Save/Update user limits
const saveLimits = async (req, res) => {
  try {
    const { user_id, daily_limit, weekly_limit, monthly_limit, yearly_limit, alert_threshold } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if limits already exist
    const checkQuery = `
      SELECT * FROM user_limits WHERE user_id = ?
    `;
    const [existing] = await db.execute(checkQuery, [user_id]);

    if (existing.length > 0) {
      // Update existing limits
      const updateQuery = `
        UPDATE user_limits
        SET daily_limit = ?, weekly_limit = ?, monthly_limit = ?, yearly_limit = ?, alert_threshold = ?
        WHERE user_id = ?
      `;
      await db.execute(updateQuery, [
        daily_limit || 0,
        weekly_limit || 0,
        monthly_limit || 0,
        yearly_limit || 0,
        alert_threshold || 80,
        user_id
      ]);
    } else {
      // Insert new limits
      const insertQuery = `
        INSERT INTO user_limits (user_id, daily_limit, weekly_limit, monthly_limit, yearly_limit, alert_threshold)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.execute(insertQuery, [
        user_id,
        daily_limit || 0,
        weekly_limit || 0,
        monthly_limit || 0,
        yearly_limit || 0,
        alert_threshold || 80
      ]);
    }

    res.status(200).json({
      success: true,
      message: 'Limits saved successfully'
    });
  } catch (error) {
    console.error('Error saving limits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check limits and create notifications
const checkLimits = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Run limit checks
    await runLimitChecks(user_id);

    res.status(200).json({
      success: true,
      message: 'Limit checks completed'
    });
  } catch (error) {
    console.error('Error checking limits:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getLimits,
  saveLimits,
  checkLimits
};
