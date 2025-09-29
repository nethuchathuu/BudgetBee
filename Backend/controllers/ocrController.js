const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// OCR processing function using Python script
const processImage = async (req, res) => {
    let tempImagePath = null;
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('Processing image with Python OCR...');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Save uploaded file temporarily
        const fileExtension = path.extname(req.file.originalname) || '.jpg';
        const timestamp = Date.now();
        tempImagePath = path.join(tempDir, `upload_${timestamp}${fileExtension}`);
        
        fs.writeFileSync(tempImagePath, req.file.buffer);
        console.log('Temporary image saved:', tempImagePath);
        
        // Path to Python script
        const pythonScriptPath = path.join(__dirname, '../../tesseract_py/extract.py');
        
        // Execute Python script
        const result = await runPythonScript(pythonScriptPath, tempImagePath);
        
        console.log('Python OCR completed successfully');
        
        res.json(result);

    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ 
            error: 'Failed to process image', 
            details: error.message 
        });
    } finally {
        // Clean up temporary file
        if (tempImagePath && fs.existsSync(tempImagePath)) {
            try {
                fs.unlinkSync(tempImagePath);
                console.log('Temporary file cleaned up:', tempImagePath);
            } catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
        }
    }
};

// Function to run Python script and return parsed result
const runPythonScript = (scriptPath, imagePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, imagePath]);
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', stderr);
                reject(new Error(`Python script failed with code ${code}: ${stderr}`));
                return;
            }
            
            try {
                const result = JSON.parse(stdout.trim());
                resolve(result);
            } catch (parseError) {
                console.error('Failed to parse Python script output:', stdout);
                reject(new Error('Failed to parse Python script output'));
            }
        });
        
        pythonProcess.on('error', (error) => {
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });
    });
};



module.exports = {
    upload,
    processImage
};