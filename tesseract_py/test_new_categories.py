import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from extract import categorize_item

def test_new_categorization():
    """Test the new 16-category system"""
    
    test_items = [
        # Groceries / Food Items
        ("Rice 5kg", "Groceries / Food Items"),
        ("Wheat flour", "Groceries / Food Items"),
        ("Sugar white", "Groceries / Food Items"),
        ("Chips packet", "Groceries / Food Items"),
        ("Bread loaf", "Groceries / Food Items"),
        ("Canned beans", "Groceries / Food Items"),
        ("Chocolate cookies", "Groceries / Food Items"),
        ("Frozen pizza", "Groceries / Food Items"),
        ("Packaged food", "Groceries / Food Items"),
        
        # Vegetables & Fruits
        ("Fresh tomatoes", "Vegetables & Fruits"),
        ("Red onions", "Vegetables & Fruits"),
        ("Green apples", "Vegetables & Fruits"),
        ("Banana bunch", "Vegetables & Fruits"),
        ("Cherry tomatoes", "Vegetables & Fruits"),
        ("Orange fruit", "Vegetables & Fruits"),
        
        # Meat, Fish
        ("Chicken breast", "Meat, Fish"),
        ("Fresh salmon", "Meat, Fish"),
        ("Ground beef", "Meat, Fish"),
        ("Tuna fish", "Meat, Fish"),
        
        # Dairy Products
        ("Fresh milk", "Dairy Products"),
        ("Cheddar cheese", "Dairy Products"),
        ("Greek yogurt", "Dairy Products"),
        ("Eggs dozen", "Dairy Products"),
        ("Large eggs", "Dairy Products"),
        
        # Beverages
        ("Orange juice", "Beverages"),
        ("Coffee beans", "Beverages"),
        ("Mineral water", "Beverages"),
        ("Green tea", "Beverages"),
        ("Soft drink", "Beverages"),
        
        # Personal Care
        ("Shampoo bottle", "Personal Care"),
        ("Body soap", "Personal Care"),
        ("Toothpaste", "Personal Care"),
        ("Face cream", "Personal Care"),
        
        # Household Items
        ("Dish soap", "Household Items"),
        ("Toilet paper", "Household Items"),
        ("Kitchen plates", "Household Items"),
        ("Cleaning detergent", "Household Items"),
        
        # Health & Medicine
        ("Vitamin C tablets", "Health & Medicine"),
        ("First aid kit", "Health & Medicine"),
        ("Cough syrup", "Health & Medicine"),
        ("Medicine bottle", "Health & Medicine"),
        
        # Electronics
        ("Mobile phone", "Electronics"),
        ("Laptop computer", "Electronics"),
        ("Phone charger", "Electronics"),
        ("Television", "Electronics"),
        
        # Clothing & Accessories
        ("Cotton shirt", "Clothing & Accessories"),
        ("Running shoes", "Clothing & Accessories"),
        ("Leather belt", "Clothing & Accessories"),
        ("Winter jacket", "Clothing & Accessories"),
        
        # Transportation
        ("Petrol fuel", "Transportation"),
        ("Bus fare", "Transportation"),
        ("Parking fee", "Transportation"),
        ("Taxi ride", "Transportation"),
        
        # Education & Stationery
        ("Notebook pack", "Education & Stationery"),
        ("Ball pen", "Education & Stationery"),
        ("Textbook", "Education & Stationery"),
        ("Calculator", "Education & Stationery"),
        
        # Entertainment & Recreation
        ("Football", "Entertainment & Recreation"),
        ("Board game", "Entertainment & Recreation"),
        ("Movie ticket", "Entertainment & Recreation"),
        ("Toy car", "Entertainment & Recreation"),
        
        # Utilities & Bills
        ("Electricity bill", "Utilities & Bills"),
        ("Internet service", "Utilities & Bills"),
        ("Water bill", "Utilities & Bills"),
        ("Phone bill", "Utilities & Bills"),
        
        # Services
        ("Haircut service", "Services"),
        ("Delivery charge", "Services"),
        ("Repair service", "Services"),
        ("Professional service", "Services"),
        
        # Other / Miscellaneous
        ("Random item xyz", "Other / Miscellaneous"),
        ("Unknown product", "Other / Miscellaneous"),
    ]
    
    print("🧪 Testing New 16-Category System")
    print("=" * 60)
    
    correct = 0
    total = len(test_items)
    category_counts = {}
    
    for item, expected_category in test_items:
        actual_category = categorize_item(item)
        status = "✅" if actual_category == expected_category else "❌"
        
        print(f"{status} {item:<25} → {actual_category:<25} (Expected: {expected_category})")
        
        if actual_category == expected_category:
            correct += 1
        
        # Count categories
        category_counts[actual_category] = category_counts.get(actual_category, 0) + 1
    
    print("\n" + "=" * 60)
    print(f"📊 Results: {correct}/{total} correct ({(correct/total)*100:.1f}%)")
    
    print("\n📈 Category Distribution:")
    for category, count in sorted(category_counts.items()):
        print(f"   {category}: {count} items")
    
    print(f"\n🎯 Total Categories Found: {len(category_counts)}")

if __name__ == "__main__":
    test_new_categorization()