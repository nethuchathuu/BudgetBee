import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, Wallet, Tag, CalendarCheck, BarChart3, CalendarDays, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumM = ({ expenses = [], onMonthChange }) => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const summaryRef = useRef(null);

  // Sample monthly data with consistent colors
  const mockCategoryData = [
    { category: 'Groceries', amount: 1245.50, color: '#4A90E2' },
    { category: 'Transport', amount: 784.00, color: '#2ECC71' },
    { category: 'Food & Dining', amount: 943.75, color: '#E74C3C' },
    { category: 'Entertainment', amount: 675.00, color: '#F39C12' },
    { category: 'Utilities', amount: 1145.45, color: '#9B59B6' },
    { category: 'Shopping', amount: 534.20, color: '#1ABC9C' }
  ];

  const mockWeeklyData = [
    { week: 'Week 1', amount: 1456.30, days: 7 },
    { week: 'Week 2', amount: 892.50, days: 7 },
    { week: 'Week 3', amount: 1234.80, days: 7 },
    { week: 'Week 4', amount: 743.30, days: 7 }
  ];

  const totalSpent = mockCategoryData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = mockCategoryData.length > 0 ? 
    mockCategoryData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };
  const highestExpenseWeek = mockWeeklyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
  const weeklyAverage = mockWeeklyData.reduce((sum, item) => sum + item.amount, 0) / mockWeeklyData.length;
  const highestExpenseDate = { date: '15th', amount: 234.50 }; // Sample data
  const dailyAverage = totalSpent / 30; // Assuming 30 days in month

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
    if (onMonthChange) onMonthChange(newDate);
  };

  const generatePDF = async () => {
    if (!summaryRef.current) return;

    try {
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
      pdf.save(`past-monthly-summary-${selectedMonth.toISOString().split('T')[0].substring(0, 7)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">
            Rs. {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            Rs. {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Navigation Header */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">Past Monthly Summary</h1>
            
            <div></div> {/* Spacer for flexbox */}
          </div>
        </div>
        
        {/* Month Navigation & PDF Download */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-600" size={24} />
              </button>
              
              <div className="flex items-center gap-2">
                <Calendar style={{ color: '#4A90E2' }} size={20} />
                <span className="text-xl font-semibold text-gray-800">
                  {selectedMonth.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>

              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="text-gray-600" size={24} />
              </button>
            </div>

            {/* PDF Download */}
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Summary Cards - 6 Cards for Monthly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Spent Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
                <Wallet style={{ color: '#4A90E2' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Total Spent
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {totalSpent.toFixed(2)}
            </p>
          </div>

          {/* Top Category Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E8F5E8' }}>
                <Tag style={{ color: '#2ECC71' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Top Category
            </h3>
            <p className="text-lg font-bold text-gray-800">{topCategory.category}</p>
            <p className="text-sm text-gray-600">Rs. {topCategory.amount.toFixed(2)}</p>
          </div>

          {/* Highest Expense Week Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFEBEE' }}>
                <CalendarCheck style={{ color: '#E74C3C' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Highest Expense Week
            </h3>
            <p className="text-lg font-bold text-gray-800">{highestExpenseWeek.week}</p>
            <p className="text-sm text-gray-600">Rs. {highestExpenseWeek.amount.toFixed(2)}</p>
          </div>

          {/* Weekly Average Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFF3E0' }}>
                <BarChart3 style={{ color: '#F39C12' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Weekly Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {weeklyAverage.toFixed(2)}
            </p>
          </div>

          {/* Highest Expense Date Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E5F5' }}>
                <CalendarDays style={{ color: '#9B59B6' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Highest Expense Date
            </h3>
            <p className="text-lg font-bold text-gray-800">{highestExpenseDate.date}</p>
            <p className="text-sm text-gray-600">Rs. {highestExpenseDate.amount.toFixed(2)}</p>
          </div>

          {/* Daily Average Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E8F6F3' }}>
                <Activity style={{ color: '#1ABC9C' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Daily Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {dailyAverage.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Expenses by Category
            </h3>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={mockCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="#4A90E2"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Spending Distribution
            </h3>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="amount"
                    nameKey="category"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastSumM;