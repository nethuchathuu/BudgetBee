import React from 'react';
import { useTheme } from '../../../../context/ThemeContext';

const Cards = ({ totalSpent, topCategory, topAmount }) => {
  const { theme } = useTheme();
  // Safe number parser - handles undefined, null, NaN, and non-numeric values
  const safeNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    const parsed = parseFloat(String(value || '0').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Format currency values with safe number parsing
  const formatCurrency = (amount) => {
    const safeAmount = safeNumber(amount);
    return `Rs. ${safeAmount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const cardData = [
    {
      id: 'card-total-spent',
      title: 'Total Spent',
      value: formatCurrency(totalSpent)
    },
    {
      id: 'card-highest-category',
      title: 'Highest Expense Category',
      value: `${topCategory || 'N/A'} - ${formatCurrency(topAmount)}`
    }
  ];

  return (
    <div className="cards-container flex flex-wrap gap-4 justify-center items-center p-4">
      {cardData.map((card) => (
        <div 
          key={card.id}
          className={`rounded-xl p-6 text-center transition-all duration-200 border ${
            theme === 'dark'
              ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
          style={{ 
            minWidth: '200px',
            flex: '1'
          }}
        >
          <h3 
            className={`text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {card.title}
          </h3>
          <p 
            className={`font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
            style={{ fontSize: '1.2rem' }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;