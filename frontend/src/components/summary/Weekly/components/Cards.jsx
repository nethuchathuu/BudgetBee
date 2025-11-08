import React from 'react';

const Cards = ({ 
  totalSpent, 
  dailyAverage, 
  highestDay, 
  highestDayAmount, 
  topCategory, 
  topCategoryAmount 
}) => {
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
      id: 'card-daily-average',
      title: 'Daily Average',
      value: formatCurrency(dailyAverage || 0)
    },
    {
      id: 'card-highest-day',
      title: 'Highest Expense Day',
      value: highestDay ? `${formatDate(highestDay)} - ${formatCurrency(highestDayAmount || 0)}` : 'N/A'
    },
    {
      id: 'card-top-category',
      title: 'Top Category',
      value: topCategory ? `${topCategory} - ${formatCurrency(topCategoryAmount || 0)}` : 'N/A'
    }
  ];

  return (
    <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {cardData.map((card) => (
        <div 
          key={card.id}
          className="bg-white rounded-xl p-6 text-center transition-all duration-200" 
          style={{ 
            backgroundColor: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            fontWeight: '600',
            color: '#1e293b'
          }}
        >
          <h3 
            className="text-gray-600 text-sm font-semibold mb-2" 
            style={{ fontWeight: '600' }}
          >
            {card.title}
          </h3>
          <p 
            className="font-bold text-gray-800" 
            style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;