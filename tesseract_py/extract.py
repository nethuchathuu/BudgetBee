import pytesseract
from PIL import Image
import sys
import json
import re
from datetime import datetime

# If Tesseract is not in your PATH, specify the full path (Windows example):
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def categorize_item(item_name):
    """Enhanced categorization function with comprehensive 16 categories"""
    item = item_name.lower()
    
    # 1. Groceries / Food Items - Rice, flour, sugar, snacks, packaged food
    if any(word in item for word in ['rice', 'flour', 'sugar', 'snacks', 'packaged food', 'bread', 'pasta', 'cereal', 'oats', 'noodles', 'grain', 'wheat', 'chips', 'cookies', 'crackers', 'nuts', 'chocolate', 'candy', 'biscuit', 'cake', 'pastry', 'canned', 'jar', 'bottle', 'packaged', 'preserved', 'frozen']) and not any(word in item for word in ['shampoo', 'soap', 'cream', 'medicine']):
        return 'Groceries / Food Items'
    
    # 2. Vegetables & Fruits - Fresh produce
    elif any(word in item for word in ['tomato', 'onion', 'potato', 'carrot', 'vegetable', 'lettuce', 'spinach', 'cabbage', 'broccoli', 'pepper', 'cucumber', 'eggplant', 'aubergine', 'apple', 'banana', 'orange', 'fruit', 'grape', 'mango', 'strawberry', 'pineapple', 'lemon', 'cherry', 'berries']) and not any(word in item for word in ['juice', 'drink']):
        return 'Vegetables & Fruits'
    
    # 3. Meat, Fish - Protein items
    elif any(word in item for word in ['chicken', 'beef', 'fish', 'meat', 'pork', 'lamb', 'turkey', 'salmon', 'tuna', 'seafood', 'shrimp', 'mutton', 'goat', 'duck']):
        return 'Meat, Fish'
    
    # 4. Dairy Products - Milk, cheese, yogurt
    elif any(word in item for word in ['milk', 'cheese', 'butter', 'yogurt', 'egg', 'eggs', 'dairy']) and not any(word in item for word in ['cream', 'ice cream']):
        return 'Dairy Products'
    
    # 5. Beverages - Drinks, juices, soft drinks
    elif any(word in item for word in ['juice', 'coffee', 'tea', 'soda', 'water', 'beer', 'wine', 'beverage', 'drink', 'cola', 'energy drink', 'soft drink', 'lemonade']) and not any(word in item for word in ['bill']):
        return 'Beverages'
    
    # 6. Personal Care - Soap, shampoo, cosmetics
    elif any(word in item for word in ['soap', 'shampoo', 'toothpaste', 'toothbrush', 'deodorant', 'perfume', 'lotion', 'cream', 'cosmetic', 'makeup', 'skincare', 'face wash', 'body wash', 'baby wipes', 'wipes']) and not any(word in item for word in ['ice cream', 'dairy', 'dish']):
        return 'Personal Care'
    
    # 7. Household Items - Cleaning supplies, kitchen items
    elif any(word in item for word in ['detergent', 'cleaner', 'tissue', 'toilet paper', 'paper towel', 'garbage bag', 'cleaning', 'bleach', 'dish soap', 'kitchen utensils', 'plates', 'cups', 'spoons', 'forks', 'knives']):
        return 'Household Items'
    
    # 8. Health & Medicine - Medical supplies, vitamins
    elif any(word in item for word in ['medicine', 'tablet', 'pill', 'vitamin', 'supplement', 'bandage', 'first aid', 'pharmacy', 'antiseptic', 'painkiller', 'cough syrup']):
        return 'Health & Medicine'
    
    # 9. Electronics - Gadgets, appliances
    elif any(word in item for word in ['phone', 'computer', 'laptop', 'tablet', 'headphone', 'cable', 'charger', 'battery', 'electronics', 'gadget', 'television', 'tv', 'radio', 'camera']) and not any(word in item for word in ['bill']):
        return 'Electronics'
    
    # 10. Clothing & Accessories - Apparel, jewelry
    elif any(word in item for word in ['shirt', 'pants', 'dress', 'shoes', 'sock', 'underwear', 'jacket', 'hat', 'bag', 'belt', 'watch', 'jewelry', 'clothing', 'jeans', 'skirt', 'blouse']):
        return 'Clothing & Accessories'
    
    # 11. Transportation - Vehicle expenses, fuel
    elif any(word in item for word in ['fuel', 'gas', 'petrol', 'diesel', 'bus fare', 'taxi', 'uber', 'train', 'metro', 'parking', 'toll', 'transport', 'car wash', 'oil change', 'vehicle maintenance']):
        return 'Transportation'
    
    # 12. Education & Stationery - Books, school supplies
    elif any(word in item for word in ['book', 'pen', 'pencil', 'notebook', 'paper', 'ruler', 'eraser', 'marker', 'highlighter', 'calculator', 'textbook', 'magazine', 'journal', 'school supplies']):
        return 'Education & Stationery'
    
    # 13. Entertainment & Recreation - Games, sports, hobbies
    elif any(word in item for word in ['game', 'toy', 'sport', 'ball', 'gym', 'fitness', 'exercise', 'recreation', 'hobby', 'football', 'cricket', 'tennis', 'movie ticket', 'concert']):
        return 'Entertainment & Recreation'
    
    # 14. Utilities & Bills - Electricity, water, internet
    elif any(word in item for word in ['electricity', 'water bill', 'gas bill', 'internet', 'phone bill', 'utility', 'electric bill', 'telephone', 'broadband', 'wifi', 'bill']) and any(word in item for word in ['bill', 'electricity', 'water', 'gas', 'internet', 'phone', 'electric', 'utility']):
        return 'Utilities & Bills'
    
    # 15. Services - Professional services, repairs
    elif any(word in item for word in ['service', 'repair', 'maintenance', 'delivery', 'shipping', 'consultation', 'professional service', 'haircut', 'salon', 'spa', 'cleaning service']):
        return 'Services'
    
    # 16. Other / Miscellaneous - Items not fitting other categories
    else:
        return 'Other / Miscellaneous'

def detect_currency(text):
    """Detect currency from text"""
    currency_patterns = {
        'USD': [r'\$', r'USD', r'DOLLAR', r'DOLLARS'],
        'EUR': [r'€', r'EUR', r'EURO', r'EUROS'],
        'GBP': [r'£', r'GBP', r'POUND', r'POUNDS'],
        'INR': [r'₹', r'INR', r'RUPEE', r'RUPEES', r'RS\.?\s', r'Rs\.?\s', r'RS$', r'Rs$'],
        'JPY': [r'¥', r'JPY', r'YEN'],
        'CAD': [r'CAD', r'C\$'],
        'AUD': [r'AUD', r'A\$'],
        'LKR': [r'LKR', r'SL\s?RS\.?', r'SL\s?Rs\.?', r'LANKAN\s?RUPEE'],
    }
    
    text_upper = text.upper()
    
    # Count occurrences of each currency
    currency_scores = {}
    for currency, patterns in currency_patterns.items():
        score = 0
        for pattern in patterns:
            matches = re.findall(pattern, text_upper)
            score += len(matches)
        if score > 0:
            currency_scores[currency] = score
    
    # Return the most common currency, default to USD if $ is found, otherwise detect based on context
    if currency_scores:
        detected_currency = max(currency_scores, key=currency_scores.get)
        return detected_currency
    elif '$' in text:
        return 'USD'
    else:
        # Try to detect from number patterns (less reliable but better than unknown)
        if re.search(r'\d+\.\d{2}', text):  # Common in USD/EUR/GBP
            return 'USD'  # Default to USD for decimal format
        return 'USD'  # Default fallback

def get_currency_symbol(currency_code):
    """Get currency symbol from currency code"""
    symbols = {
        'USD': '$',
        'EUR': '€', 
        'GBP': '£',
        'INR': '₹',
        'JPY': '¥',
        'CAD': 'C$',
        'AUD': 'A$',
        'LKR': 'Rs.'
    }
    return symbols.get(currency_code, currency_code)

def parse_bill_text(text):
    """Parse bill text and extract structured information"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Detect currency
    detected_currency = detect_currency(text)
    currency_symbol = get_currency_symbol(detected_currency)
    
    bill_info = {
        'shopName': '',
        'date': '',
        'items': [],
        'total': 0,
        'currency': detected_currency,
        'currencySymbol': currency_symbol
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
