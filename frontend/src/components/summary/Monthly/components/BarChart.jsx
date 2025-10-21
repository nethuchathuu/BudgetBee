import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import chartService from '../services/chartService';

const CustomBarChart = ({ 
  data = [], 
  onBarClick = null, 
  isLoading = false,
  title = "Monthly Expenses by Category" 
}) => {
  const config = chartService.getMonthlyBarChartConfig();
  const transformedData = chartService.transformDataForChart(data, 'bar');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
          style={chartService.getMonthlyTooltipStyles()}
        >
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            {chartService.formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500 text-sm">
            Monthly spending
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
            <div className="text-4xl mb-2">📊</div>
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
              fill={config.bar.fill}
              radius={config.bar.radius}
              onClick={handleBarClick}
              style={{ cursor: onBarClick ? 'pointer' : 'default' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomBarChart;