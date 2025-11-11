import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryColor } from '../../../../utils/categoryColors';

const YearlyPieChart = ({ 
  data = [], 
  isLoading = false, 
  title = "Yearly Spending Distribution",
  showLegend = true 
}) => {
  // Transform data and apply consistent colors
  const transformedData = data.map(item => ({
    name: item.category || item.name,
    value: item.amount || item.value,
    color: getCategoryColor(item.category || item.name)
  }));

  const totalAmount = transformedData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (amount) => {
        const num = Number(amount);
        return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };

      const percentage = totalAmount > 0 ? ((payload[0].value / totalAmount) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm">
            {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend Component
  const CustomLegend = () => {
    return (
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {transformedData.map((entry, index) => {
          const percentage = totalAmount > 0 ? ((entry.value / totalAmount) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-700">
                {entry.name} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
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
              data={transformedData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={140}
              dataKey="value"
              nameKey="name"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && transformedData.length > 0 && <CustomLegend />}
    </div>
  );
};

export default YearlyPieChart;
