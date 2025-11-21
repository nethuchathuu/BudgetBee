import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SumNav from '../sumNav';
import { useTheme } from '../../../context/ThemeContext';

// Import Yearly components
import Header from './components/Header';
import Cards from './components/Cards';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

// Import services
import dataService from './services/dataService';
import chartService from './services/chartService';
import pdfReportGenerator from '../../../utils/pdfReportGenerator';

const YearlySum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark } = useTheme();
  const summaryRef = useRef(null);
  
  const [currentYear, setCurrentYear] = useState(
    location.state?.selectedYear || new Date().getFullYear()
  );
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadYearlyData(currentYear);
  }, [currentYear]);

  const loadYearlyData = async (year) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id') || 1;
      let data;
      
      if (year === new Date().getFullYear()) {
        // Current year
        data = await dataService.getYearlyExpenses(userId);
      } else {
        // Selected year
        data = await dataService.getYearlyExpensesByYear(userId, year);
      }
      
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading yearly data:', error);
      setExpenseData(dataService.getEmptyData());
    } finally {
      setLoading(false);
    }
  };

  const navigateYear = (direction) => {
    setCurrentYear(prev => prev + direction);
  };

  const generatePDF = async () => {
    if (!summaryRef.current) return;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`yearly-summary-${currentYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadStructuredReport = async () => {
    try {
      const reportData = {
        reportType: 'Yearly',
        period: `Year ${currentYear}`,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: expenseData.totalSpent || 0,
        metrics: {
          monthlyAverage: expenseData.monthlyAverage,
          weeklyAverage: expenseData.weeklyAverage,
          dailyAverage: expenseData.dailyAverage,
          highestMonth: expenseData.highestMonth?.month && expenseData.highestMonth?.total > 0
            ? `${expenseData.highestMonth.month} — Rs. ${expenseData.highestMonth.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          highestWeek: expenseData.highestWeek?.week && expenseData.highestWeek?.total > 0
            ? `Week ${expenseData.highestWeek.week} — Rs. ${expenseData.highestWeek.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          highestDate: expenseData.highestDate?.date && expenseData.highestDate?.total > 0
            ? `${expenseData.highestDate.date} — Rs. ${expenseData.highestDate.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null,
          topCategory: expenseData.topCategory && expenseData.topAmount > 0
            ? `${expenseData.topCategory} — Rs. ${expenseData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData.categoryBreakdown || [],
        filename: `yearly_summary_${currentYear}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading yearly report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const hasExpenses = expenseData && expenseData.totalSpent > 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Navigation */}
        <SumNav pageTitle="Yearly Summary" />
        
        {/* Header with Year Navigation & PDF Download */}
        <Header 
          currentYear={currentYear}
          onNavigateYear={navigateYear}
          onDownloadStructured={downloadStructuredReport}
        />

        {/* Summary Cards */}
        {!loading && expenseData && (
          <Cards 
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
            <BarChart 
              data={expenseData.categoryBreakdown || []}
              isLoading={loading}
              title={`${currentYear} Expenses by Category`}
            />

            {/* Pie Chart - Category Breakdown */}
            <PieChart 
              data={expenseData.categoryBreakdown || []}
              isLoading={loading}
              title={`${currentYear} Spending Distribution`}
            />
          </div>
        )}

        {/* Loading State for Charts */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart isLoading={true} />
            <PieChart isLoading={true} />
          </div>
        )}

        {/* No Data Message */}
        {!hasExpenses && !loading && (
          <div className={`rounded-xl p-12 text-center ${
            isDark ? 'bg-[#1a1f2c]' : 'bg-white'
          }`} style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className={`mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No expenses found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No expenses recorded for this year.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlySum;
