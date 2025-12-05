const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/verifyUser');
const {
  getDiaryEntry,
  saveDiaryEntry,
  getAllDiaryEntries,
  deleteDiaryEntry
} = require('../controllers/diary_controller/diaryController');

// All routes require authentication
router.use(verifyUser);

// Get all diary entries (with optional limit)
router.get('/', getAllDiaryEntries);

// Get specific diary entry by date
router.get('/:date', getDiaryEntry);

// Save or update diary entry
router.post('/', saveDiaryEntry);

// Delete diary entry
router.delete('/:date', deleteDiaryEntry);

module.exports = router;
