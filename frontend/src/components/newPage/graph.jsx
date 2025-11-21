import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Shared color palette - same as Chart component
const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'
];

const Graph = ({ data = [], onBarClick, currency = 'Rs.' }) => {
  const { isDark } = useTheme();
  const [activeBar, setActiveBar] = useState(null);

  // Transform data for recharts with matching colors
  const chartData = data.map((item, index) => ({
    category: item.category_name,
    amount: item.category_total,
    fullName: item.category_name,
    color: COLORS[index % COLORS.length]
  }));

  const formatCurrency = (value) => {
    return `${currency}${value.toFixed(2)}`;
  };

  const formatCurrencyShort = (value) => {
    if (value >= 1000) {
      return `${currency}${(value / 1000).toFixed(1)}k`;
    }
    return `${currency}${value.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${
          isDark 
            ? 'bg-[#1a1f2c] border-emerald-400/30' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>{label}</p>
          <p className={`font-bold ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data, index) => {
    setActiveBar(index);
    onBarClick?.(data.category);
  };

  const downloadChart = () => {
    // Basic implementation - could be enhanced with html2canvas
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Category,Amount\n"
      + chartData.map(row => `${row.category},${row.amount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return (
      <div className={`rounded-2xl p-6 shadow-lg border ${
        isDark 
          ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-emerald-600/10' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold flex items-center ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            <BarChart3 className={`h-5 w-5 mr-2 ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`} />
            Expense Chart
          </h3>
        </div>
        <div className={`h-64 flex items-center justify-center ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-center">
            <BarChart3 className={`h-12 w-12 mx-auto mb-2 ${
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
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold flex items-center ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          <BarChart3 className={`h-5 w-5 mr-2 ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`} />
          Expense Chart
        </h3>
        <button
          onClick={downloadChart}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-[#0c111c] hover:bg-[#0a0f1a] text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title="Download chart data"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm">Export</span>
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0'} 
            />
            <XAxis 
              dataKey="category"
              tick={{ fontSize: 12, fill: isDark ? '#e5e7eb' : '#666' }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              stroke={isDark ? '#374151' : '#d1d5db'}
            />
            <YAxis 
              tickFormatter={formatCurrencyShort}
              tick={{ fontSize: 12, fill: isDark ? '#e5e7eb' : '#666' }}
              stroke={isDark ? '#374151' : '#d1d5db'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  opacity={activeBar === index ? 0.8 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend/Summary */}
      <div className={`mt-4 pt-4 border-t ${
        isDark ? 'border-emerald-400/20' : 'border-gray-100'
      }`}>
        <div className={`flex justify-between text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>Categories: {data.length}</span>
          <span>
            Total: {formatCurrency(data.reduce((sum, item) => sum + item.category_total, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Graph;