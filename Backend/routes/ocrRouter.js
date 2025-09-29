const express = require('express');
const { upload, processImage } = require('../controllers/ocrController');

const router = express.Router();

// POST /api/ocr/extract - Extract text from uploaded image
router.post('/extract', upload.single('image'), processImage);

module.exports = router;