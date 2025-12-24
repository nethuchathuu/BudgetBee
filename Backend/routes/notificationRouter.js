const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user (auth optional for development)
router.get('/:user_id', notificationController.getNotifications);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Delete all notifications for a user
router.delete('/deleteAll/:user_id', notificationController.deleteAllNotifications);

module.exports = router;
