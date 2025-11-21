import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Import Monthly summary components
import { 
  Cards as MonthlyCards, 
  BarChart as MonthlyBarChart, 
  PieChart as MonthlyPieChart,
  dataService as monthlyDataService 
} from '../summary/Monthly';
import pdfReportGenerator from '../../utils/pdfReportGenerator';

const LastMonth = () => {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const [previousMonth, setPreviousMonth] = useState(new Date());
  const [expenseData, setExpenseData] = useState({
    categoryBreakdown: [],
    weeklyBreakdown: [],
    totalSpent: 0,
    dailyAverage: 0,
    weeklyAverage: 0,
    highestWeek: { week: null, total: 0 },
    highestDate: { date: null, total: 0 },
    topCategory: null,
    topAmount: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set previous month (last month)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setPreviousMonth(lastMonth);
    
    loadPreviousMonthData(lastMonth);
  }, []);

  const loadPreviousMonthData = async (month) => {
    setLoading(true);
    try {
      const year = month.getFullYear();
      const monthNum = month.getMonth() + 1;
      // Get userId from localStorage (same pattern as other summaries)
      const userId = localStorage.getItem('user_id') || 1;
      const data = await monthlyDataService.getMonthlyExpenses(year, monthNum, userId);
      console.log('📦 Received previous month data:', data);
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading previous month data:', error);
      setExpenseData({
        categoryBreakdown: [],
        weeklyBreakdown: [],
        totalSpent: 0,
        dailyAverage: 0,
        weeklyAverage: 0,
        highestWeek: { week: null, total: 0 },
        highestDate: { date: null, total: 0 },
        topCategory: null,
        topAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const downloadStructuredReport = async () => {
    try {
      const monthName = previousMonth.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      });
      
      const reportData = {
        reportType: 'Monthly',
        period: `Last Month (${monthName})`,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: expenseData.totalSpent || 0,
        metrics: {
          dailyAverage: expenseData.dailyAverage,
          weeklyAverage: expenseData.weeklyAverage,
          highestWeek: expenseData.highestWeek?.week && expenseData.highestWeek?.total > 0
            ? `${expenseData.highestWeek.week} — Rs. ${expenseData.highestWeek.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          highestDate: expenseData.highestDate?.date && expenseData.highestDate?.total > 0
            ? `${expenseData.highestDate.date} — Rs. ${expenseData.highestDate.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          topCategory: expenseData.topCategory && expenseData.topAmount > 0
            ? `${expenseData.topCategory} — Rs. ${expenseData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData.categoryBreakdown || [],
        filename: `lastmonth_summary_${monthlyDataService.formatMonthForPDF(previousMonth)}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading last month report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className={`rounded-xl shadow-lg p-6 ${
          isDark ? 'bg-[#1a1f2c]' : 'bg-white'
        }`} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              
              <div className="flex items-center gap-2">
                <Clock style={{ color: '#4A90E2' }} size={24} />
                <h1 className="text-2xl font-bold text-gray-400">Last Month's Summary</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {monthlyDataService.formatMonth(previousMonth)}
              </span>
            </div>

            <button
              onClick={downloadStructuredReport}
              disabled={loading || !expenseData.categoryBreakdown.length}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              💰 Review your monthly spending trends and budget performance from last month.
            </p>
          </div>

          {/* Month Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">
            <span>Month {previousMonth.getMonth() + 1}</span>
            <span>•</span>
            <span>{previousMonth.getFullYear()}</span>
            <span>•</span>
            <span>{monthlyDataService.getDaysInMonth(previousMonth)} days</span>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <MonthlyCards 
            totalSpent={expenseData.totalSpent}
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
            {[...Array(6)].map((_, index) => (
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
        {expenseData.categoryBreakdown?.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Category Breakdown */}
            <MonthlyBarChart 
              data={expenseData.categoryBreakdown || []}
              title="Monthly Expenses by Category"
            />

            {/* Pie Chart - Category Distribution */}
            <MonthlyPieChart 
              data={expenseData.categoryBreakdown || []}
              title="Category Distribution"
              showLegend={true}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyBarChart isLoading={true} />
            <MonthlyPieChart isLoading={true} />
          </div>
        )}

        {/* No Data Message */}
        {expenseData.categoryBreakdown?.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {monthlyDataService.formatMonth(previousMonth)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastMonth;