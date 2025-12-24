import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import chartService from '../services/chartService';
import { getCategoryColor } from '../../../../utils/categoryColors';
import { useTheme } from '../../../../context/ThemeContext';

const CustomBarChart = ({ 
  data = [], 
  onBarClick = null, 
  isLoading = false,
  title = "Monthly Expenses by Category" 
}) => {
  const { theme } = useTheme();
  const config = chartService.getMonthlyBarChartConfig();
  
  // Transform category breakdown data for chart with consistent colors
  const transformedData = data.map(item => ({
    name: item.category || item.name,
    amount: item.amount || item.value,
    color: getCategoryColor(item.category || item.name),
    formattedAmount: chartService.formatCurrency(item.amount || item.value)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className={`p-3 border rounded-lg shadow-lg ${
            theme === 'dark'
              ? 'bg-[#1a1f2c] border-emerald-400/30'
              : 'bg-white border-gray-200'
          }`}
          style={chartService.getMonthlyTooltipStyles()}
        >
          <p className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{label}</p>
          <p className={`font-semibold ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Category spending
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data, index) => {
    if (onBarClick) {
      onBarClick(data, index);
    }
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-pulse flex space-x-2 w-full">
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3">
                <div className="grid grid-cols-8 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="bg-gray-200 rounded col-span-1" 
                      style={{ height: `${120 + Math.random() * 80}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className={`text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-4xl mb-2">📊</div>
            <p>No monthly data available</p>
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
          <BarChart 
            data={transformedData}
            margin={config.margin}
          >
            <CartesianGrid 
              strokeDasharray={config.cartesianGrid.strokeDasharray}
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f0f0f0'}
            />
            <XAxis 
              dataKey="name" 
              tick={{ ...config.xAxis.tick, fill: theme === 'dark' ? '#e5e7eb' : '#666' }}
              stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
              angle={config.xAxis.angle}
              textAnchor={config.xAxis.textAnchor}
              height={config.xAxis.height}
              interval={config.xAxis.interval}
            />
            <YAxis 
              tick={{ ...config.yAxis.tick, fill: theme === 'dark' ? '#e5e7eb' : '#666' }}
              stroke={theme === 'dark' ? '#374151' : '#d1d5db'}
              tickFormatter={(value) => chartService.formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              radius={config.bar.radius}
              onClick={handleBarClick}
              style={{ cursor: onBarClick ? 'pointer' : 'default' }}
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

export default CustomBarChart;