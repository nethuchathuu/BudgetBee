import React from 'react';
import { Wallet, Tag, TrendingUp, BarChart3 } from 'lucide-react';
import dataService from '../services/dataService';
import chartService from '../services/chartService';

const Cards = ({ expenseData, currentWeek, isLoading = false }) => {
  const insights = dataService.getWeeklyInsights(expenseData, currentWeek);

  const cardData = [
    {
      title: 'Total Spent',
      value: chartService.formatCurrency(insights.totalSpent),
      subtitle: 'This week',
      icon: Wallet,
      iconBg: '#E3F2FD',
      iconColor: '#4A90E2'
    },
    {
      title: 'Top Category',
      value: insights.topCategory.category,
      subtitle: chartService.formatCurrency(insights.topCategory.amount),
      icon: Tag,
      iconBg: '#E8F5E8',
      iconColor: '#2ECC71'
    },
    {
      title: 'Categories',
      value: insights.categoriesCount.toString(),
      subtitle: 'Used this week',
      icon: BarChart3,
      iconBg: '#FFF3E0',
      iconColor: '#F39C12'
    },
    {
      title: 'Daily Average',
      value: chartService.formatCurrency(insights.dailyAverage),
      subtitle: 'Over 7 days',
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
            <div className="h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
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