import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import chartService from '../services/chartService';
import { getCategoryColor } from '../../../../utils/categoryColors';
import { useTheme } from '../../../../context/ThemeContext';

const CustomPieChart = ({ 
  data = [], 
  onPieClick = null, 
  isLoading = false,
  title = "Spending Distribution",
  showLegend = true 
}) => {
  const { theme } = useTheme();
  const config = chartService.getPieChartConfig();
  
  // Transform data and apply consistent colors
  const transformedData = data.map(item => ({
    name: item.category || item.name,
    value: item.amount || item.value,
    color: getCategoryColor(item.category || item.name)
  }));

  const totalAmount = transformedData.reduce((sum, item) => sum + item.value, 0);

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = totalAmount > 0 ? ((payload[0].value / totalAmount) * 100).toFixed(1) : 0;
      return (
        <div 
          className={`p-3 border rounded-lg shadow-lg ${
            theme === 'dark'
              ? 'bg-[#1a1f2c] border-emerald-400/30'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{payload[0].name}</p>
          <p className={`font-semibold ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {percentage}%
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
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
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
        className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
            : 'bg-white border-gray-100 shadow-md'
        }`}
      >
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
            : 'bg-white border-gray-100 shadow-md'
        }`}
      >
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        <div className="w-full h-80 flex items-center justify-center">
          <div className={`text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-4xl mb-2">🥧</div>
            <p>No data available for chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-lg shadow-emerald-600/10'
          : 'bg-white border-gray-100 shadow-md'
      }`}
    >
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
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
      {showLegend && transformedData.length > 0 && <CustomLegend />}
    </div>
  );
};

export default CustomPieChart;