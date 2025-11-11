import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import chartService from '../services/chartService';
import { getCategoryColor } from '../../../../utils/categoryColors';

const CustomPieChart = ({ 
  data = [], 
  onPieClick = null, 
  isLoading = false,
  title = "Weekly Spending Distribution",
  showLegend = true 
}) => {
  const config = chartService.getWeeklyPieChartConfig();
  
  // Transform data and apply consistent colors
  const transformedData = data.map(item => ({
    name: item.category || item.name,
    value: item.amount || item.value,
    color: getCategoryColor(item.category || item.name)
  }));
  
  const totalAmount = transformedData.reduce((sum, item) => sum + item.value, 0);

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = chartService.calculatePercentage(payload[0].value, totalAmount);
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={chartService.getWeeklyTooltipStyles()}
        >
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm">
            {percentage}% of weekly spending
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data, index) => {
    if (onPieClick) {
      onPieClick(data, index);
    }
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
      <div 
        className="bg-white rounded-xl p-6" 
        style={{ 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
          borderRadius: '15px' 
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h3>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-44 h-44 bg-gray-200 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="bg-white rounded-xl p-6" 
        style={{ 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
          borderRadius: '15px' 
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h3>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🥧</div>
            <p>No weekly data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl p-6" 
      style={{ 
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
        borderRadius: '15px' 
      }}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      <div style={chartService.getResponsiveProps()}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={transformedData}
              cx={config.cx}
              cy={config.cy}
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              dataKey="value"
              nameKey="name"
              stroke={config.stroke}
              strokeWidth={config.strokeWidth}
              onClick={handlePieClick}
              style={{ cursor: onPieClick ? 'pointer' : 'default' }}
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && transformedData.length > 0 && <CustomLegend />}

      {/* Weekly Summary Below Chart */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center border-t pt-4">
        <div>
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="font-semibold text-gray-800">{transformedData.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Weekly Total</p>
          <p className="font-semibold text-gray-800">{chartService.formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;