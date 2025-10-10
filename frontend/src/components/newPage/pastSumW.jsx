import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumW = ({ expenses = [], onWeekChange }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const summaryRef = useRef(null);

  // Sample weekly data
  const mockWeeklyData = [
    { day: 'Mon', amount: 45.50, transactions: 3 },
    { day: 'Tue', amount: 32.20, transactions: 2 },
    { day: 'Wed', amount: 67.80, transactions: 5 },
    { day: 'Thu', amount: 23.40, transactions: 1 },
    { day: 'Fri', amount: 89.60, transactions: 6 },
    { day: 'Sat', amount: 156.30, transactions: 8 },
    { day: 'Sun', amount: 78.90, transactions: 4 }
  ];

  const mockCategoryData = [
    { category: 'Groceries', amount: 245.50, color: '#8B5CF6' },
    { category: 'Transport', amount: 84.00, color: '#EF4444' },
    { category: 'Food & Drink', amount: 143.75, color: '#F59E0B' },
    { category: 'Entertainment', amount: 75.00, color: '#10B981' },
    { category: 'Utilities', amount: 45.45, color: '#3B82F6' }
  ];

  const totalSpent = mockWeeklyData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = mockWeeklyData.reduce((sum, item) => sum + item.transactions, 0);
  const avgDailySpend = totalSpent / 7;

  const getWeekRange = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    start.setDate(diff);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction * 7));
    setSelectedWeek(newDate);
    if (onWeekChange) onWeekChange(newDate);
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
      heightLeft -= 297; // A4 height in mm

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      const weekRange = getWeekRange(selectedWeek);
      pdf.save(`weekly-summary-${weekRange.start}-to-${weekRange.end}.pdf`);
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

  const weekRange = getWeekRange(selectedWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div ref={summaryRef} className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Weekly Summary
            </h1>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="text-gray-600" size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {weekRange.start} - {weekRange.end}
              </span>
            </div>

            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight className="text-gray-600" size={24} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
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
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Daily Average</p>
                <p className="text-2xl font-bold text-gray-800">${avgDailySpend.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Highest Day</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${Math.max(...mockWeeklyData.map(item => item.amount)).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Spending Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Daily Spending Trend
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={mockWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
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
                        {value}: ${entry.payload.amount.toFixed(2)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Daily Expenses Breakdown
          </h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#weeklyGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Category Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCategoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-gray-800">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800">${item.amount.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((item.amount / mockCategoryData.reduce((sum, cat) => sum + cat.amount, 0)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Daily Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockWeeklyData.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{day.day}</h4>
                  <span className="text-sm text-gray-600">{day.transactions} transactions</span>
                </div>
                <p className="text-xl font-bold text-purple-600">${day.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastSumW;