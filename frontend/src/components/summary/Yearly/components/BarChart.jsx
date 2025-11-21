import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCategoryColor } from '../../../../utils/categoryColors';
import { useTheme } from '../../../../context/ThemeContext';

const YearlyBarChart = ({ 
  data = [], 
  isLoading = false, 
  title = "Expenses by Category" 
}) => {
  const { theme } = useTheme();
  
  // Transform data to ensure it has the right structure with consistent colors
  // categoryBreakdown: {category, amount, color}
  const transformedData = data.map(item => ({
    name: item.category || item.name,
    amount: Number(item.amount || 0),
    color: getCategoryColor(item.category || item.name)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (amount) => {
        const num = Number(amount);
        return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };

      return (
        <div className={`p-3 border rounded-lg shadow-lg ${
          theme === 'dark'
            ? 'bg-[#1a1f2c] border-emerald-400/30'
            : 'bg-white border-gray-200'
        }`}>
          <p className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{label}</p>
          <p className={`font-semibold ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
          : 'bg-white border-gray-100 shadow-md'
      }`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border ${
      theme === 'dark'
        ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
        : 'bg-white border-gray-100 shadow-md'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f0f0f0'} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: theme === 'dark' ? '#e5e7eb' : '#666' }}
              stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#e5e7eb' : '#666' }}
              stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyBarChart;
