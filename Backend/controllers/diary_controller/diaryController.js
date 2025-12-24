const db = require('../../config/db');

// Get diary entry for a specific date
const getDiaryEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id; // From verifyUser middleware

    const [rows] = await db.execute(
      'SELECT * FROM diary_entries WHERE user_id = ? AND entry_date = ?',
      [userId, date]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No entry found for this date'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diary entry'
    });
  }
};

// Save or update diary entry
const saveDiaryEntry = async (req, res) => {
  try {
    const { date, content, mood } = req.body;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Check if entry exists
    const [existing] = await db.execute(
      'SELECT id FROM diary_entries WHERE user_id = ? AND entry_date = ?',
      [userId, date]
    );

    if (existing.length > 0) {
      // Update existing entry
      await db.execute(
        'UPDATE diary_entries SET content = ?, mood = ?, updated_at = NOW() WHERE user_id = ? AND entry_date = ?',
        [content, mood || null, userId, date]
      );

      res.json({
        success: true,
        message: 'Diary entry updated successfully'
      });
    } else {
      // Create new entry
      await db.execute(
        'INSERT INTO diary_entries (user_id, entry_date, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, date, content, mood || null]
      );

      res.json({
        success: true,
        message: 'Diary entry saved successfully'
      });
    }
  } catch (error) {
    console.error('Error saving diary entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save diary entry'
    });
  }
};

// Get all diary entries for a user (for calendar view or statistics)
const getAllDiaryEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 30 } = req.query;

    const [rows] = await db.execute(
      'SELECT entry_date, mood, LEFT(content, 100) as preview FROM diary_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT ?',
      [userId, parseInt(limit)]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diary entries'
    });
  }
};

// Delete diary entry
const deleteDiaryEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const [result] = await db.execute(
      'DELETE FROM diary_entries WHERE user_id = ? AND entry_date = ?',
      [userId, date]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Diary entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Diary entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete diary entry'
    });
  }
};

module.exports = {
  getDiaryEntry,
  saveDiaryEntry,
  getAllDiaryEntries,
  deleteDiaryEntry
};
