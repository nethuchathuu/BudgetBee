# Test currency detection with different sample texts

import sys
import os
sys.path.append('.')
from extract import detect_currency, get_currency_symbol

# Test cases
test_cases = [
    ("SUPERMARKET\nTotal $52.79", "USD", "$"),
    ("SHOP\nTotal: £25.50", "GBP", "£"),
    ("STORE\nTotal: €18.90", "EUR", "€"),
    ("MARKET\nTotal: ₹1,250.00", "INR", "₹"),
    ("SHOP\nTotal: Rs. 850", "INR", "₹"),
    ("SUPERMARKET\nTotal: 125.50 (no symbol)", "USD", "$"),  # Default case
]

print("Currency Detection Test Results:")
print("=" * 50)

for i, (text, expected_currency, expected_symbol) in enumerate(test_cases, 1):
    detected_currency = detect_currency(text)
    detected_symbol = get_currency_symbol(detected_currency)
    
    status = "✅ PASS" if detected_currency == expected_currency else "❌ FAIL"
    
    print(f"Test {i}: {status}")
    print(f"  Text: {text.replace(chr(10), ' | ')}")
    print(f"  Expected: {expected_currency} ({expected_symbol})")
    print(f"  Detected: {detected_currency} ({detected_symbol})")
    print()