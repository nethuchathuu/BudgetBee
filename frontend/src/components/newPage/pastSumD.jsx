import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, Wallet, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { expensesAPI, getUserId, transformExpenseData, formatDateForAPI } from '../../services/api';

const PastSumD = ({ selectedDate, onDateChange }) => {
  const navigate = useNavigate();
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
      // Fallback to sample data with consistent colors
      setExpenseData([
        { category: 'Groceries', amount: 45.50, color: '#4A90E2' },
        { category: 'Transport', amount: 12.00, color: '#2ECC71' },
        { category: 'Food & Dining', amount: 28.75, color: '#E74C3C' },
        { category: 'Entertainment', amount: 15.00, color: '#F39C12' },
        { category: 'Utilities', amount: 85.30, color: '#9B59B6' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = expenseData.length > 0 ? 
    expenseData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
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
        backgroundColor: '#F8F9FA'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`past-daily-summary-${currentDate.toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            Rs. {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            Rs. {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading daily summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Navigation Header */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">Past Daily Summary</h1>
            
            <div></div> {/* Spacer for flexbox */}
          </div>
        </div>
        
        {/* Date Navigation & PDF Download */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-600" size={24} />
              </button>
              
              <div className="flex items-center gap-2">
                <Calendar style={{ color: '#4A90E2' }} size={20} />
                <span className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="text-gray-600" size={24} />
              </button>
            </div>

            {/* PDF Download */}
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Summary Cards - 2 Cards for Daily */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Spent Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
                <Wallet style={{ color: '#4A90E2' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Total Spent
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {totalSpent.toFixed(2)}
            </p>
          </div>

          {/* Top Category Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E8F5E8' }}>
                <Tag style={{ color: '#2ECC71' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Top Category
            </h3>
            <p className="text-lg font-bold text-gray-800">{topCategory.category}</p>
            <p className="text-sm text-gray-600">Rs. {topCategory.amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts Section */}
        {expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Daily Expenses by Category
              </h3>
              <div style={{ width: '100%', height: 320 }}>
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
                      fill="#4A90E2"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Daily Spending Distribution
              </h3>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="amount"
                      nameKey="category"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {expenseData.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for this date</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastSumD;