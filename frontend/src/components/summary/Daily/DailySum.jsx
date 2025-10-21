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

const DailySum = () => {
  const location = useLocation();
  const selectedDateFromState = location.state?.selectedDate;
  
  const [currentDate, setCurrentDate] = useState(
    selectedDateFromState ? new Date(selectedDateFromState) : new Date()
  );
  
  const [expenseData, setExpenseData] = useState([]);
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
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading expense data:', error);
      setExpenseData([]);
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
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <Header 
          currentDate={currentDate}
          onNavigateDate={navigateDate}
          onDownloadPDF={generatePDF}
          isLoading={loading}
        />
        
        {/* Summary Cards Section */}
        <Cards 
          expenseData={expenseData}
          isLoading={loading}
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
              showLegend={false}
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
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for {dataService.formatDate(currentDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySum;