import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import chartService from '../services/chartService';
import { getCategoryColor } from '../../../../utils/categoryColors';

const CustomBarChart = ({ 
  data = [], 
  onBarClick = null, 
  isLoading = false,
  title = "Weekly Expenses by Category" 
}) => {
  const config = chartService.getWeeklyBarChartConfig();
  
  // Transform data and apply consistent colors
  const transformedData = data.map(item => ({
    category: item.category || item.name,
    amount: item.amount || item.value,
    color: getCategoryColor(item.category || item.name)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={chartService.getWeeklyTooltipStyles()}
        >
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm">
            Weekly spending
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
          <div className="animate-pulse flex space-x-2 w-full">
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3">
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className="bg-gray-200 rounded col-span-1" 
                      style={{ height: `${100 + Math.random() * 60}px` }}
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
            <div className="text-4xl mb-2">📊</div>
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
          <BarChart 
            data={transformedData}
            margin={config.margin}
          >
            <CartesianGrid 
              strokeDasharray={config.cartesianGrid.strokeDasharray}
              stroke={config.cartesianGrid.stroke}
            />
            <XAxis 
              dataKey="category" 
              tick={config.xAxis.tick}
              angle={config.xAxis.angle}
              textAnchor={config.xAxis.textAnchor}
              height={config.xAxis.height}
              interval={config.xAxis.interval}
            />
            <YAxis 
              tick={config.yAxis.tick}
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