const db = require('../config/db');

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY timestamp DESC
    `;

    const [notifications] = await db.execute(query, [user_id]);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // 1. Detect limit type to prevent duplicates for exceeded limits
    let limitType = null;
    const lowerTitle = title.toLowerCase();
    const lowerType = (type || '').toLowerCase();

    if (
      lowerType === 'daily' || 
      (lowerTitle.includes('daily') && (lowerTitle.includes('limit') || lowerTitle.includes('budget') || lowerTitle.includes('spending')))
    ) {
      limitType = 'daily';
    } else if (
      lowerType === 'weekly' || 
      (lowerTitle.includes('weekly') && (lowerTitle.includes('limit') || lowerTitle.includes('budget') || lowerTitle.includes('spending')))
    ) {
      limitType = 'weekly';
    } else if (
      lowerType === 'monthly' || 
      (lowerTitle.includes('monthly') && (lowerTitle.includes('limit') || lowerTitle.includes('budget') || lowerTitle.includes('spending')))
    ) {
      limitType = 'monthly';
    } else if (
      lowerType === 'yearly' || 
      (lowerTitle.includes('yearly') && (lowerTitle.includes('limit') || lowerTitle.includes('budget') || lowerTitle.includes('spending')))
    ) {
      limitType = 'yearly';
    }

    if (limitType) {
      // Check if a limit notification of this type already exists today
      const checkQuery = `
        SELECT id FROM notifications
        WHERE user_id = ?
          AND (
            type = ?
            OR (title LIKE ? AND (title LIKE '%limit%' OR title LIKE '%budget%' OR title LIKE '%spending%'))
          )
          AND DATE(timestamp) = CURDATE()
      `;
      const typePattern = `%${limitType}%`;
      const [existing] = await db.execute(checkQuery, [user_id, limitType, typePattern]);

      if (existing.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Notification already exists for today',
          notificationId: existing[0].id
        });
      }
    }

    // 2. Fallback check for exact duplicate title today
    const exactQuery = `
      SELECT id FROM notifications
      WHERE user_id = ?
        AND title = ?
        AND DATE(timestamp) = CURDATE()
    `;
    const [exactExisting] = await db.execute(exactQuery, [user_id, title]);
    if (exactExisting.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Notification already exists for today',
        notificationId: exactExisting[0].id
      });
    }

    const query = `
      INSERT INTO notifications (user_id, title, message, type, timestamp, isRead)
      VALUES (?, ?, ?, ?, NOW(), false)
    `;

    // Map frontend 'alert' type or detected type to DB enum schema
    const finalType = limitType || (type === 'alert' ? 'general' : type) || 'general';

    const [result] = await db.execute(query, [user_id, title, message, finalType]);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notificationId: result.insertId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE notifications
      SET isRead = true
      WHERE id = ?
    `;

    await db.execute(query, [id]);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM notifications
      WHERE id = ?
    `;

    await db.execute(query, [id]);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete all notifications for a user
const deleteAllNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = `
      DELETE FROM notifications
      WHERE user_id = ?
    `;

    await db.execute(query, [user_id]);

    res.status(200).json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  deleteAllNotifications
};
