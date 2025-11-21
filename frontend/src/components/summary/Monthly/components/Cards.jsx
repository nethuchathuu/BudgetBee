import React from 'react';
import { useTheme } from '../../../../context/ThemeContext';

const Cards = ({ 
  totalSpent,
  highestWeek,
  highestWeekAmount,
  weeklyAverage,
  highestDate,
  highestDateAmount,
  dailyAverage,
  topCategory,
  topCategoryAmount
}) => {
  const { theme } = useTheme();
  
  // Safe number conversion to prevent NaN
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Format currency values
  const formatCurrency = (amount) => {
    const safe = safeNumber(amount);
    return `Rs. ${safe.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const cardData = [
    {
      id: 'card-total-spent',
      title: 'Total Spent',
      value: formatCurrency(totalSpent || 0)
    },
    {
      id: 'card-highest-week',
      title: 'Highest Expense Week',
      value: highestWeek ? `Week ${highestWeek} - ${formatCurrency(highestWeekAmount || 0)}` : 'N/A'
    },
    {
      id: 'card-weekly-average',
      title: 'Weekly Average',
      value: formatCurrency(weeklyAverage || 0)
    },
    {
      id: 'card-highest-date',
      title: 'Highest Expense Date',
      value: highestDate ? `${formatDate(highestDate)} - ${formatCurrency(highestDateAmount || 0)}` : 'N/A'
    },
    {
      id: 'card-daily-average',
      title: 'Daily Average',
      value: formatCurrency(dailyAverage || 0)
    },
    {
      id: 'card-top-category',
      title: 'Top Category',
      value: topCategory ? `${topCategory} - ${formatCurrency(topCategoryAmount || 0)}` : 'N/A'
    }
  ];

  return (
    <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cardData.map((card) => (
        <div 
          key={card.id}
          className={`rounded-xl p-6 text-center transition-all duration-200 border ${
            theme === 'dark'
              ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
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