import React from 'react';

const Cards = ({ totalSpent, topCategory, topAmount }) => {
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
          className="bg-white rounded-xl p-6 text-center transition-all duration-200" 
          style={{ 
            backgroundColor: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            fontWeight: '600',
            color: '#1e293b',
            minWidth: '200px',
            flex: '1'
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