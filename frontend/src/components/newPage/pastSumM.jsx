import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, Target } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumM = ({ expenses = [], onMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const summaryRef = useRef(null);

  // Sample monthly data
  const mockMonthlyData = [
    { week: 'Week 1', amount: 345.50, transactions: 23, avgDaily: 49.36 },
    { week: 'Week 2', amount: 423.20, transactions: 31, avgDaily: 60.46 },
    { week: 'Week 3', amount: 389.80, transactions: 28, avgDaily: 55.69 },
    { week: 'Week 4', amount: 467.90, transactions: 35, avgDaily: 66.84 },
    { week: 'Week 5', amount: 234.60, transactions: 18, avgDaily: 78.20 } // Partial week
  ];

  const mockCategoryData = [
    { category: 'Groceries', amount: 845.50, color: '#8B5CF6', percentage: 42.3 },
    { category: 'Transport', amount: 234.00, color: '#EF4444', percentage: 11.7 },
    { category: 'Food & Drink', amount: 387.75, color: '#F59E0B', percentage: 19.4 },
    { category: 'Entertainment', amount: 165.00, color: '#10B981', percentage: 8.3 },
    { category: 'Utilities', amount: 123.45, color: '#3B82F6', percentage: 6.2 },
    { category: 'Health', amount: 89.30, color: '#EC4899', percentage: 4.5 },
    { category: 'Shopping', amount: 155.00, color: '#F97316', percentage: 7.8 }
  ];

  // Monthly comparison data (current vs previous month)
  const comparisonData = [
    { category: 'Groceries', current: 845.50, previous: 789.20, change: 7.1 },
    { category: 'Transport', current: 234.00, previous: 267.80, change: -12.6 },
    { category: 'Food & Drink', current: 387.75, previous: 423.60, change: -8.5 },
    { category: 'Entertainment', current: 165.00, previous: 134.20, change: 23.0 },
    { category: 'Utilities', current: 123.45, previous: 119.80, change: 3.0 }
  ];

  const totalSpent = mockMonthlyData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = mockMonthlyData.reduce((sum, item) => sum + item.transactions, 0);
  const avgWeeklySpend = totalSpent / mockMonthlyData.length;
  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  const avgDailySpend = totalSpent / daysInMonth;

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + direction);
    setSelectedMonth(newDate);
    if (onMonthChange) onMonthChange(newDate);
  };

  const generatePDF = async () => {
    if (!summaryRef.current) return;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add multiple pages if content is too long
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`monthly-summary-${formatMonth(selectedMonth).replace(' ', '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-purple-600 font-semibold">
            ${payload[0].value.toFixed(2)}
          </p>
          {payload[0].payload.transactions && (
            <p className="text-gray-600 text-sm">
              {payload[0].payload.transactions} transactions
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div ref={summaryRef} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Monthly Summary
            </h1>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="text-gray-600" size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {formatMonth(selectedMonth)}
              </span>
            </div>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight className="text-gray-600" size={24} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                <p className="text-xs text-blue-600 mt-1">-2.1% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Weekly Average</p>
                <p className="text-2xl font-bold text-gray-800">${avgWeeklySpend.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">+8.7% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Daily Average</p>
                <p className="text-2xl font-bold text-gray-800">${avgDailySpend.toFixed(2)}</p>
                <p className="text-xs text-orange-600 mt-1">+3.4% from last month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Spending Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Weekly Spending Trend
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    fill="url(#monthlyGradient)"
                  />
                  <defs>
                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Category Distribution
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="amount"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly vs Previous Month Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Month-over-Month Comparison
          </h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`, 
                    name === 'current' ? 'Current Month' : 'Previous Month'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="current" 
                  fill="#8B5CF6" 
                  name="Current Month"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="previous" 
                  fill="#D1D5DB" 
                  name="Previous Month"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Weekly Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {mockMonthlyData.map((week, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{week.week}</h4>
                  <span className="text-sm text-gray-600">{week.transactions} txns</span>
                </div>
                <p className="text-xl font-bold text-purple-600 mb-1">${week.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Avg: ${week.avgDaily.toFixed(2)}/day</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Details with Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Category Analysis
          </h3>
          <div className="space-y-4">
            {mockCategoryData.map((item, index) => {
              const comparison = comparisonData.find(comp => comp.category === item.category);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <span className="font-medium text-gray-800 block">{item.category}</span>
                      <span className="text-sm text-gray-500">{item.percentage}% of total</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800 block">${item.amount.toFixed(2)}</span>
                    {comparison && (
                      <span className={`text-sm ${comparison.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {comparison.change >= 0 ? '+' : ''}{comparison.change.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Highest Spending Week</h4>
              <p className="text-blue-700">Week 4 with ${Math.max(...mockMonthlyData.map(w => w.amount)).toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Most Active Week</h4>
              <p className="text-green-700">Week 4 with {Math.max(...mockMonthlyData.map(w => w.transactions))} transactions</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Top Category</h4>
              <p className="text-purple-700">Groceries at {mockCategoryData[0].percentage}% of spending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastSumM;