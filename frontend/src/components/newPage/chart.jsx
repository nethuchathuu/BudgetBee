import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, Download } from 'lucide-react';

const Chart = ({ data = [], onSliceClick, currency = '$' }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Color palette for pie chart
  const COLORS = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
    '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'
  ];

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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-emerald-600 font-bold">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="mt-4 max-h-32 overflow-y-auto">
        <div className="grid grid-cols-1 gap-1">
          {payload.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => onSliceClick?.(entry.payload.name)}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-700 truncate">
                  {entry.payload.name}
                </span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {formatCurrency(entry.payload.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSliceClick = (data, index) => {
    setActiveIndex(index);
    onSliceClick?.(data.name);
  };

  const downloadChart = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Category,Amount,Percentage\n"
      + chartData.map(row => `${row.name},${row.value},${row.percentage}%`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_pie_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2 text-emerald-600" />
            Category Distribution
          </h3>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <PieChartIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-emerald-600" />
          Category Distribution
        </h3>
        <button
          onClick={downloadChart}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Download chart data"
        >
          <Download className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">Export</span>
        </button>
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

      {/* Custom Legend */}
      <CustomLegend payload={chartData} />

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Expenses</div>
          <div className="text-xl font-bold text-gray-800">
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;