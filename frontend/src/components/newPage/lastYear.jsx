import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import Yearly summary components
import { Cards as YearlyCards } from '../summary/Yearly';

const LastYear = () => {
  const navigate = useNavigate();
  const [previousYear, setPreviousYear] = useState(new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample yearly data
  const sampleYearlyData = [
    { category: 'Groceries', amount: 14567.50, color: '#4A90E2' },
    { category: 'Transport', amount: 8945.75, color: '#2ECC71' },
    { category: 'Food & Dining', amount: 12340.25, color: '#E74C3C' },
    { category: 'Entertainment', amount: 7890.00, color: '#F39C12' },
    { category: 'Utilities', amount: 28560.80, color: '#9B59B6' },
    { category: 'Shopping', amount: 15678.60, color: '#1ABC9C' },
    { category: 'Healthcare', amount: 5432.90, color: '#34495E' },
    { category: 'Education', amount: 18900.00, color: '#E67E22' },
    { category: 'Travel', amount: 22100.00, color: '#E91E63' },
    { category: 'Insurance', amount: 9800.00, color: '#00BCD4' }
  ];

  useEffect(() => {
    // Set previous year
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, 0, 1); // January 1st of last year
    setPreviousYear(lastYear);
    
    loadPreviousYearData();
  }, []);

  const loadPreviousYearData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setExpenseData(sampleYearlyData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading previous year data:', error);
      setExpenseData([]);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const formatYear = (date) => {
    return date.getFullYear().toString();
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${Number(amount).toFixed(2)}`;
  };

  const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const categoriesCount = expenseData.length;
  const monthlyAverage = totalSpent / 12;
  const topCategory = expenseData.length > 0 ? 
    expenseData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              
              <div className="flex items-center gap-2">
                <Clock style={{ color: '#4A90E2' }} size={24} />
                <h1 className="text-2xl font-bold text-gray-800">Last Year's Summary</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {formatYear(previousYear)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">
              📊 Comprehensive overview of your yearly spending patterns and financial highlights.
            </p>
          </div>

          {/* Year Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">
            <span>Year {formatYear(previousYear)}</span>
            <span>•</span>
            <span>12 months</span>
            <span>•</span>
            <span>365 days</span>
          </div>
        </div>

        {/* Summary Cards - 8 Cards for Yearly */}
        {!loading && (
          <YearlyCards 
            totalSpent={totalSpent}
            highestMonth="March"
            highestMonthAmount={totalSpent * 0.15}
            monthlyAverage={monthlyAverage}
            highestWeek="Week 12"
            highestWeekAmount={totalSpent * 0.04}
            weeklyAverage={totalSpent / 52}
            highestDate="March 15"
            highestDateAmount={totalSpent * 0.008}
            dailyAverage={totalSpent / 365}
            topCategory={topCategory.category}
            topCategoryAmount={topCategory.amount}
          />
        )}
        
        {/* Loading State for Cards */}
        {loading && (
          <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 text-center animate-pulse" 
                style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Section */}
        {expenseData.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Last Year's Expenses by Category
              </h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#4A90E2"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Last Year's Spending Distribution
              </h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={140}
                      dataKey="amount"
                      nameKey="category"
                      stroke="#ffffff"
                      strokeWidth={2}
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
          </div>
        )}

        {/* No Data Message */}
        {expenseData.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {formatYear(previousYear)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastYear;