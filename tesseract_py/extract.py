import pytesseract
from PIL import Image
import sys
import json
import re
from datetime import datetime

# If Tesseract is not in your PATH, specify the full path (Windows example):
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def categorize_item(item_name):
    """Simple categorization function"""
    item = item_name.lower()
    
    if any(word in item for word in ['milk', 'cheese', 'butter', 'yogurt', 'cream']):
        return 'Dairy'
    elif any(word in item for word in ['bread', 'rice', 'pasta', 'flour', 'wheat', 'cereal']):
        return 'Grains'
    elif any(word in item for word in ['apple', 'banana', 'orange', 'fruit', 'grape', 'mango']):
        return 'Fruits'
    elif any(word in item for word in ['tomato', 'onion', 'potato', 'carrot', 'vegetable', 'lettuce']):
        return 'Vegetables'
    elif any(word in item for word in ['chicken', 'beef', 'fish', 'meat', 'pork', 'lamb']):
        return 'Meat'
    elif any(word in item for word in ['soap', 'shampoo', 'detergent', 'toothpaste', 'tissue']):
        return 'Personal Care'
    elif any(word in item for word in ['oil', 'salt', 'sugar', 'spice', 'sauce', 'vinegar']):
        return 'Condiments'
    else:
        return 'Other'

def parse_bill_text(text):
    """Parse bill text and extract structured information"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    bill_info = {
        'shopName': '',
        'date': '',
        'items': [],
        'total': 0
    }
    
    # Extract shop name (usually first few non-empty lines)
    if lines:
        # Look for the first substantial line as shop name
        for line in lines[:3]:
            if len(line) > 3 and not re.search(r'\d', line):
                bill_info['shopName'] = line
                break
    
    # Extract date using various patterns
    date_patterns = [
        r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
        r'\d{2,4}[-/]\d{1,2}[-/]\d{1,2}',
        r'\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}',
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{2,4}'
    ]
    
    for line in lines:
        for pattern in date_patterns:
            date_match = re.search(pattern, line, re.IGNORECASE)
            if date_match:
                bill_info['date'] = date_match.group(0)
                break
        if bill_info['date']:
            break
    
    # Extract items and prices - look for lines with price format
    item_started = False
    
    for line in lines:
        line_lower = line.lower()
        
        # Skip header information
        if any(word in line_lower for word in ['supermarket', 'store', 'shop', 'tel', 'phone', 'address', 'cashier', 'manager']):
            continue
            
        # Skip footer information
        if any(word in line_lower for word in ['total', 'subtotal', 'tax', 'change', 'cash', 'card', 'thank you', 'visit', 'again', 'toral']):
            continue
        
        # Look for table headers to know when items start
        if any(word in line_lower for word in ['name', 'qty', 'price', 'item']):
            item_started = True
            continue
        
        # If we haven't found a table header but find items with prices, start anyway
        if not item_started and re.search(r'\d+\.\d{2}', line):
            item_started = True
            
        # Look for dollar amounts or decimal prices (with or without $)
        price_match = re.search(r'(\d+\.\d{2})', line)  # Look for decimal prices
        if not price_match:
            price_match = re.search(r'\$(\d+)', line)  # Look for whole dollar amounts
            
        if price_match:
            price_str = price_match.group(1) if price_match.group(1) else price_match.group(0).replace('$', '')
            try:
                price = float(price_str)
                if 0.1 <= price <= 1000:  # Reasonable price range
                    # Extract item name (text before the price)
                    item_part = line[:price_match.start()].strip()
                    
                    # Remove common quantity indicators
                    item_part = re.sub(r'\d+lb\s*$', '', item_part, flags=re.IGNORECASE)  # Remove "1lb", "2lb" etc
                    item_part = re.sub(r'\d+pk\s*$', '', item_part, flags=re.IGNORECASE)  # Remove "12pk" etc
                    item_part = re.sub(r'^\d+\s*', '', item_part)  # Remove leading numbers
                    item_part = re.sub(r'\s*\d+$', '', item_part)  # Remove trailing numbers
                    
                    # Clean up the item name
                    item_name = re.sub(r'[^\w\s-]', ' ', item_part).strip()
                    item_name = ' '.join(item_name.split())  # Remove extra spaces
                    
                    if item_name and len(item_name) > 2:
                        bill_info['items'].append({
                            'product': item_name,
                            'price': price,
                            'category': categorize_item(item_name)
                        })
            except ValueError:
                continue
    
    # Calculate total
    bill_info['total'] = sum(item['price'] for item in bill_info['items'])
    
    return bill_info

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Please provide image path as argument'}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Load and process the image
        image = Image.open(image_path)
        
        # Extract text using pytesseract
        extracted_text = pytesseract.image_to_string(image)
        
        # Parse the extracted text
        bill_info = parse_bill_text(extracted_text)
        
        # Return JSON response
        result = {
            'success': True,
            'extractedText': extracted_text,
            'billInfo': bill_info
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
