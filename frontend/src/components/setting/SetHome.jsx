import React, { useState, useEffect } from 'react';
import { Home, Calendar, BarChart2, TrendingUp, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const dashboardOptions = [
  {
    id: 'daily',
    name: 'Daily Summary',
    icon: Calendar,
    description: 'View your expenses day by day',
    color: 'text-blue-500'
  },
  {
    id: 'weekly',
    name: 'Weekly Summary',
    icon: BarChart2,
    description: 'See your weekly spending patterns',
    color: 'text-purple-500'
  },
  {
    id: 'monthly',
    name: 'Monthly Summary',
    icon: TrendingUp,
    description: 'Track your monthly budget',
    color: 'text-green-500'
  },
  {
    id: 'yearly',
    name: 'Yearly Summary',
    icon: TrendingUp,
    description: 'Overview of your annual expenses',
    color: 'text-orange-500'
  }
];

export default function SetHome() {
  const { isDark } = useTheme();
  const [selectedDashboard, setSelectedDashboard] = useState(() => {
    return localStorage.getItem('budgetbee-default-dashboard') || 'daily';
  });

  useEffect(() => {
    localStorage.setItem('budgetbee-default-dashboard', selectedDashboard);
  }, [selectedDashboard]);

  return (
    <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Home className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Set Default Dashboard
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose which summary view you want to see first
          </p>
        </div>
      </div>

      {/* Dashboard Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {dashboardOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedDashboard === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedDashboard(option.id)}
              className={`
                relative p-6 rounded-xl cursor-pointer transition-all border-2
                ${isSelected
                  ? 'ring-4 ring-emerald-400 border-emerald-400 shadow-xl'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
                }
                ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}
              `}
            >
              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-emerald-400 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-[#1a1f2c]' : 'bg-white'}`}>
                  <Icon className={`h-8 w-8 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {option.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Selection Info */}
      <div className={`
        p-6 rounded-lg border-2
        ${isDark
          ? 'bg-[#0c111c] border-emerald-400/30'
          : 'bg-emerald-50 border-emerald-200'
        }
      `}>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400 rounded-full p-2">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Default Dashboard: {dashboardOptions.find(opt => opt.id === selectedDashboard)?.name}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              This view will be shown when you navigate to the home page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
