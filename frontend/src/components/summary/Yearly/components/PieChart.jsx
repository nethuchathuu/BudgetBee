import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const YearlyPieChart = ({ 
  data = [], 
  isLoading = false, 
  title = "Yearly Spending Distribution" 
}) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (amount) => {
        if (amount >= 1000000) {
          return `Rs. ${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
          return `Rs. ${(amount / 1000).toFixed(1)}K`;
        }
        return `Rs. ${Number(amount).toFixed(2)}`;
      };

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6" style={{ 
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
        borderRadius: '15px' 
      }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-80 bg-gray-200 rounded-full mx-auto" style={{ width: '320px', height: '320px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6" style={{ 
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
      borderRadius: '15px' 
    }}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={140}
              dataKey="amount"
              nameKey="category"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyPieChart;
