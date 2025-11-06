import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SumNav from '../sumNav';

// Import Yearly components
import Header from './components/Header';
import Cards from './components/Cards';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

// Import services
import dataService from './services/dataService';
import chartService from './services/chartService';

const YearlySum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryRef = useRef(null);
  
  const [currentYear, setCurrentYear] = useState(
    location.state?.selectedYear || new Date().getFullYear()
  );
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadYearlyData(currentYear);
  }, [currentYear]);

  const loadYearlyData = async (year) => {
    setLoading(true);
    try {
      const data = await dataService.getYearlyExpenses(year);
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading yearly data:', error);
      setExpenseData([]);
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

  // Calculate insights
  const insights = dataService.getYearlyInsights(expenseData);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Navigation */}
        <SumNav pageTitle="Yearly Summary" />
        
        {/* Header with Year Navigation & PDF Download */}
        <Header 
          currentYear={currentYear}
          onNavigateYear={navigateYear}
          onGeneratePDF={generatePDF}
        />

        {/* Summary Cards */}
        {!loading && (
          <Cards 
            totalSpent={insights.totalSpent}
            highestMonth={insights.highestMonth.month}
            highestMonthAmount={insights.highestMonth.amount}
            monthlyAverage={insights.monthlyAverage}
            highestWeek={insights.highestWeek.week}
            highestWeekAmount={insights.highestWeek.amount}
            weeklyAverage={insights.weeklyAverage}
            highestDate={insights.highestDate.date}
            highestDateAmount={insights.highestDate.amount}
            dailyAverage={insights.dailyAverage}
            topCategory={insights.topCategory.category}
            topCategoryAmount={insights.topCategory.amount}
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
            <BarChart 
              data={chartService.prepareBarChartData(expenseData)}
              isLoading={loading}
              title={`${currentYear} Expenses by Category`}
            />

            {/* Pie Chart */}
            <PieChart 
              data={chartService.preparePieChartData(expenseData)}
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
        {expenseData.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for year {currentYear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlySum;
