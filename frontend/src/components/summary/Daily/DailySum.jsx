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

const DailySum = () => {
  const location = useLocation();
  const { theme, isDark } = useTheme();
  const selectedDateFromState = location.state?.selectedDate;
  
  const [currentDate, setCurrentDate] = useState(
    selectedDateFromState ? new Date(selectedDateFromState) : new Date()
  );
  
  const [expenseData, setExpenseData] = useState([]);
  const [summaryData, setSummaryData] = useState({ totalSpent: 0, topCategory: null, topAmount: 0 });
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef(null);

  // Load data when component mounts or date changes
  useEffect(() => {
    loadExpenseData();
  }, [currentDate]);

  const loadExpenseData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getDailyExpenses(dataService.formatDateForPDF(currentDate));
      
      // Handle new API format vs sample data format
      if (data.categoryBreakdown) {
        // New API format: { totalSpent, topCategory, topAmount, categoryBreakdown }
        setExpenseData(data.categoryBreakdown);
        setSummaryData({
          totalSpent: data.totalSpent || 0,
          topCategory: data.topCategory || null,
          topAmount: data.topAmount || 0
        });
      } else if (Array.isArray(data)) {
        // Sample data format: array of { category, amount, color }
        setExpenseData(data);
        // Calculate summary from sample data
        const totalSpent = dataService.calculateTotalSpent(data);
        const topCategoryData = dataService.getTopCategory(data);
        setSummaryData({
          totalSpent,
          topCategory: topCategoryData.category,
          topAmount: topCategoryData.amount
        });
      } else {
        setExpenseData([]);
        setSummaryData({ totalSpent: 0, topCategory: null, topAmount: 0 });
      }
    } catch (error) {
      console.error('Error loading expense data:', error);
      setExpenseData([]);
      setSummaryData({ totalSpent: 0, topCategory: null, topAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
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
      pdf.save(`daily-summary-${dataService.formatDateForPDF(currentDate)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadStructuredReport = async () => {
    try {
      setLoading(true);
      
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const reportData = {
        reportType: 'Daily',
        period: formattedDate,
        dateGenerated: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        totalSpent: summaryData.totalSpent || 0,
        metrics: {
          topCategory: summaryData.topCategory && summaryData.topAmount > 0
            ? `${summaryData.topCategory} — Rs. ${summaryData.topAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : null
        },
        categoryBreakdown: expenseData || [],
        filename: `daily_summary_${dataService.formatDateForPDF(currentDate)}.pdf`
      };

      await pdfReportGenerator.generateStructuredReport(reportData);
    } catch (error) {
      console.error('Error downloading daily report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Event handlers for chart interactions
  const handleBarClick = (data, index) => {
    console.log('Bar clicked:', data, index);
    // TODO: Implement drill-down functionality
  };

  const handlePieClick = (data, index) => {
    console.log('Pie segment clicked:', data, index);
    // TODO: Implement category detail view
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <Header 
          currentDate={currentDate}
          onNavigateDate={navigateDate}
          onDownloadStructured={downloadStructuredReport}
          isLoading={loading}
        />
        
        {/* Summary Cards Section */}
        <Cards 
          totalSpent={summaryData.totalSpent}
          topCategory={summaryData.topCategory}
          topAmount={summaryData.topAmount}
        />

        {/* Charts Section */}
        {expenseData.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <BarChart 
              data={expenseData}
              onBarClick={handleBarClick}
              isLoading={loading}
              title="Expenses by Category"
            />

            {/* Pie Chart */}
            <PieChart 
              data={expenseData}
              onPieClick={handlePieClick}
              isLoading={loading}
              title="Spending Distribution"
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
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No expenses recorded for {dataService.formatDate(currentDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySum;