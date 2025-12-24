import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ExpenseCards = ({ 
  data = [], 
  onCardClick, 
  currency = 'Rs.' 
}) => {
  const { isDark } = useTheme();
  const formatCurrency = (amount) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center py-12 backdrop-blur-sm border rounded-2xl ${
          isDark 
            ? 'bg-[#1a1f2c]/80 border-emerald-400/30' 
            : 'bg-white/20 border-white/30'
        }`}>
          <ShoppingCart className={`h-16 w-16 mx-auto mb-4 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>No expenses today</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Start by uploading a receipt to track your expenses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Cards Grid Container - Automatically wraps into multiple rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {data.map((category, index) => (
          <div
            key={`${category.category_name}-${index}`}
            className={`backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col ${
              isDark
                ? 'bg-[#1a1f2c]/80 border-emerald-400/20 hover:bg-[#1a1f2c] hover:border-emerald-400/40 hover:shadow-emerald-600/10'
                : 'bg-white/20 border-white/30 hover:bg-white/30'
            }`}
            onClick={() => onCardClick?.(category.category_name)}
          >
            {/* Category Header */}
            <div className="mb-4">
              <h3 className={`text-lg font-bold mb-1 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {category.category_name}
              </h3>
              <div className={`text-2xl font-bold ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                {formatCurrency(category.category_total)}
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2 max-h-48 overflow-y-auto flex-1">
              {category.products?.map((product, productIndex) => (
                <div
                  key={`${product.product_name}-${productIndex}`}
                  className={`flex justify-between items-center py-2 border-b last:border-b-0 ${
                    isDark ? 'border-emerald-400/10' : 'border-white/20'
                  }`}
                >
                  <span className={`text-sm font-medium flex-1 pr-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {product.product_name}
                  </span>
                  <span className={`font-semibold text-sm ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {formatCurrency(product.product_total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCards;