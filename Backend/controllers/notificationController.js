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

    const query = `
      INSERT INTO notifications (user_id, title, message, type, timestamp, isRead)
      VALUES (?, ?, ?, ?, NOW(), false)
    `;

    const [result] = await db.execute(query, [user_id, title, message, type || 'general']);

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
