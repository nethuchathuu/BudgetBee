const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for temporary storage
const uploadDir = 'uploads/temp';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route to send support email
router.post('/send', upload.array('attachments', 5), supportController.sendSupportEmail);

module.exports = router;
