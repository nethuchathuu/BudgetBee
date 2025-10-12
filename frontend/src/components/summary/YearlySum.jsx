import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const YearlySum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryRef = useRef(null);
  
  const [currentYear, setCurrentYear] = useState(
    location.state?.selectedYear || new Date().getFullYear()
  );
  const [expenseData, setExpenseData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data - replace with API call
  useEffect(() => {
    fetchYearlySummary(currentYear);
  }, [currentYear]);

  const fetchYearlySummary = async (year) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample data
      const sampleData = [
        { category: 'Groceries', amount: 15675.50, color: '#10B981' },
        { category: 'Transport', amount: 8456.75, color: '#EF4444' },
        { category: 'Food & Dining', amount: 12789.25, color: '#F59E0B' },
        { category: 'Entertainment', amount: 7567.00, color: '#8B5CF6' },
        { category: 'Utilities', amount: 28340.80, color: '#3B82F6' },
        { category: 'Shopping', amount: 11234.60, color: '#EC4899' },
        { category: 'Healthcare', amount: 5234.90, color: '#14B8A6' },
        { category: 'Education', amount: 18000.00, color: '#F97316' },
        { category: 'Insurance', amount: 24000.00, color: '#6366F1' },
        { category: 'Travel', amount: 9876.50, color: '#84CC16' }
      ];

      // Monthly trend data
      const monthlyData = [
        { month: 'Jan', amount: 12245.50 },
        { month: 'Feb', amount: 10567.25 },
        { month: 'Mar', amount: 14890.75 },
        { month: 'Apr', amount: 13245.30 },
        { month: 'May', amount: 11678.90 },
        { month: 'Jun', amount: 15234.80 },
        { month: 'Jul', amount: 16789.40 },
        { month: 'Aug', amount: 14567.20 },
        { month: 'Sep', amount: 13456.70 },
        { month: 'Oct', amount: 15678.90 },
        { month: 'Nov', amount: 17234.50 },
        { month: 'Dec', amount: 18567.80 }
      ];
      
      setExpenseData(sampleData);
      setMonthlyTrend(monthlyData);
    } catch (err) {
      console.error('Error fetching yearly summary:', err);
      setError(err.message);
      setExpenseData([]);
      setMonthlyTrend([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const categoriesCount = expenseData.length;
  const monthlyAverage = monthlyTrend.length > 0 ? 
    monthlyTrend.reduce((sum, month) => sum + month.amount, 0) / monthlyTrend.length : 0;

  const navigateYear = (direction) => {
    setCurrentYear(currentYear + direction);
  };

  const goBackToHome = () => {
    navigate('/home');
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
      pdf.save(`yearly-summary-${currentYear}.pdf`);
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
            Rs. {payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div ref={summaryRef} className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goBackToHome}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Home</span>
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Yearly Summary
              </h1>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
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
              <Calendar className="text-emerald-600" size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {currentYear}
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
              <span className="text-gray-600">Loading yearly summary...</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rs. {totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
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
                  <p className="text-gray-600 text-sm font-medium">Monthly Average</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rs. {monthlyAverage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-800">
                    Rs. {(totalSpent / 365).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trend Chart */}
        {!loading && monthlyTrend.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Spending Trend
            </h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
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
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.8}/>
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
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="amount"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`Rs. ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Amount']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontSize: '12px' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Top Categories */}
        {!loading && expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Top 5 Categories
              </h3>
              <div className="space-y-3">
                {expenseData
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-600 font-bold text-lg w-6">
                          #{index + 1}
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-800">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800">
                          Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({((item.amount / totalSpent) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Monthly Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Monthly Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Highest Month</span>
                  <span className="font-semibold text-gray-800">
                    {monthlyTrend.length > 0 ? 
                      monthlyTrend.reduce((prev, current) => (prev.amount > current.amount) ? prev : current).month 
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Lowest Month</span>
                  <span className="font-semibold text-gray-800">
                    {monthlyTrend.length > 0 ? 
                      monthlyTrend.reduce((prev, current) => (prev.amount < current.amount) ? prev : current).month 
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Highest Amount</span>
                  <span className="font-semibold text-gray-800">
                    Rs. {monthlyTrend.length > 0 ? 
                      Math.max(...monthlyTrend.map(month => month.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '0.00'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Lowest Amount</span>
                  <span className="font-semibold text-gray-800">
                    Rs. {monthlyTrend.length > 0 ? 
                      Math.min(...monthlyTrend.map(month => month.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '0.00'
                    }
                  </span>
                </div>
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
            <p className="text-gray-500">No expenses recorded for {currentYear}</p>
          </div>
        )}

        {/* Detailed Breakdown */}
        {!loading && expenseData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Complete Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expenseData.sort((a, b) => b.amount - a.amount).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-800">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">
                      Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
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

export default YearlySum;