import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';

// Import microservice components
import Header from './components/Header';
import Cards from './components/Cards';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

// Import services
import dataService from './services/dataService';

const MonthlySum = () => {
  const location = useLocation();
  const selectedMonthFromState = location.state?.selectedMonth;
  
  const [currentMonth, setCurrentMonth] = useState(
    selectedMonthFromState ? new Date(selectedMonthFromState) : new Date()
  );
  
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
  const summaryRef = useRef(null);

  // Load data when component mounts or month changes
  useEffect(() => {
    loadExpenseData();
  }, [currentMonth]);

  const loadExpenseData = async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      // Get userId from localStorage (same pattern as other summaries)
      const userId = localStorage.getItem('user_id') || 1;
      const data = await dataService.getMonthlyExpenses(year, month, userId);
      
      console.log('📦 Received monthly expense data:', data);
      
      // Set the full data object from API
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading monthly expense data:', error);
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

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
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
      pdf.save(`monthly-summary-${dataService.formatMonthForPDF(currentMonth)}.pdf`);
    } catch (error) {
      console.error('Error generating monthly PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers for chart interactions
  const handleBarClick = (data, index) => {
    console.log('Monthly bar clicked:', data, index);
    // TODO: Implement drill-down to category details
  };

  const handlePieClick = (data, index) => {
    console.log('Monthly pie segment clicked:', data, index);
    // TODO: Implement category analysis view
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <Header 
          currentMonth={currentMonth}
          onNavigateMonth={navigateMonth}
          onDownloadPDF={generatePDF}
          isLoading={loading}
        />
        
        {/* Summary Cards Section - 6 cards for monthly */}
        <Cards 
          totalSpent={expenseData.totalSpent}
          dailyAverage={expenseData.dailyAverage}
          weeklyAverage={expenseData.weeklyAverage}
          highestWeek={expenseData.highestWeek?.week}
          highestWeekAmount={expenseData.highestWeek?.total}
          highestDate={expenseData.highestDate?.date}
          highestDateAmount={expenseData.highestDate?.total}
          topCategory={expenseData.topCategory}
          topCategoryAmount={expenseData.topAmount}
        />

        {/* Charts Section */}
        {expenseData.categoryBreakdown?.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Category Breakdown */}
            <BarChart 
              data={expenseData.categoryBreakdown || []}
              onBarClick={handleBarClick}
              isLoading={loading}
              title="Monthly Expenses by Category"
            />

            {/* Pie Chart - Category Distribution */}
            <PieChart 
              data={expenseData.categoryBreakdown || []}
              onPieClick={handlePieClick}
              isLoading={loading}
              title="Monthly Spending Distribution"
              showLegend={true}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && expenseData.categoryBreakdown?.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart isLoading={true} />
            <PieChart isLoading={true} />
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
            <p className="text-gray-500">No expenses recorded for {dataService.formatMonth(currentMonth)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySum;