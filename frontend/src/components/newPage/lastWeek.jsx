import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

// Import Weekly summary components
import { 
  Cards as WeeklyCards, 
  BarChart as WeeklyBarChart, 
  PieChart as WeeklyPieChart,
  dataService as weeklyDataService 
} from '../summary/Weekly';

const LastWeek = () => {
  const navigate = useNavigate();
  const [previousWeek, setPreviousWeek] = useState(new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set previous week (last week's start)
    const today = new Date();
    const lastWeekStart = weeklyDataService.getStartOfWeek(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Go back 7 days to get last week
    setPreviousWeek(lastWeekStart);
    
    loadPreviousWeekData(lastWeekStart);
  }, []);

  const loadPreviousWeekData = async (weekStart) => {
    setLoading(true);
    try {
      const data = await weeklyDataService.getWeeklyExpenses(weekStart);
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading previous week data:', error);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const weekInfo = weeklyDataService.getCurrentWeekInfo(previousWeek);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              
              <div className="flex items-center gap-2">
                <Clock style={{ color: '#4A90E2' }} size={24} />
                <h1 className="text-2xl font-bold text-gray-800">Last Week's Summary</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {weekInfo.formattedRange}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              📈 Analyze your weekly spending patterns from last week to better plan your budget.
            </p>
          </div>

          {/* Week Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">
            <span>Week #{weekInfo.weekNumber - 1}</span>
            <span>•</span>
            <span>{weekInfo.year}</span>
            <span>•</span>
            <span>7 days</span>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <WeeklyCards 
            totalSpent={weeklyDataService.calculateTotalSpent(expenseData)}
            dailyAverage={weeklyDataService.calculateTotalSpent(expenseData) / 7}
            highestDay={weeklyDataService.getHighestExpenseDay(expenseData).day}
            highestDayAmount={weeklyDataService.getHighestExpenseDay(expenseData).amount}
            topCategory={weeklyDataService.getTopCategory(expenseData).category}
            topCategoryAmount={weeklyDataService.getTopCategory(expenseData).amount}
          />
        )}
        
        {/* Loading State for Cards */}
        {loading && (
          <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {[...Array(4)].map((_, index) => (
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
            <WeeklyBarChart 
              data={expenseData}
              isLoading={loading}
              title="Last Week's Expenses by Category"
            />

            {/* Pie Chart */}
            <WeeklyPieChart 
              data={expenseData}
              isLoading={loading}
              title="Last Week's Spending Distribution"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyBarChart isLoading={true} />
            <WeeklyPieChart isLoading={true} />
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
            <p className="text-gray-500">No expenses recorded for the week of {weekInfo.formattedRange}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastWeek;