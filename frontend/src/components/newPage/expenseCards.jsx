import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ExpenseCards = ({ 
  data = [], 
  onCardClick, 
  currency = 'Rs.' 
}) => {
  const formatCurrency = (amount) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses today</h3>
          <p className="text-gray-500">Start by uploading a receipt to track your expenses</p>
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
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-white/30 flex flex-col"
            onClick={() => onCardClick?.(category.category_name)}
          >
            {/* Category Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {category.category_name}
              </h3>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(category.category_total)}
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2 max-h-48 overflow-y-auto flex-1">
              {category.products?.map((product, productIndex) => (
                <div
                  key={`${product.product_name}-${productIndex}`}
                  className="flex justify-between items-center py-2 border-b border-white/20 last:border-b-0"
                >
                  <span className="text-gray-700 text-sm font-medium flex-1 pr-2">
                    {product.product_name}
                  </span>
                  <span className="text-gray-800 font-semibold text-sm">
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