import React from 'react';
import { useTheme } from '../../../../context/ThemeContext';

const Cards = ({ 
  totalSpent,
  highestMonth,
  highestMonthAmount,
  monthlyAverage,
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
  
  // Safe number conversion
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Format currency values
  const formatCurrency = (amount) => {
    const num = safeNumber(amount);
    return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const cardData = [
    {
      id: 'card-total-spent',
      title: 'Total Spent',
      value: formatCurrency(totalSpent)
    },
    {
      id: 'card-highest-month',
      title: 'Highest Expense Month',
      value: highestMonth && highestMonth !== 'N/A' 
        ? `${highestMonth} - ${formatCurrency(highestMonthAmount)}` 
        : 'N/A'
    },
    {
      id: 'card-monthly-average',
      title: 'Monthly Average',
      value: formatCurrency(monthlyAverage)
    },
    {
      id: 'card-highest-week',
      title: 'Highest Expense Week',
      value: highestWeek && highestWeek !== 'N/A' 
        ? `${highestWeek} - ${formatCurrency(highestWeekAmount)}` 
        : 'N/A'
    },
    {
      id: 'card-weekly-average',
      title: 'Weekly Average',
      value: formatCurrency(weeklyAverage)
    },
    {
      id: 'card-highest-date',
      title: 'Highest Expense Date',
      value: highestDate && highestDate !== 'N/A' 
        ? `${formatDate(highestDate)} - ${formatCurrency(highestDateAmount)}` 
        : 'N/A'
    },
    {
      id: 'card-daily-average',
      title: 'Daily Average',
      value: formatCurrency(dailyAverage)
    },
    {
      id: 'card-top-category',
      title: 'Top Category',
      value: topCategory && topCategory !== 'N/A' 
        ? `${topCategory} - ${formatCurrency(topCategoryAmount)}` 
        : 'N/A'
    }
  ];

  return (
    <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
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