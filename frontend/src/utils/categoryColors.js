// Shared color palette for all expense categories
// This ensures consistent colors across all charts (bar, pie) in all summary views

export const categoryColors = {
  // Food & Grocery Categories
  'Snacks & Confectionery': '#E63946',
  'Bakery': '#F4A261',
  'Vegetables': '#2A9D8F',
  'Fruits': '#F77F00',
  'Meat, Fish & Eggs': '#7209B7',
  'Dairy & Alternatives': '#FFD166',
  'Spices & Seasonings': '#D62828',
  'Food Essentials': '#06D6A0',
  'Grocery Essentials': '#1D3557',
  'Beverages': '#3A0CA3',
  'Desserts & Ingredients': '#FFB703',
  'Food & Drink': '#a7a4ff',
  
  // Household & Personal Care
  'Cleaning Items': '#6D597A',
  'Household Items': '#FF9F1C',
  'Cosmetics, Beauty & Personal Care': '#8338EC',
  'Baby Products': '#3F88C5',
  
  // Electronics & Fashion
  'Electronics & Appliances': '#118AB2',
  'Clothing & Footwear': '#FF006E',
  'Fashion': '#FFBE0B',
  
  // Other Categories
  'Stationery & Books': '#43AA8B',
  'Pharmacy / Medical': '#90BE6D',
  'Furniture & Home Needs': '#8ECAE6',
  'Transport / Fuel': '#F3722C',
  'Auto Care': '#9B2226',
  'Services': '#577590',
  'Party Shop': '#B5179E',
  'Gifts': '#E85D04',
  'Utilities & Bills': '#4895EF',
  'Others / Miscellaneous': '#495057',
  
  // Legacy/Alias categories for backward compatibility
  'Food & Dining': '#E63946',
  'Transport': '#F3722C',
  'Utilities': '#4895EF',
  'Entertainment': '#B5179E',
  'Healthcare': '#90BE6D',
  'Shopping': '#FF9F1C',
  'Education': '#43AA8B',
  'Housing': '#8ECAE6',
  'Insurance': '#577590',
  'Savings': '#FFD166',
  'Other': '#495057',
  'Groceries': '#1D3557',
  'Travel': '#F3722C',
  'Personal Care': '#8338EC',
  'Subscriptions': '#118AB2',
  'Repairs': '#9B2226',
  'Taxes': '#4895EF',
  'Clothing': '#FF006E',
  'Sports': '#2A9D8F'
};

// Default color for categories not in the palette
export const getDefaultColor = '#495057'; // Others / Miscellaneous color

// Function to get color for a category (with fallback)
export const getCategoryColor = (categoryName) => {
  if (!categoryName) return getDefaultColor;
  return categoryColors[categoryName] || getDefaultColor;
};

// Generate a color for a new category based on hash (for dynamic categories)
export const generateCategoryColor = (categoryName) => {
  if (categoryColors[categoryName]) {
    return categoryColors[categoryName];
  }
  
  // Generate a color based on the category name hash
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 55 + (Math.abs(hash >> 8) % 15); // 55-70%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
