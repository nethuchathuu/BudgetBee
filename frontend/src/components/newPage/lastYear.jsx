import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import Yearly summary components
import { Cards as YearlyCards } from '../summary/Yearly';
import dataService from '../summary/Yearly/services/dataService';
import { getCategoryColor } from '../../utils/categoryColors';
import pdfReportGenerator from '../../utils/pdfReportGenerator';

const LastYear = () => {
  const navigate = useNavigate();
  const [previousYear, setPreviousYear] = useState(new Date().getFullYear() - 1);
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreviousYearData();
  }, []);

  const loadPreviousYearData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const data = await dataService.getYearlyExpensesByYear(userId, previousYear);
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading previous year data:', error);
      setExpenseData(dataService.getEmptyData());
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const downloadStructuredReport = async () => {
    try {
      const reportData = {
        reportType: 'Yearly',
        period: `Last Year (${previousYear})`,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: expenseData?.totalSpent || 0,
        metrics: {
          monthlyAverage: expenseData?.monthlyAverage,
          weeklyAverage: expenseData?.weeklyAverage,
          dailyAverage: expenseData?.dailyAverage,
          highestMonth: expenseData?.highestMonth?.month && expenseData?.highestMonth?.total > 0
            ? `${expenseData.highestMonth.month} — Rs. ${expenseData.highestMonth.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          highestWeek: expenseData?.highestWeek?.week && expenseData?.highestWeek?.total > 0
            ? `Week ${expenseData.highestWeek.week} — Rs. ${expenseData.highestWeek.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          highestDate: expenseData?.highestDate?.date && expenseData?.highestDate?.total > 0
            ? `${expenseData.highestDate.date} — Rs. ${expenseData.highestDate.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          topCategory: expenseData?.topCategory && expenseData?.topAmount > 0
            ? `${expenseData.topCategory} — Rs. ${expenseData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData?.categoryBreakdown || [],
        filename: `lastyear_summary_${previousYear}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading last year report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const hasExpenses = expenseData && expenseData.totalSpent > 0;

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
                Year {previousYear}
              </span>
            </div>

            <button
              onClick={downloadStructuredReport}
              disabled={loading || !expenseData || !expenseData.categoryBreakdown?.length}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">
              📊 Comprehensive overview of your yearly spending patterns and financial highlights.
            </p>
          </div>

          {/* Year Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">
            <span>Year {previousYear}</span>
            <span>•</span>
            <span>12 months</span>
            <span>•</span>
            <span>365 days</span>
          </div>
        </div>

        {/* Summary Cards - 8 Cards for Yearly */}
        {!loading && expenseData && (
          <YearlyCards 
            totalSpent={expenseData.totalSpent}
            highestMonth={expenseData.highestMonth?.month}
            highestMonthAmount={expenseData.highestMonth?.total}
            monthlyAverage={expenseData.monthlyAverage}
            highestWeek={expenseData.highestWeek?.week}
            highestWeekAmount={expenseData.highestWeek?.total}
            weeklyAverage={expenseData.weeklyAverage}
            highestDate={expenseData.highestDate?.date}
            highestDateAmount={expenseData.highestDate?.total}
            dailyAverage={expenseData.dailyAverage}
            topCategory={expenseData.topCategory}
            topCategoryAmount={expenseData.topAmount}
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
        {hasExpenses && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Category Breakdown */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Expenses by Category - {previousYear}
              </h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={expenseData.categoryBreakdown || []}>
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
                      radius={[4, 4, 0, 0]}
                    >
                      {(expenseData.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Category Breakdown */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Spending Distribution - {previousYear}
              </h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData.categoryBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={140}
                      dataKey="amount"
                      nameKey="category"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {(expenseData.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              {(expenseData.categoryBreakdown || []).length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {(expenseData.categoryBreakdown || []).map((entry, index) => {
                    const percentage = expenseData.totalSpent > 0 
                      ? ((entry.amount / expenseData.totalSpent) * 100).toFixed(1) 
                      : 0;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(entry.category) }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {entry.category} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!hasExpenses && !loading && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {previousYear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastYear;