import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

// Import microservice components
import Header from './components/Header';
import Cards from './components/Cards';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

// Import services
import dataService from './services/dataService';
import pdfReportGenerator from '../../../utils/pdfReportGenerator';

const WeeklySum = () => {
  const location = useLocation();
  const { theme, isDark } = useTheme();
  const selectedWeekFromState = location.state?.selectedWeek;
  
  const [currentWeek, setCurrentWeek] = useState(
    selectedWeekFromState ? 
    dataService.getStartOfWeek(new Date(selectedWeekFromState)) : 
    dataService.getStartOfWeek(new Date())
  );
  
  const [expenseData, setExpenseData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalSpent: 0,
    dailyAverage: 0,
    highestDay: null,
    highestDayAmount: 0,
    topCategory: null,
    topAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef(null);

  // Load data when component mounts or week changes
  useEffect(() => {
    loadExpenseData();
  }, [currentWeek]);

  const loadExpenseData = async () => {
    setLoading(true);
    try {
      // Get userId from localStorage (same pattern as daily summary)
      const userId = localStorage.getItem('user_id') || 1;
      
      // Get category breakdown from API (backward compatibility)
      const categoryBreakdown = await dataService.getWeeklyExpenses(currentWeek, userId);
      setExpenseData(categoryBreakdown);
      
      // Calculate summary data from categoryBreakdown
      if (categoryBreakdown.length > 0) {
        const totalSpent = dataService.calculateTotalSpent(categoryBreakdown);
        const dailyAverage = dataService.calculateDailyAverage(categoryBreakdown);
        const topCategory = dataService.getTopCategory(categoryBreakdown);
        const highestDay = dataService.getHighestExpenseDay(categoryBreakdown);
        
        setSummaryData({
          totalSpent,
          dailyAverage,
          highestDay: highestDay.day,
          highestDayAmount: highestDay.amount,
          topCategory: topCategory.category,
          topAmount: topCategory.amount
        });
      } else {
        // Reset to empty state
        setSummaryData({
          totalSpent: 0,
          dailyAverage: 0,
          highestDay: null,
          highestDayAmount: 0,
          topCategory: null,
          topAmount: 0
        });
      }
    } catch (error) {
      console.error('Error loading weekly expense data:', error);
      setExpenseData([]);
      setSummaryData({
        totalSpent: 0,
        dailyAverage: 0,
        highestDay: null,
        highestDayAmount: 0,
        topCategory: null,
        topAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(dataService.getStartOfWeek(newWeek));
  };

  const generatePDF = async () => {
    if (!summaryRef.current) return;

    try {
      setLoading(true);
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
      pdf.save(`weekly-summary-${dataService.formatWeekForPDF(currentWeek)}.pdf`);
    } catch (error) {
      console.error('Error generating weekly PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadStructuredReport = async () => {
    try {
      setLoading(true);
      
      const weekInfo = dataService.getCurrentWeekInfo(currentWeek);
      const period = `Week ${weekInfo.weekNumber} (${weekInfo.weekRange})`;
      
      const reportData = {
        reportType: 'Weekly',
        period: period,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: summaryData.totalSpent || 0,
        metrics: {
          dailyAverage: summaryData.dailyAverage,
          highestDay: summaryData.highestDay && summaryData.highestDayAmount > 0 
            ? `${summaryData.highestDay} — Rs. ${summaryData.highestDayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          topCategory: summaryData.topCategory && summaryData.topAmount > 0
            ? `${summaryData.topCategory} — Rs. ${summaryData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData,
        filename: `weekly_summary_${dataService.formatWeekForPDF(currentWeek)}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading weekly report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Event handlers for chart interactions
  const handleBarClick = (data, index) => {
    console.log('Weekly bar clicked:', data, index);
    // TODO: Implement drill-down to category details for the week
  };

  const handlePieClick = (data, index) => {
    console.log('Weekly pie segment clicked:', data, index);
    // TODO: Implement weekly category analysis view
  };

  const weekInfo = dataService.getCurrentWeekInfo(currentWeek);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <Header 
          currentWeek={currentWeek}
          onNavigateWeek={navigateWeek}
          onDownloadStructured={downloadStructuredReport}
          isLoading={loading}
        />
        
        {/* Summary Cards Section - 4 cards for weekly */}
        <Cards 
          totalSpent={summaryData.totalSpent}
          dailyAverage={summaryData.dailyAverage}
          highestDay={summaryData.highestDay}
          highestDayAmount={summaryData.highestDayAmount}
          topCategory={summaryData.topCategory}
          topCategoryAmount={summaryData.topAmount}
        />

        {/* Charts Section */}
        {expenseData.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <BarChart 
              data={expenseData}
              onBarClick={handleBarClick}
              isLoading={loading}
              title="Weekly Expenses by Category"
            />

            {/* Pie Chart */}
            <PieChart 
              data={expenseData}
              onPieClick={handlePieClick}
              isLoading={loading}
              title="Weekly Spending Distribution"
              showLegend={true}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && expenseData.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart isLoading={true} />
            <PieChart isLoading={true} />
          </div>
        )}

        {/* No Data Message */}
        {expenseData.length === 0 && !loading && (
          <div className={`rounded-xl p-12 text-center ${
            isDark ? 'bg-[#1a1f2c]' : 'bg-white'
          }`} style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className={`mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No expenses found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No expenses recorded for the week of {weekInfo.formattedRange}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySum;