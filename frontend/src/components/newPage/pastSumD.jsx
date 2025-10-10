import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { expensesAPI, getUserId, transformExpenseData, formatDateForAPI } from '../../services/api';

const PastSumD = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const summaryRef = useRef(null);

  // Fetch data when component mounts or date changes
  useEffect(() => {
    fetchDailySummary(currentDate);
  }, [currentDate]);

  // Update currentDate when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchDailySummary = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const formattedDate = formatDateForAPI(date);
      
      const response = await expensesAPI.getSelectedDateSummary(userId, formattedDate);
      const transformedData = transformExpenseData(response);
      setExpenseData(transformedData);
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      setError(err.message);
      // Fallback to sample data
      setExpenseData([
        { category: 'Groceries', amount: 45.50, color: '#8B5CF6' },
        { category: 'Transport', amount: 12.00, color: '#EF4444' },
        { category: 'Food & Drink', amount: 28.75, color: '#F59E0B' },
        { category: 'Entertainment', amount: 15.00, color: '#10B981' },
        { category: 'Utilities', amount: 85.30, color: '#3B82F6' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const categoriesCount = expenseData.length;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
    if (onDateChange) onDateChange(newDate);
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
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`daily-summary-${currentDate.toISOString().split('T')[0]}.pdf`);
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
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div ref={summaryRef} className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Daily Summary
            </h1>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="text-gray-600" size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {formatDate(currentDate)}
              </span>
            </div>

            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight className="text-gray-600" size={24} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="text-sm">⚠️ {error}. Showing sample data.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading daily summary...</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Categories</p>
                  <p className="text-2xl font-bold text-gray-800">{categoriesCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Highest Expense</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${expenseData.length > 0 ? Math.max(...expenseData.map(item => item.amount)).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {!loading && expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Expenses by Category
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Spending Distribution
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {expenseData.map((entry, index) => (
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
        )}

        {/* No Data Message */}
        {!loading && expenseData.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {formatDate(currentDate)}</p>
          </div>
        )}

        {/* Detailed Breakdown */}
        {!loading && expenseData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Detailed Breakdown
            </h3>
            <div className="space-y-3">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                      ({((item.amount / totalSpent) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastSumD;