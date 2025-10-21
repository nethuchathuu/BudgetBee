import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import chartService from '../services/chartService';

const CustomPieChart = ({ 
  data = [], 
  onPieClick = null, 
  isLoading = false,
  title = "Monthly Spending Distribution",
  showLegend = true 
}) => {
  const config = chartService.getMonthlyPieChartConfig();
  const transformedData = chartService.transformDataForChart(data, 'pie');
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = chartService.calculatePercentage(payload[0].value, totalAmount);
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={chartService.getMonthlyTooltipStyles()}
        >
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm">
            {percentage}% of total spending
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

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4 max-h-20 overflow-y-auto">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-600 truncate max-w-16">{entry.value}</span>
          </div>
        ))}
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-56 h-56 bg-gray-200 rounded-full mx-auto"></div>
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🥧</div>
            <p>No monthly data available</p>
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
            {showLegend && <Legend content={<CustomLegend />} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomPieChart;