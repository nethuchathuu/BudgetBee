import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown, ArrowLeft, Home } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { expensesAPI, getUserId, transformExpenseData, formatDateForAPI } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const DailySum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDateFromState = location.state?.selectedDate;
  
  const [currentDate, setCurrentDate] = useState(
    selectedDateFromState ? new Date(selectedDateFromState) : new Date()
  );
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const summaryRef = useRef(null);

  // Fetch data when component mounts or date changes
  useEffect(() => {
    fetchDailySummary(currentDate);
  }, [currentDate]);

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
  const avgItemCost = expenseData.length > 0 ? totalSpent / expenseData.length : 0;

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDF = async () => {
    try {
      const canvas = await html2canvas(summaryRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
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
          <p className="text-emerald-600 font-semibold">
            Rs. {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div ref={summaryRef} className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Home size={20} />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Daily Summary
            </h1>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
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
              <Calendar className="text-emerald-600" size={20} />
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
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
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
                  <p className="text-2xl font-bold text-gray-800">Rs. {totalSpent.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{expenseData.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg per Category</p>
                  <p className="text-2xl font-bold text-gray-800">Rs. {avgItemCost.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {!loading && expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Expense List */}
        {!loading && expenseData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Details</h3>
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
                  <span className="font-semibold text-gray-800">Rs. {item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && expenseData.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {formatDate(currentDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySum;