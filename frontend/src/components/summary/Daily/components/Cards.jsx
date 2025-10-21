import React from 'react';
import { Wallet, Tag, TrendingUp, ShoppingCart } from 'lucide-react';
import dataService from '../services/dataService';

const Cards = ({ expenseData, isLoading = false }) => {
  const totalSpent = dataService.calculateTotalSpent(expenseData);
  const topCategory = dataService.getTopCategory(expenseData);
  const expenseCount = expenseData.length;
  const averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;

  const cardData = [
    {
      title: 'Total Spent',
      value: `Rs. ${totalSpent.toFixed(2)}`,
      icon: Wallet,
      iconBg: '#E3F2FD',
      iconColor: '#4A90E2'
    },
    {
      title: 'Top Category',
      value: topCategory.category,
      subtitle: `Rs. ${topCategory.amount.toFixed(2)}`,
      icon: Tag,
      iconBg: '#E8F5E8',
      iconColor: '#2ECC71'
    },
    {
      title: 'Transactions',
      value: expenseCount.toString(),
      subtitle: 'Total expenses',
      icon: ShoppingCart,
      iconBg: '#FFF3E0',
      iconColor: '#F39C12'
    },
    {
      title: 'Average',
      value: `Rs. ${averageExpense.toFixed(2)}`,
      subtitle: 'Per transaction',
      icon: TrendingUp,
      iconBg: '#F3E5F5',
      iconColor: '#9B59B6'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 text-center animate-pulse" 
            style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200" 
            style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: card.iconBg }}
              >
                <IconComponent 
                  style={{ color: card.iconColor }} 
                  size={24} 
                />
              </div>
            </div>
            <h3 
              className="text-gray-600 text-sm font-semibold mb-2" 
              style={{ fontWeight: '600' }}
            >
              {card.title}
            </h3>
            <p 
              className="font-bold text-gray-800" 
              style={{ fontSize: '1.2rem' }}
            >
              {card.value}
            </p>
            {card.subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {card.subtitle}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Cards;