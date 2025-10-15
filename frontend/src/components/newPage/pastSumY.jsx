import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, Wallet, Tag, CalendarCheck, BarChart3, CalendarDays, Activity, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumY = ({ expenses = [], onYearChange }) => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const summaryRef = useRef(null);

  // Sample yearly data with consistent colors
  const mockCategoryData = [
    { category: 'Groceries', amount: 15245.50, color: '#4A90E2' },
    { category: 'Transport', amount: 9784.00, color: '#2ECC71' },
    { category: 'Food & Dining', amount: 11943.75, color: '#E74C3C' },
    { category: 'Entertainment', amount: 8675.00, color: '#F39C12' },
    { category: 'Utilities', amount: 13145.45, color: '#9B59B6' },
    { category: 'Shopping', amount: 7534.20, color: '#1ABC9C' },
    { category: 'Healthcare', amount: 5234.80, color: '#34495E' },
    { category: 'Education', amount: 12000.00, color: '#E67E22' }
  ];

  const mockMonthlyData = [
    { month: 'Jan', amount: 5456.30 },
    { month: 'Feb', amount: 4892.50 },
    { month: 'Mar', amount: 6234.80 },
    { month: 'Apr', amount: 5743.30 },
    { month: 'May', amount: 7234.50 },
    { month: 'Jun', amount: 6543.20 },
    { month: 'Jul', amount: 8234.70 },
    { month: 'Aug', amount: 7892.40 },
    { month: 'Sep', amount: 6789.20 },
    { month: 'Oct', amount: 5234.60 },
    { month: 'Nov', amount: 4567.80 },
    { month: 'Dec', amount: 8934.50 }
  ];

  const totalSpent = mockCategoryData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = mockCategoryData.length > 0 ? 
    mockCategoryData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };
  const highestExpenseMonth = mockMonthlyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
  const monthlyAverage = mockMonthlyData.reduce((sum, item) => sum + item.amount, 0) / mockMonthlyData.length;
  const highestExpenseWeek = { week: 'Week 32', amount: 2345.50 }; // Sample data
  const weeklyAverage = totalSpent / 52; // 52 weeks in a year
  const highestExpenseDay = { date: 'Dec 15th', amount: 534.50 }; // Sample data
  const dailyAverage = totalSpent / 365; // 365 days in a year

  const navigateYear = (direction) => {
    setSelectedYear(selectedYear + direction);
    if (onYearChange) onYearChange(selectedYear + direction);
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
      pdf.save(`past-yearly-summary-${selectedYear}.pdf`);
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
            <h1 className="text-2xl font-bold text-gray-800">Past Yearly Summary</h1>
            
            <div></div> {/* Spacer for flexbox */}
          </div>
        </div>
        
        {/* Year Navigation & PDF Download */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Year Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateYear(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-600" size={24} />
              </button>
              
              <div className="flex items-center gap-2">
                <Calendar style={{ color: '#4A90E2' }} size={20} />
                <span className="text-xl font-semibold text-gray-800">
                  Year {selectedYear}
                </span>
              </div>

              <button
                onClick={() => navigateYear(1)}
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

        {/* Summary Cards - 8 Cards for Yearly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Highest Expense Month Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFEBEE' }}>
                <Calendar style={{ color: '#E74C3C' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Highest Expense Month
            </h3>
            <p className="text-lg font-bold text-gray-800">{highestExpenseMonth.month}</p>
            <p className="text-sm text-gray-600">Rs. {highestExpenseMonth.amount.toFixed(2)}</p>
          </div>

          {/* Monthly Average Card */}
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
              Monthly Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {monthlyAverage.toFixed(2)}
            </p>
          </div>

          {/* Highest Expense Week Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E5F5' }}>
                <CalendarCheck style={{ color: '#9B59B6' }} size={24} />
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
              <div className="p-3 rounded-full" style={{ backgroundColor: '#E8F6F3' }}>
                <TrendingUp style={{ color: '#1ABC9C' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Weekly Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {weeklyAverage.toFixed(2)}
            </p>
          </div>

          {/* Highest Expense Day Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFF8E1' }}>
                <CalendarDays style={{ color: '#FF9800' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Highest Expense Day
            </h3>
            <p className="text-lg font-bold text-gray-800">{highestExpenseDay.date}</p>
            <p className="text-sm text-gray-600">Rs. {highestExpenseDay.amount.toFixed(2)}</p>
          </div>

          {/* Daily Average Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F1F8E9' }}>
                <Activity style={{ color: '#8BC34A' }} size={24} />
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
              Yearly Expenses by Category
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
              Yearly Spending Distribution
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

export default PastSumY;