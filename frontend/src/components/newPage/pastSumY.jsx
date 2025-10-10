import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, Target, Award, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumY = ({ expenses = [], onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const summaryRef = useRef(null);

  // Sample yearly data
  const mockYearlyData = [
    { month: 'Jan', amount: 1845.50, transactions: 89, savings: 234.50, budget: 2000 },
    { month: 'Feb', amount: 1623.20, transactions: 76, savings: 376.80, budget: 2000 },
    { month: 'Mar', amount: 2189.80, transactions: 102, savings: -189.80, budget: 2000 },
    { month: 'Apr', amount: 1967.90, transactions: 94, savings: 32.10, budget: 2000 },
    { month: 'May', amount: 2234.60, transactions: 108, savings: -234.60, budget: 2000 },
    { month: 'Jun', amount: 1756.30, transactions: 83, savings: 243.70, budget: 2000 },
    { month: 'Jul', amount: 2145.80, transactions: 98, savings: -145.80, budget: 2000 },
    { month: 'Aug', amount: 1889.45, transactions: 91, savings: 110.55, budget: 2000 },
    { month: 'Sep', amount: 2067.25, transactions: 96, savings: -67.25, budget: 2000 },
    { month: 'Oct', amount: 1945.70, transactions: 88, savings: 54.30, budget: 2000 },
    { month: 'Nov', amount: 2278.90, transactions: 112, savings: -278.90, budget: 2000 },
    { month: 'Dec', amount: 2456.85, transactions: 118, savings: -456.85, budget: 2000 }
  ];

  const mockCategoryData = [
    { category: 'Groceries', amount: 8845.50, color: '#8B5CF6', percentage: 42.3, trend: 5.2 },
    { category: 'Transport', amount: 3234.00, color: '#EF4444', percentage: 15.4, trend: -2.1 },
    { category: 'Food & Drink', amount: 2887.75, color: '#F59E0B', percentage: 13.8, trend: 8.7 },
    { category: 'Entertainment', amount: 1965.00, color: '#10B981', percentage: 9.4, trend: 15.3 },
    { category: 'Utilities', amount: 1523.45, color: '#3B82F6', percentage: 7.3, trend: 3.4 },
    { category: 'Health', amount: 1089.30, color: '#EC4899', percentage: 5.2, trend: -1.8 },
    { category: 'Shopping', amount: 1355.00, color: '#F97316', percentage: 6.5, trend: 12.1 }
  ];

  // Quarterly data
  const quarterlyData = [
    { quarter: 'Q1', amount: 5658.50, avgMonthly: 1886.17, transactions: 267 },
    { quarter: 'Q2', amount: 5958.80, avgMonthly: 1986.27, transactions: 285 },
    { quarter: 'Q3', amount: 6102.50, avgMonthly: 2034.17, transactions: 285 },
    { quarter: 'Q4', amount: 6681.45, avgMonthly: 2227.15, transactions: 318 }
  ];

  const totalSpent = mockYearlyData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = mockYearlyData.reduce((sum, item) => sum + item.transactions, 0);
  const avgMonthlySpend = totalSpent / 12;
  const totalBudget = mockYearlyData.reduce((sum, item) => sum + item.budget, 0);
  const totalSavings = totalBudget - totalSpent;
  const savingsRate = (totalSavings / totalBudget) * 100;

  const navigateYear = (direction) => {
    const newYear = selectedYear + direction;
    setSelectedYear(newYear);
    if (onYearChange) onYearChange(newYear);
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

      pdf.save(`yearly-summary-${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold">
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getHighestSpendingMonth = () => {
    const highest = mockYearlyData.reduce((max, month) => 
      month.amount > max.amount ? month : max
    );
    return highest;
  };

  const getLowestSpendingMonth = () => {
    const lowest = mockYearlyData.reduce((min, month) => 
      month.amount < min.amount ? month : min
    );
    return lowest;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div ref={summaryRef} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Yearly Summary
            </h1>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          {/* Year Navigation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <button
              onClick={() => navigateYear(-1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="text-gray-600" size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {selectedYear}
              </span>
            </div>

            <button
              onClick={() => navigateYear(1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight className="text-gray-600" size={24} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">vs ${totalBudget.toFixed(2)} budget</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Savings</p>
                <p className={`text-2xl font-bold ${totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalSavings).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-1">{savingsRate.toFixed(1)}% savings rate</p>
              </div>
              <div className={`p-3 ${totalSavings >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
                {totalSavings >= 0 ? (
                  <TrendingUp className="text-green-600" size={24} />
                ) : (
                  <TrendingDown className="text-red-600" size={24} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                <p className="text-xs text-blue-600 mt-1">{(totalTransactions/12).toFixed(0)}/month avg</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Monthly Average</p>
                <p className="text-2xl font-bold text-gray-800">${avgMonthlySpend.toFixed(2)}</p>
                <p className="text-xs text-purple-600 mt-1">per month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Top Category</p>
                <p className="text-2xl font-bold text-gray-800">{mockCategoryData[0].percentage}%</p>
                <p className="text-xs text-orange-600 mt-1">{mockCategoryData[0].category}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Spending vs Budget */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Spending vs Budget
            </h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <ComposedChart data={mockYearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
                  <Bar dataKey="amount" fill="#8B5CF6" name="Spent" />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Savings"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Annual Category Distribution
            </h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
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
                    formatter={(value) => (
                      <span className="text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quarterly Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quarterly Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quarterlyData.map((quarter, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{quarter.quarter}</h4>
                  <span className="text-sm text-gray-600">{quarter.transactions} txns</span>
                </div>
                <p className="text-xl font-bold text-purple-600 mb-1">${quarter.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Avg: ${quarter.avgMonthly.toFixed(2)}/month</p>
              </div>
            ))}
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`, 
                    name === 'amount' ? 'Total Spent' : 'Monthly Average'
                  ]}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#quarterlyGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="quarterlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Spending Trend
          </h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={mockYearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fill="url(#yearlyTrendGradient)"
                />
                <defs>
                  <linearGradient id="yearlyTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Analysis with Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Category Analysis & Trends
          </h3>
          <div className="space-y-4">
            {mockCategoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <span className="font-medium text-gray-800 block">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.percentage}% of total spending</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800 block">${item.amount.toFixed(2)}</span>
                  <span className={`text-sm flex items-center gap-1 ${item.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(item.trend).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year Insights & Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Year {selectedYear} Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <TrendingUp size={16} />
                Highest Month
              </h4>
              <p className="text-blue-700">
                {getHighestSpendingMonth().month}: ${getHighestSpendingMonth().amount.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <TrendingDown size={16} />
                Lowest Month
              </h4>
              <p className="text-green-700">
                {getLowestSpendingMonth().month}: ${getLowestSpendingMonth().amount.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Award size={16} />
                Best Quarter
              </h4>
              <p className="text-purple-700">
                Q1 with lowest average: ${quarterlyData[0].avgMonthly.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Budget Status
              </h4>
              <p className={totalSavings >= 0 ? 'text-green-700' : 'text-red-700'}>
                {totalSavings >= 0 ? 'Under budget' : 'Over budget'} by ${Math.abs(totalSavings).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastSumY;