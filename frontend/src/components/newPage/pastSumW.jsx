import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, Wallet, TrendingUp, CalendarDays, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PastSumW = ({ expenses = [], onWeekChange }) => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const summaryRef = useRef(null);

  // Sample weekly data with consistent colors
  const mockWeeklyData = [
    { day: 'Mon', amount: 45.50, transactions: 3 },
    { day: 'Tue', amount: 32.20, transactions: 2 },
    { day: 'Wed', amount: 67.80, transactions: 5 },
    { day: 'Thu', amount: 23.40, transactions: 1 },
    { day: 'Fri', amount: 89.60, transactions: 6 },
    { day: 'Sat', amount: 156.30, transactions: 8 },
    { day: 'Sun', amount: 78.90, transactions: 4 }
  ];

  const mockCategoryData = [
    { category: 'Groceries', amount: 245.50, color: '#4A90E2' },
    { category: 'Transport', amount: 84.00, color: '#2ECC71' },
    { category: 'Food & Dining', amount: 143.75, color: '#E74C3C' },
    { category: 'Entertainment', amount: 75.00, color: '#F39C12' },
    { category: 'Utilities', amount: 45.45, color: '#9B59B6' }
  ];

  const totalSpent = mockWeeklyData.reduce((sum, item) => sum + item.amount, 0);
  const avgDailySpend = totalSpent / 7;
  const topCategory = mockCategoryData.length > 0 ? 
    mockCategoryData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };
  const highestExpenseDay = mockWeeklyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);

  const getWeekRange = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    start.setDate(diff);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
    if (onWeekChange) onWeekChange(newDate);
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
      const weekRange = getWeekRange(selectedWeek);
      pdf.save(`past-weekly-summary-${weekRange.start}-${weekRange.end}.pdf`);
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

  const weekRange = getWeekRange(selectedWeek);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div ref={summaryRef} className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Navigation Header */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">Past Weekly Summary</h1>
            
            <div></div> {/* Spacer for flexbox */}
          </div>
        </div>
        
        {/* Week Navigation & PDF Download */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Week Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-600" size={24} />
              </button>
              
              <div className="flex items-center gap-2">
                <Calendar style={{ color: '#4A90E2' }} size={20} />
                <span className="text-xl font-semibold text-gray-800">
                  {weekRange.start} - {weekRange.end}
                </span>
              </div>

              <button
                onClick={() => navigateWeek(1)}
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

        {/* Summary Cards - 4 Cards for Weekly */}
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
                <TrendingUp style={{ color: '#2ECC71' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Top Category
            </h3>
            <p className="text-lg font-bold text-gray-800">{topCategory.category}</p>
            <p className="text-sm text-gray-600">Rs. {topCategory.amount.toFixed(2)}</p>
          </div>

          {/* Highest Expense Day Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFEBEE' }}>
                <CalendarDays style={{ color: '#E74C3C' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Highest Expense Day
            </h3>
            <p className="text-lg font-bold text-gray-800">{highestExpenseDay.day}</p>
            <p className="text-sm text-gray-600">Rs. {highestExpenseDay.amount.toFixed(2)}</p>
          </div>

          {/* Daily Average Card */}
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
              Daily Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.1rem' }}>
              Rs. {avgDailySpend.toFixed(2)}
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
              Weekly Expenses by Category
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
              Weekly Spending Distribution
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

export default PastSumW;