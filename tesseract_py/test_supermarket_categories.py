import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from extract import categorize_item

def test_supermarket_categorization():
    """Test the comprehensive supermarket categorization system"""
    
    test_items = [
        # Snacks & Confectionery
        ("Chocolate cookies", "Snacks & Confectionery"),
        ("Potato chips", "Snacks & Confectionery"),
        ("Mixed nuts", "Snacks & Confectionery"),
        ("Candy bar", "Snacks & Confectionery"),
        ("Biscuits pack", "Snacks & Confectionery"),
        ("Murukku", "Snacks & Confectionery"),
        
        # Bakery
        ("White bread", "Bakery"),
        ("Hamburger bun", "Bakery"),
        ("Croissant", "Bakery"),
        
        # Vegetables
        ("Fresh tomatoes", "Vegetables"),
        ("Red onions", "Vegetables"),
        ("Potato bag", "Vegetables"),
        ("Green pepper", "Vegetables"),
        ("Spinach leaves", "Vegetables"),
        
        # Fruits
        ("Green apples", "Fruits"),
        ("Banana bunch", "Fruits"),
        ("Orange fruit", "Fruits"),
        ("Mango", "Fruits"),
        ("Strawberries", "Fruits"),
        
        # Meat & Fish
        ("Chicken breast", "Meat & Fish"),
        ("Fresh salmon", "Meat & Fish"),
        ("Ground beef", "Meat & Fish"),
        ("Eggs dozen", "Meat & Fish"),
        ("Sausages", "Meat & Fish"),
        ("Dry fish", "Meat & Fish"),
        
        # Dairy
        ("Fresh milk", "Dairy"),
        ("Cheddar cheese", "Dairy"),
        ("Greek yogurt", "Dairy"),
        ("Ice cream", "Dairy"),
        ("Butter", "Dairy"),
        ("Condensed milk", "Dairy"),
        
        # Spices & Seasonings
        ("Turmeric powder", "Spices & Seasonings"),
        ("Black pepper", "Spices & Seasonings"),
        ("Cinnamon sticks", "Spices & Seasonings"),
        ("Garam masala", "Spices & Seasonings"),
        ("Sea salt", "Spices & Seasonings"),
        
        # Food Essentials
        ("Basmati rice", "Food Essentials"),
        ("Cooking oil", "Food Essentials"),
        ("White sugar", "Food Essentials"),
        ("Wheat flour", "Food Essentials"),
        ("Ghee", "Food Essentials"),
        
        # Grocery Essentials
        ("Curry paste", "Grocery Essentials"),
        ("Tomato sauce", "Grocery Essentials"),
        ("Instant noodles", "Grocery Essentials"),
        ("Honey bottle", "Grocery Essentials"),
        ("Strawberry jam", "Grocery Essentials"),
        
        # Beverages
        ("Orange juice", "Beverages"),
        ("Green tea", "Beverages"),
        ("Coffee powder", "Beverages"),
        ("Mineral water", "Beverages"),
        ("Soft drink", "Beverages"),
        
        # Cleaning Items
        ("Laundry detergent", "Cleaning Items"),
        ("Dish soap", "Cleaning Items"),
        ("Shampoo bottle", "Cleaning Items"),
        ("Disinfectant spray", "Cleaning Items"),
        ("Fabric softener", "Cleaning Items"),
        
        # Household Items
        ("Toilet paper", "Household Items"),
        ("Batteries pack", "Household Items"),
        ("Light bulb", "Household Items"),
        ("Food containers", "Household Items"),
        ("Air freshener", "Household Items"),
        
        # Cosmetics, Beauty & Personal Care
        ("Face cream", "Cosmetics, Beauty & Personal Care"),
        ("Perfume", "Cosmetics, Beauty & Personal Care"),
        ("Toothpaste", "Cosmetics, Beauty & Personal Care"),
        ("Body lotion", "Cosmetics, Beauty & Personal Care"),
        ("Baby wipes", "Cosmetics, Beauty & Personal Care"),
        
        # Baby Products
        ("Baby diapers", "Baby Products"),
        ("Baby milk powder", "Baby Products"),
        ("Baby cream", "Baby Products"),
        ("Baby clothes", "Baby Products"),
        
        # Electronics & Appliances
        ("Phone charger", "Electronics & Appliances"),
        ("Laptop computer", "Electronics & Appliances"),
        ("Television", "Electronics & Appliances"),
        ("Small gadget", "Electronics & Appliances"),
        
        # Clothing & Footwear
        ("Cotton shirt", "Clothing & Footwear"),
        ("Running shoes", "Clothing & Footwear"),
        ("Jeans pants", "Clothing & Footwear"),
        ("Winter jacket", "Clothing & Footwear"),
        
        # Fashion
        ("Leather belt", "Fashion"),
        ("Watch", "Fashion"),
        ("Handbag", "Fashion"),
        ("Fashion accessory", "Fashion"),
        ("Jewelry", "Fashion"),
        
        # Stationery & Books
        ("Notebook", "Stationery & Books"),
        ("Ball pen", "Stationery & Books"),
        ("Textbook", "Stationery & Books"),
        ("School supplies", "Stationery & Books"),
        
        # Pharmacy / Medical
        ("Vitamin tablets", "Pharmacy / Medical"),
        ("Medicine bottle", "Pharmacy / Medical"),
        ("First aid kit", "Pharmacy / Medical"),
        ("Health supplement", "Pharmacy / Medical"),
        
        # Furniture & Home Needs
        ("Office chair", "Furniture & Home Needs"),
        ("Table lamp", "Furniture & Home Needs"),
        ("Home decor", "Furniture & Home Needs"),
        ("Mattress", "Furniture & Home Needs"),
        
        # Desserts & Ingredients
        ("Baking powder", "Desserts & Ingredients"),
        ("Icing sugar", "Desserts & Ingredients"),
        ("Food coloring", "Desserts & Ingredients"),
        ("Ready dessert", "Desserts & Ingredients"),
        
        # Transport / Fuel
        ("Petrol", "Transport / Fuel"),
        ("Bus fare", "Transport / Fuel"),
        ("Parking fee", "Transport / Fuel"),
        ("Vehicle charge", "Transport / Fuel"),
        
        # Auto Care
        ("Car air freshener", "Auto Care"),
        ("Auto cleaning product", "Auto Care"),
        
        # Services
        ("Repair service", "Services"),
        ("Delivery charge", "Services"),
        ("Salon service", "Services"),
        
        # Party Shop
        ("Party decoration", "Party Shop"),
        ("Party accessory", "Party Shop"),
        ("Balloon pack", "Party Shop"),
        
        # Gifts
        ("Gift item", "Gifts"),
        ("Greeting card", "Gifts"),
        
        # Utilities & Bills
        ("Electricity bill", "Utilities & Bills"),
        ("Water bill", "Utilities & Bills"),
        ("Internet bill", "Utilities & Bills"),
        ("Mobile bill", "Utilities & Bills"),
        
        # Others / Miscellaneous
        ("Unknown item", "Others / Miscellaneous"),
        ("Random product", "Others / Miscellaneous"),
    ]
    
    print("🛒 Testing Comprehensive Supermarket Categorization System")
    print("=" * 70)
    
    correct = 0
    total = len(test_items)
    category_counts = {}
    
    for item, expected_category in test_items:
        actual_category = categorize_item(item)
        status = "✅" if actual_category == expected_category else "❌"
        
        print(f"{status} {item:<30} → {actual_category:<35} (Expected: {expected_category})")
        
        if actual_category == expected_category:
            correct += 1
        
        # Count categories
        category_counts[actual_category] = category_counts.get(actual_category, 0) + 1
    
    print("\n" + "=" * 70)
    print(f"📊 Results: {correct}/{total} correct ({(correct/total)*100:.1f}%)")
    
    print("\n📈 Category Distribution:")
    for category, count in sorted(category_counts.items()):
        print(f"   {category}: {count} items")
    
    print(f"\n🎯 Total Categories Found: {len(category_counts)}")
    
    # Show all available categories
    print(f"\n🛍️ Available Categories in System:")
    all_categories = [
        "Snacks & Confectionery", "Bakery", "Vegetables", "Fruits", "Meat & Fish",
        "Dairy", "Spices & Seasonings", "Food Essentials", "Grocery Essentials",
        "Beverages", "Cleaning Items", "Household Items", "Cosmetics, Beauty & Personal Care",
        "Baby Products", "Electronics & Appliances", "Clothing & Footwear", "Fashion",
        "Stationery & Books", "Pharmacy / Medical", "Furniture & Home Needs",
        "Desserts & Ingredients", "Transport / Fuel", "Auto Care", "Services",
        "Party Shop", "Gifts", "Utilities & Bills", "Others / Miscellaneous"
    ]
    
    for i, category in enumerate(all_categories, 1):
        print(f"   {i:2d}. {category}")

if __name__ == "__main__":
    test_supermarket_categorization()