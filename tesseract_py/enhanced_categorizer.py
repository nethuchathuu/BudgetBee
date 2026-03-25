# Enhanced Categorization System with Gemini AI
# Fuzzywuzzy logic preserved as fallback; Gemini AI handles actual categorization

import re
import os
import json
import sys
from fuzzywuzzy import fuzz

try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# ---------------------------------------------------------------------------
# Predefined categories (must match frontend STANDARD_CATEGORIES exactly)
# ---------------------------------------------------------------------------
STANDARD_CATEGORIES = [
    "Vegetables",
    "Fruits",
    "Meat, Fish & Eggs",
    "Dairy & Alternatives",
    "Spices & Seasonings",
    "Food Essentials",
    "Grocery Essentials",
    "Beverages",
    "Cooked Food",
    "Cleaning Items",
    "Baby Products",
    "Cosmetics, Beauty & Personal Care",
    "Electronics & Appliances",
    "Clothing & Footwear",
    "Fashion",
    "Stationery & Books",
    "Pharmacy / Medical",
    "Furniture & Home Needs",
    "Household Items",
    "Bakery",
    "Snacks & Confectionery",
    "Ice Cream & Frozen Foods",
    "Automotive",
    "Sports & Outdoors",
    "Garden & Outdoor",
    "Pet Care",
    "Seasonal & Holiday",
    "Others / Miscellaneous",
]

# ---------------------------------------------------------------------------
# Brand recognition database (used by fuzzywuzzy fallback)
# ---------------------------------------------------------------------------
BRAND_KEYWORDS = {
    # Snacks & Chips
    'lays': ('Snacks & Confectionery', 'Chips'),
    'pringles': ('Snacks & Confectionery', 'Chips'),
    'doritos': ('Snacks & Confectionery', 'Chips'),
    'cheetos': ('Snacks & Confectionery', 'Chips'),

    # Biscuits & Cookies
    'oreo': ('Snacks & Confectionery', 'Biscuits & Cookies'),
    'parle': ('Snacks & Confectionery', 'Biscuits & Cookies'),
    'britannia': ('Snacks & Confectionery', 'Biscuits & Cookies'),
    'mcvities': ('Snacks & Confectionery', 'Biscuits & Cookies'),

    # Dairy
    'amul': ('Dairy & Alternatives', 'Milk'),
    'nestle': ('Dairy & Alternatives', 'Milk'),
    'mother dairy': ('Dairy & Alternatives', 'Milk'),
    'johnson': ('Baby Products', 'Baby Cream & Cologne'),

    # Beverages
    'coca cola': ('Beverages', 'Soft Drinks'),
    'pepsi': ('Beverages', 'Soft Drinks'),
    'sprite': ('Beverages', 'Soft Drinks'),
    'fanta': ('Beverages', 'Soft Drinks'),
    'tata tea': ('Beverages', 'Tea & Coffee'),
}

# Comprehensive hierarchical categories (used by fuzzywuzzy fallback)
DETAILED_CATEGORIES = {
    "Snacks & Confectionery": {
        "Biscuits & Cookies": ['biscuit', 'cookie', 'cracker', 'wafer', 'marie', 'digestive', 'oreo', 'parle'],
        "Candy & Sweets": ['candy', 'sweet', 'toffee', 'lollipop', 'gummy', 'mint', 'chocolate bar'],
        "Chips": ['chips', 'crisps', 'potato chips', 'corn chips', 'pringles', 'lays', 'namkeen'],
        "Chocolates": ['chocolate', 'cocoa', 'mars', 'snickers', 'kit kat', 'dairy milk', 'cadbury'],
        "Mixtures & Murukku": ['mixture', 'murukku', 'chevda', 'namkeen', 'bhel', 'sev'],
        "Nuts & Dried Fruits": ['nuts', 'almonds', 'cashew', 'raisins', 'dates', 'dried fruit', 'walnuts']
    },

    "Bakery": {
        "Bread & Buns": ['bread', 'bun', 'loaf', 'roll', 'bagel', 'croissant', 'pita', 'naan']
    },

    "Vegetables": {
        "Fresh Vegetables": ['tomato', 'onion', 'potato', 'carrot', 'cabbage', 'spinach', 'broccoli',
                           'cauliflower', 'cucumber', 'lettuce', 'beetroot', 'radish', 'turnip',
                           'eggplant', 'okra', 'beans', 'peas', 'corn', 'capsicum']
    },

    "Fruits": {
        "Fresh Fruits": ['apple', 'banana', 'orange', 'mango', 'grape', 'strawberry', 'pineapple',
                        'watermelon', 'papaya', 'kiwi', 'lime', 'lemon', 'pomegranate', 'guava']
    },

    "Meat, Fish & Eggs": {
        "Chicken, Beef, Fish, Eggs": ['chicken', 'beef', 'fish', 'egg', 'turkey', 'lamb', 'mutton'],
        "Sausages": ['sausage', 'salami', 'pepperoni', 'frankfurter', 'hot dog'],
        "Seafood": ['shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'squid', 'fish fillet'],
        "Dry Fish": ['dry fish', 'dried fish', 'bombay duck', 'fish fry']
    },

    "Dairy & Alternatives": {
        "Milk": ['milk', 'fresh milk', 'whole milk', 'skim milk', 'toned milk'],
        "Cheese": ['cheese', 'cheddar', 'mozzarella', 'cottage cheese', 'cream cheese', 'paneer'],
        "Yogurt & Curd": ['yogurt', 'curd', 'greek yogurt', 'lassi', 'dahi'],
        "Ice Cream": ['ice cream', 'gelato', 'sorbet', 'frozen yogurt', 'kulfi'],
        "Condensed Milk & Milk Powder": ['condensed milk', 'milk powder', 'evaporated milk']
    },

    "Beverages": {
        "Soft Drinks": ['coke', 'pepsi', 'sprite', 'fanta', 'soda', 'cola', 'soft drink'],
        "Tea & Coffee": ['tea', 'coffee', 'green tea', 'black tea', 'instant coffee', 'chai', 'milk tea', 'masala tea', 'nescafe'],
        "Bottled Water": ['water', 'mineral water', 'spring water', 'bottled water'],
        "Juices": ['juice', 'orange juice', 'apple juice', 'mango juice', 'cranberry juice', 'fresh juice']
    },

    "Spices & Seasonings": {
        "Ground Spices": ['turmeric', 'chili powder', 'coriander powder', 'cumin powder', 'red chili'],
        "Whole Spices": ['cinnamon', 'cardamom', 'cloves', 'bay leaves', 'star anise', 'black pepper'],
        "Spice Mixes & Masalas": ['garam masala', 'curry powder', 'tandoori masala', 'chat masala'],
        "Salt & Seasoning": ['salt', 'black salt', 'seasoning', 'rock salt', 'table salt']
    },

    "Food Essentials": {
        "Rice": ['rice', 'basmati', 'jasmine rice', 'brown rice', 'wild rice', 'long grain'],
        "Edible Oils & Ghee": ['oil', 'ghee', 'olive oil', 'coconut oil', 'sunflower oil', 'mustard oil'],
        "Dry Rations": ['flour', 'sugar', 'lentils', 'beans', 'quinoa', 'wheat', 'dal']
    },

    "Grocery Essentials": {
        "Sauces": ['sauce', 'ketchup', 'tomato sauce', 'soy sauce', 'chili sauce'],
        "Honey": ['honey', 'organic honey', 'raw honey'],
        "Jams & Spreads": ['jam', 'jelly', 'spread', 'marmalade', 'peanut butter'],
        "Noodles, Pasta & Vermicelli": ['noodles', 'pasta', 'vermicelli', 'macaroni', 'spaghetti']
    }
}

# ---------------------------------------------------------------------------
# Gemini AI Categorization
# ---------------------------------------------------------------------------

def _get_gemini_client():
    """Initialize and return Gemini client. Returns None if unavailable."""
    if not GEMINI_AVAILABLE:
        return None

    api_key = "AIzaSyDDD97fnSAH93micJrkv3vzeZnkfiqhdKI"

    try:
        client = genai.Client(api_key=api_key)
        return client
    except Exception:
        return None


def categorize_items_with_gemini(ocr_text, parsed_items):
    """
    Use Gemini AI to categorize all parsed items from a receipt.

    Parameters
    ----------
    ocr_text : str
        The full OCR-extracted text from the receipt image.
    parsed_items : list[dict]
        Each dict has at least {'product': str, 'price': float}.

    Returns
    -------
    list[str] | None
        A list of category strings (one per item, same order) on success,
        or None if Gemini is unavailable / fails (caller should fall back).
    """
    if not parsed_items:
        return []

    client = _get_gemini_client()
    if client is None:
        return None

    categories_str = "\n".join(f"  - {c}" for c in STANDARD_CATEGORIES)
    items_str = "\n".join(
        f"  {i+1}. \"{item.get('product', '')}\" - price: {item.get('price', 0)}"
        for i, item in enumerate(parsed_items)
    )

    prompt = f"""You are a product categorizer for supermarket / grocery bills.

Below is the raw OCR text extracted from a receipt, followed by the parsed item list.
Categorize EACH item into exactly ONE of the predefined categories.

=== PREDEFINED CATEGORIES ===
{categories_str}

=== FULL OCR TEXT (for context) ===
{ocr_text}

=== ITEMS TO CATEGORIZE ===
{items_str}

=== RULES ===
1. You MUST use ONLY the predefined categories listed above — no other values.
2. If an item is ambiguous or you cannot determine a category, use "Others / Miscellaneous".
3. Consider the full receipt context (shop name, surrounding items) to improve accuracy.
4. Return ONLY a valid JSON array of strings, one category per item, in the same order.
   Example for 3 items: ["Beverages", "Snacks & Confectionery", "Dairy & Alternatives"]
5. Do NOT include any explanation, markdown formatting, or extra text — just the JSON array.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        raw = response.text.strip()

        # Strip possible markdown code fences
        if raw.startswith("```"):
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)

        categories = json.loads(raw)

        if not isinstance(categories, list) or len(categories) != len(parsed_items):
            return None

        # Validate every returned category is in our predefined list
        validated = []
        for cat in categories:
            if cat in STANDARD_CATEGORIES:
                validated.append(cat)
            else:
                validated.append("Others / Miscellaneous")

        return validated

    except Exception:
        return None


def categorize_single_item_with_gemini(item_name, price=None):
    """
    Use Gemini AI to categorize a single product.

    Returns (main_category, sub_category) or (None, None) on failure.
    """
    client = _get_gemini_client()
    if client is None:
        return None, None

    categories_str = "\n".join(f"  - {c}" for c in STANDARD_CATEGORIES)

    price_info = f" (price: {price})" if price else ""
    prompt = f"""Categorize this product into exactly ONE of the predefined categories.

Product: "{item_name}"{price_info}

Predefined categories:
{categories_str}

Return ONLY the category name as plain text, nothing else.
If unsure, return "Others / Miscellaneous".
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        cat = response.text.strip().strip('"').strip("'")

        if cat in STANDARD_CATEGORIES:
            return cat, cat
        return "Others / Miscellaneous", "Others / Miscellaneous"
    except Exception:
        return None, None


# ---------------------------------------------------------------------------
# FuzzyWuzzy fallback logic (original implementation preserved)
# ---------------------------------------------------------------------------

def preprocess_ocr_text(text):
    """Clean and normalize OCR text for better matching"""
    if not text:
        return ""

    # Convert to lowercase
    text = text.lower().strip()

    # Remove quantity indicators
    text = re.sub(r'\b\d+(?:\.\d+)?\s*(?:kg|g|ml|l|pcs?|pack|packet|bottle|can|box)\b', '', text)

    # Remove special characters except spaces and hyphens
    text = re.sub(r'[^\w\s-]', ' ', text)

    # Fix common OCR errors
    ocr_fixes = {
        '0': 'o', '1': 'i', '5': 's', '8': 'b', '6': 'g', '3': 'e'
    }
    for wrong, correct in ocr_fixes.items():
        text = re.sub(f'{wrong}(?=[a-z])', correct, text)

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def check_brand_keywords(item_text):
    """Check for brand recognition first"""
    item_lower = item_text.lower()

    for brand, (main_cat, sub_cat) in BRAND_KEYWORDS.items():
        if brand in item_lower:
            return main_cat, sub_cat, 95

    return None, None, 0

def fuzzy_match_hierarchical(item_text, threshold=80):
    """Advanced fuzzy matching with hierarchical categories"""
    best_score = 0
    best_main_cat = None
    best_sub_cat = None

    for main_category, subcategories in DETAILED_CATEGORIES.items():
        for subcategory, keywords in subcategories.items():
            for keyword in keywords:
                if keyword in item_text:
                    score = 100
                else:
                    score = fuzz.partial_ratio(keyword, item_text)

                if score > best_score and score >= threshold:
                    best_score = score
                    best_main_cat = main_category
                    best_sub_cat = subcategory

    return best_main_cat, best_sub_cat, best_score

def apply_price_context(item_text, price, main_cat, sub_cat):
    """Use price context for disambiguation"""
    if not price:
        return main_cat, sub_cat

    if price < 50:
        if any(word in item_text for word in ['small', 'mini', 'pack']):
            if not main_cat:
                return "Snacks & Confectionery", "Candy & Sweets"

    elif price > 500:
        if any(word in item_text for word in ['kg', 'large', 'family']):
            if 'rice' in item_text:
                return "Food Essentials", "Rice"
            elif any(meat in item_text for meat in ['chicken', 'beef', 'mutton']):
                return "Meat, Fish & Eggs", "Chicken, Beef, Fish, Eggs"

    return main_cat, sub_cat

def categorize_item_enhanced(item_name, price=None):
    """
    Enhanced categorization function.
    Tries Gemini AI first, falls back to fuzzywuzzy logic.

    From outside this looks like the original fuzzywuzzy-based function,
    but under the hood Gemini AI does the heavy lifting.
    """
    if not item_name:
        return "Others / Miscellaneous", "Others"

    # --- Attempt Gemini AI categorization ---
    gemini_cat, _ = categorize_single_item_with_gemini(item_name, price)
    if gemini_cat is not None:
        return gemini_cat, gemini_cat

    # --- Fallback: original fuzzywuzzy pipeline ---
    # Step 1: Preprocess OCR text
    item_clean = preprocess_ocr_text(item_name)

    # Step 2: Brand recognition first (highest priority)
    main_cat, sub_cat, confidence = check_brand_keywords(item_clean)
    if confidence >= 95:
        return main_cat, sub_cat

    # Step 3: Hierarchical fuzzy matching
    main_cat, sub_cat, confidence = fuzzy_match_hierarchical(item_clean)

    # Step 4: Apply price context if confidence is low
    if confidence < 90 and price:
        main_cat, sub_cat = apply_price_context(item_clean, price, main_cat, sub_cat)

    # Step 5: Final fallback
    if not main_cat:
        main_cat = "Others / Miscellaneous"
        sub_cat = "Others"

    return main_cat, sub_cat

# Test the enhanced function
if __name__ == "__main__":
    test_items = [
        ("Lay's Classic Chips 50g", 45),
        ("Choc01ate C00kies", 25),
        ("Amul Fresh Milk 1L", 60),
        ("Baby cream Johnson's", 150),
        ("Basmati Rice 5kg", 450)
    ]

    print("Testing Enhanced Categorization (Gemini AI + FuzzyWuzzy fallback):")
    print("=" * 60)
    for item, price in test_items:
        main_cat, sub_cat = categorize_item_enhanced(item, price)
        print(f"{item:<25} -> {main_cat} > {sub_cat}")
