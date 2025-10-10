import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const ExpenseCards = ({ 
  data = [], 
  onCardClick, 
  scrollRef, 
  showArrows = true,
  currency = '$' 
}) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [data]);

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.firstElementChild?.offsetWidth + 16; // card width + gap
      containerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.firstElementChild?.offsetWidth + 16; // card width + gap
      containerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

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
      <div className="relative">
        {/* Left Arrow */}
        {showArrows && canScrollLeft && (
          <button
            onClick={scrollLeft}
            aria-label="scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Right Arrow */}
        {showArrows && canScrollRight && (
          <button
            onClick={scrollRight}
            aria-label="scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Cards Container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.map((category, index) => (
            <div
              key={`${category.category_name}-${index}`}
              className="flex-none w-80 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-white/30"
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
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
    </div>
  );
};

export default ExpenseCards;