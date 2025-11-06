import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, BarChart3 } from 'lucide-react';

const Graph = ({ data = [], onBarClick, currency = 'Rs.' }) => {
  const [activeBar, setActiveBar] = useState(null);

  // Transform data for recharts
  const chartData = data.map(item => ({
    category: item.category_name,
    amount: item.category_total,
    fullName: item.category_name
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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-emerald-600 font-bold">
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
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
            Expense Chart
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
          Expense Chart
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
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="category"
              tick={{ fontSize: 12, fill: '#666' }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              tickFormatter={formatCurrencyShort}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend/Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600">
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