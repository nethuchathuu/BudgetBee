import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Calendar, Wallet, Tag, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SumNav from './sumNav';

const WeeklySum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryRef = useRef(null);
  
  const [currentWeek, setCurrentWeek] = useState(
    location.state?.selectedWeek || getStartOfWeek(new Date())
  );

  // Sample data with consistent color scheme
  const sampleData = [
    { category: 'Groceries', amount: 275.50, color: '#4A90E2' },
    { category: 'Transport', amount: 89.25, color: '#2ECC71' },
    { category: 'Food & Dining', amount: 165.75, color: '#E74C3C' },
    { category: 'Entertainment', amount: 120.00, color: '#F39C12' },
    { category: 'Utilities', amount: 85.30, color: '#9B59B6' },
    { category: 'Shopping', amount: 234.80, color: '#1ABC9C' },
    { category: 'Healthcare', amount: 45.90, color: '#34495E' }
  ];

  const [expenseData, setExpenseData] = useState(sampleData);
  const [loading, setLoading] = useState(false);

  function getStartOfWeek(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function getEndOfWeek(startDate) {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  useEffect(() => {
    setExpenseData(sampleData);
  }, [currentWeek]);

  const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const categoriesCount = expenseData.length;
  const avgDailySpend = totalSpent / 7; // Weekly average per day
  const topCategory = expenseData.length > 0 ? 
    expenseData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : 
    { category: 'N/A', amount: 0 };

  const formatWeekRange = (startDate) => {
    const endDate = getEndOfWeek(startDate);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
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
      pdf.save(`weekly-summary-${currentWeek.toISOString().split('T')[0]}.pdf`);
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
        {/* Navigation */}
        <SumNav pageTitle="Weekly Summary" />
        
        {/* Week Navigation & PDF Download */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
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
                  Week of {formatWeekRange(currentWeek)}
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
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
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
            <p className="font-bold text-gray-800" style={{ fontSize: '1.2rem' }}>
              Rs. {totalSpent.toFixed(2)}
            </p>
          </div>

          {/* Top Category Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
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

          {/* Categories Count Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FFF3E0' }}>
                <BarChart3 style={{ color: '#F39C12' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Categories
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.2rem' }}>
              {categoriesCount}
            </p>
          </div>

          {/* Daily Average Card */}
          <div className="bg-white rounded-xl p-6 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E5F5' }}>
                <TrendingUp style={{ color: '#9B59B6' }} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2" style={{ fontWeight: '600' }}>
              Daily Average
            </h3>
            <p className="font-bold text-gray-800" style={{ fontSize: '1.2rem' }}>
              Rs. {avgDailySpend.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        {expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Weekly Expenses by Category
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={expenseData}>
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
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6" style={{ 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
              borderRadius: '15px' 
            }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Weekly Spending Distribution
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {expenseData.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center" style={{ 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
            borderRadius: '15px' 
          }}>
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">No expenses recorded for the week of {formatWeekRange(currentWeek)}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default WeeklySum;