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

        // Force LKR currency for all bills (no conversion needed - system is LKR-only)
        if (result && result.success && result.billInfo) {
            // Override currency to LKR regardless of what OCR detected
            result.billInfo.currency = 'LKR';
            result.billInfo.currencySymbol = 'Rs.';
            
            // Mark all prices as LKR (no conversion)
            if (result.billInfo.items) {
                result.billInfo.items = result.billInfo.items.map(item => ({
                    ...item,
                    // Treat detected price as LKR directly
                    price: Number(item.price) || 0
                }));
            }
            
            // Set total as LKR
            result.billInfo.total = Number(result.billInfo.total) || 0;
        }

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

// --- Currency conversion helper ---
const https = require('https');

/**
 * Fetch conversion rate from `fromCurrency` to `toCurrency` using exchangerate.host
 * Returns rate (Number) or null on failure
 */
const fetchConversionRate = (fromCurrency, toCurrency) => {
    return new Promise((resolve) => {
        try {
            // Allow using a custom API URL and key via environment variables.
            // If EXCHANGE_API_URL is set, it can be a template containing {from},{to},{amount},{apikey}
            // Example: https://api.example.com/convert?from={from}&to={to}&amount={amount}&apikey={apikey}
            const customUrlTemplate = process.env.EXCHANGE_API_URL;
            const apiKey = process.env.EXCHANGE_API_KEY || '';
            const apiKeyParam = process.env.EXCHANGE_API_KEY_PARAM || 'apikey';

            let url;
            if (customUrlTemplate) {
                url = customUrlTemplate.replace('{from}', encodeURIComponent(fromCurrency))
                                       .replace('{to}', encodeURIComponent(toCurrency))
                                       .replace('{amount}', '1')
                                       .replace('{apikey}', encodeURIComponent(apiKey));
            } else {
                // Default to exchangerate.host (no API key required)
                url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(toCurrency)}&amount=1`;
                // If user provided an API key but no custom URL, append it as a query param named by EXCHANGE_API_KEY_PARAM.
                if (apiKey) url += `&${encodeURIComponent(apiKeyParam)}=${encodeURIComponent(apiKey)}`;
            }

            https.get(url, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        // Prefer json.info.rate, then json.result (amount for amount=1), then try common providers
                        let rate = null;
                        if (json && json.info && json.info.rate) rate = Number(json.info.rate);
                        else if (json && typeof json.result === 'number') rate = Number(json.result);
                        else if (json && json.rates && json.rates[toCurrency]) rate = Number(json.rates[toCurrency]);
                        else if (json && json.rate) rate = Number(json.rate);

                        resolve((rate && !Number.isNaN(rate)) ? rate : null);
                    } catch (e) {
                        console.error('Failed to parse conversion API response', e);
                        resolve(null);
                    }
                });
            }).on('error', (err) => {
                console.error('Conversion API request failed', err);
                resolve(null);
            });
        } catch (e) {
            console.error('Conversion API error', e);
            resolve(null);
        }
    });
};

/**
 * Convert bill amounts to target currency (LKR). Modifies and returns an enhanced billInfo object
 */
const convertBillToLKR = async (billInfo) => {
    const target = 'LKR';
    const detected = (billInfo && billInfo.currency) ? billInfo.currency.toUpperCase() : 'USD';

    // Default conversion metadata
    billInfo.detected_currency = detected;
    billInfo.conversion_rate = 1;
    billInfo.conversion_status = 'not_required';

    if (detected === target) {
        // Nothing to do; mark converted fields equal to original
        billInfo.items = billInfo.items.map(it => ({
            ...it,
            original_price: it.price,
            original_currency: detected,
            converted_price_rs: Number(Number(it.price).toFixed(2))
        }));
        billInfo.total_original = { amount: Number(Number(billInfo.total).toFixed(2)), currency: detected };
        billInfo.total_converted = { amount: Number(Number(billInfo.total).toFixed(2)), currency: target };
        return billInfo;
    }

    // Fetch conversion rate
    const rate = await fetchConversionRate(detected, target);
    if (!rate || Number.isNaN(rate)) {
        billInfo.conversion_status = 'failed';
        billInfo.conversion_rate = null;
        // Keep original prices and indicate failure
        billInfo.items = billInfo.items.map(it => ({
            ...it,
            original_price: it.price,
            original_currency: detected,
            converted_price_rs: null
        }));
        billInfo.total_original = { amount: Number(Number(billInfo.total).toFixed(2)), currency: detected };
        billInfo.total_converted = { amount: null, currency: target };
        return billInfo;
    }

    // Apply conversion
    billInfo.conversion_status = 'success';
    billInfo.conversion_rate = Number(Number(rate).toFixed(6));

    let convertedTotal = 0;
    billInfo.items = billInfo.items.map(it => {
        const original = Number(it.price) || 0;
        const converted = Number((original * rate).toFixed(2));
        convertedTotal += converted;
        return {
            ...it,
            original_price: original,
            original_currency: detected,
            converted_price_rs: converted
        };
    });

    billInfo.total_original = { amount: Number(Number(billInfo.total).toFixed(2)), currency: detected };
    billInfo.total_converted = { amount: Number(Number(convertedTotal).toFixed(2)), currency: target };

    return billInfo;
};
