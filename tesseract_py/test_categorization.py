# Test enhanced categorization system

import sys
import os
sys.path.append('.')
from extract import categorize_item

# Test cases for various categories
test_items = [
    # Food & Grocery
    ("Large Eggs", "Dairy"),
    ("Cottage Cheese", "Dairy"),
    ("Chicken Breast", "Meat & Seafood"),
    ("Cherry Tomatoes", "Vegetables"),
    ("Bananas", "Fruits"),
    ("Chocolate Cookies", "Snacks & Sweets"),
    ("Orange Juice", "Beverages"),
    ("Olive Oil", "Condiments & Spices"),
    ("Frozen Pizza", "Frozen Foods"),
    ("Canned Tuna", "Canned & Packaged"),
    
    # Personal Care & Health
    ("Baby Wipes", "Baby Products"),
    ("Toilet Paper", "Household & Cleaning"),
    ("Shampoo", "Personal Care"),
    ("Vitamin C", "Health & Medicine"),
    
    # Educational Items
    ("Notebook", "Educational & Stationery"),
    ("Pen Set", "Educational & Stationery"),
    ("Calculator", "Educational & Stationery"),
    ("Textbook", "Educational & Stationery"),
    
    # Furniture & Home
    ("Office Chair", "Furniture & Home"),
    ("Study Table", "Furniture & Home"),
    ("Desk Lamp", "Furniture & Home"),
    
    # Transportation
    ("Bus Fare", "Transportation"),
    ("Petrol", "Transportation"),
    ("Parking Fee", "Transportation"),
    ("Taxi Ride", "Transportation"),
    
    # Electronics
    ("Phone Charger", "Electronics"),
    ("Laptop", "Electronics"),
    ("Headphones", "Electronics"),
    
    # Clothing
    ("T-shirt", "Clothing & Accessories"),
    ("Running Shoes", "Clothing & Accessories"),
    ("School Bag", "Clothing & Accessories"),
    
    # Others
    ("Pet Food", "Pet Supplies"),
    ("Football", "Sports & Recreation"),
    ("Repair Service", "Services"),
]

print("Enhanced Categorization Test Results:")
print("=" * 60)

correct = 0
total = len(test_items)

for item_name, expected_category in test_items:
    detected_category = categorize_item(item_name)
    is_correct = detected_category == expected_category
    
    if is_correct:
        correct += 1
        status = "✅"
    else:
        status = "❌"
    
    print(f"{status} {item_name:20} → {detected_category:20} (Expected: {expected_category})")

print("\n" + "=" * 60)
print(f"Accuracy: {correct}/{total} ({correct/total*100:.1f}%)")
print(f"Categories covered: {len(set(category for _, category in test_items))}")