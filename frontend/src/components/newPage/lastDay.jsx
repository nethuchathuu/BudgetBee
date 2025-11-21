import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Import Daily summary components
import { 
  Cards as DailyCards, 
  BarChart as DailyBarChart, 
  PieChart as DailyPieChart,
  dataService as dailyDataService 
} from '../summary/Daily';
import pdfReportGenerator from '../../utils/pdfReportGenerator';

const LastDay = ({ selectedDate: propSelectedDate }) => {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const [displayDate, setDisplayDate] = useState(new Date());
  const [expenseData, setExpenseData] = useState(null); // Changed from [] to null to distinguish loading vs empty
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Use the prop date if provided, otherwise use yesterday
    let dateToLoad;
    if (propSelectedDate) {
      dateToLoad = propSelectedDate;
    } else {
      dateToLoad = new Date();
      dateToLoad.setDate(dateToLoad.getDate() - 1);
    }
    setDisplayDate(dateToLoad);
    loadPreviousDayData(dateToLoad);
  }, [propSelectedDate]); // Re-run when propSelectedDate changes

  const loadPreviousDayData = async (date) => {
    setLoading(true);
    try {
      const formattedDate = dailyDataService.formatDateForPDF(date);
      console.log('🔍 Loading data for date:', { date, formattedDate });
      
      const data = await dailyDataService.getDailyExpenses(formattedDate);
      console.log('📦 Received expense data:', data);
      
      setExpenseData(data); // Now receives {totalSpent, topCategory, topAmount, categoryBreakdown}
    } catch (error) {
      console.error('❌ Error loading previous day data:', error);
      setExpenseData({
        totalSpent: 0,
        topCategory: null,
        topAmount: 0,
        categoryBreakdown: []
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
      const formattedDate = displayDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const reportData = {
        reportType: 'Daily',
        period: propSelectedDate ? `${formattedDate} (Last Day)` : `${formattedDate} (Yesterday)`,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: expenseData?.totalSpent || 0,
        metrics: {
          topCategory: expenseData?.topCategory && expenseData?.topAmount > 0
            ? `${expenseData.topCategory} — Rs. ${expenseData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData?.categoryBreakdown || [],
        filename: `lastday_summary_${dailyDataService.formatDateForPDF(displayDate)}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading last day report:', error);
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
                <h1 className="text-2xl font-bold text-gray-400">
                  {propSelectedDate ? 'Last Day Summary' : "Yesterday's Summary"}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {dailyDataService.formatDate(displayDate)}
              </span>
            </div>

            <button
              onClick={downloadStructuredReport}
              disabled={loading || !expenseData}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📊 Review your spending from this day to track your daily habits and identify patterns.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && expenseData && (
          <DailyCards 
            totalSpent={expenseData.totalSpent || 0}
            topCategory={expenseData.topCategory || 'N/A'}
            topAmount={expenseData.topAmount || 0}
          />
        )}
        
        {/* Loading State for Cards */}
        {loading && (
          <div className="cards-container flex flex-wrap gap-4 justify-center items-center p-4">
            {[...Array(2)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 text-center animate-pulse" 
                style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  flex: '1'
                }}
              >
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Section */}
        {expenseData && expenseData.categoryBreakdown && expenseData.categoryBreakdown.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <DailyBarChart 
              data={expenseData.categoryBreakdown}
              isLoading={loading}
              title="Expenses by Category"
            />

            {/* Pie Chart */}
            <DailyPieChart 
              data={expenseData.categoryBreakdown}
              isLoading={loading}
              title="Spending Distribution"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyBarChart isLoading={true} />
            <DailyPieChart isLoading={true} />
          </div>
        )}

        {/* No Data Message */}
        {expenseData && (!expenseData.categoryBreakdown || expenseData.categoryBreakdown.length === 0) && !loading && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {dailyDataService.formatDate(displayDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastDay;