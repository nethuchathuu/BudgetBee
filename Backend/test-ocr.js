// Test script to verify OCR endpoint
const fs = require('fs');
const path = require('path');

async function testOCR() {
    try {
        const imagePath = path.join(__dirname, '../tesseract_py/bill3.jpg');
        const imageBuffer = fs.readFileSync(imagePath);
        
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', imageBuffer, 'bill3.jpg');
        
        const response = await fetch('http://localhost:5000/api/ocr/extract', {
            method: 'POST',
            body: form,
        });
        
        const result = await response.json();
        console.log('OCR Result:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('Test Error:', error.message);
    }
}

testOCR();