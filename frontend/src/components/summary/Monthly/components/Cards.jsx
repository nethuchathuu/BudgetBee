import React from 'react';

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
  // Format currency values
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toFixed(2)}`;
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
      value: `${highestWeek || 'N/A'} - ${formatCurrency(highestWeekAmount || 0)}`
    },
    {
      id: 'card-weekly-average',
      title: 'Weekly Average',
      value: formatCurrency(weeklyAverage || 0)
    },
    {
      id: 'card-highest-date',
      title: 'Highest Expense Date',
      value: `${highestDate || 'N/A'} - ${formatCurrency(highestDateAmount || 0)}`
    },
    {
      id: 'card-daily-average',
      title: 'Daily Average',
      value: formatCurrency(dailyAverage || 0)
    },
    {
      id: 'card-top-category',
      title: 'Top Category',
      value: `${topCategory || 'N/A'} - ${formatCurrency(topCategoryAmount || 0)}`
    }
  ];

  return (
    <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
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