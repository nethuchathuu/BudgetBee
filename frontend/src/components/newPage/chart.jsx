import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Shared color palette for consistent colors across chart and graph
const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'
];

const Chart = ({ data = [], onSliceClick, currency = 'Rs.' }) => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  // Transform data for recharts and calculate percentages
  const totalAmount = data.reduce((sum, item) => sum + item.category_total, 0);
  const chartData = data.map((item, index) => ({
    name: item.category_name,
    value: item.category_total,
    percentage: totalAmount > 0 ? ((item.category_total / totalAmount) * 100).toFixed(1) : 0,
    color: COLORS[index % COLORS.length]
  }));

  const formatCurrency = (value) => {
    return `${currency}${value.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${
          isDark 
            ? 'bg-[#1a1f2c] border-emerald-400/30' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>{data.name}</p>
          <p className={`font-bold ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleSliceClick = (data, index) => {
    setActiveIndex(index);
    onSliceClick?.(data.name);
  };

  if (!data || data.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg border ${
        isDark 
          ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-emerald-600/10' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-center mb-4">
          <h3 className={`text-lg font-semibold flex items-center ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            <PieChartIcon className={`h-5 w-5 mr-2 ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`} />
            Category Distribution
          </h3>
        </div>
        <div className={`h-80 flex items-center justify-center ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-center">
            <PieChartIcon className={`h-12 w-12 mx-auto mb-2 ${
              isDark ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p>No data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 shadow-lg border ${
      isDark 
        ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-emerald-600/10' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <h3 className={`text-lg font-semibold flex items-center ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          <PieChartIcon className={`h-5 w-5 mr-2 ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`} />
          Category Distribution
        </h3>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              onClick={handleSliceClick}
              className="cursor-pointer focus:outline-none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={activeIndex === index ? "#374151" : "none"}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Color Legend */}
      <div className={`mt-6 pt-4 border-t ${isDark ? 'border-emerald-400/20' : 'border-gray-100'}`}>
        <div className="grid grid-cols-2 gap-3">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleSliceClick(item, index)}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.name}
                </p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {item.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;