import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import ExpenseCards from '../newPage/expenseCards';
import Graph from '../newPage/graph';
import Chart from '../newPage/chart';
import Calendar from '../newPage/calendar';
import { expensesAPI, getUserId } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const CurrentWeek = () => {
  const { theme, isDark } = useTheme();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get week date range for display
  const getWeekRange = () => {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    const start = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = lastDayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  // Fetch current week summary
  const fetchWeeklySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const response = await expensesAPI.getWeeklySummary(userId);
      
      console.log('Weekly expenses response:', response);

      // Transform response - handle multiple possible formats
      let transformedData = [];
      
      if (Array.isArray(response)) {
        transformedData = response;
      } else if (response && response.data && response.data.categoryBreakdown) {
        // Backend returns { success: true, data: { categoryBreakdown: [...] } }
        // Transform to match expected format
        transformedData = response.data.categoryBreakdown.map(cat => ({
          category_name: cat.category,
          category_total: cat.amount,
          products: [] // Weekly summary doesn't have product details
        }));
      } else if (response && response.categoryBreakdown) {
        transformedData = response.categoryBreakdown.map(cat => ({
          category_name: cat.category,
          category_total: cat.amount,
          products: []
        }));
      } else if (response && typeof response === 'object') {
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          transformedData = possibleArrays[0];
        }
      }

      console.log('Transformed weekly data:', transformedData);
      setExpenseData(transformedData);
    } catch (err) {
      console.error('Error fetching weekly summary:', err);
      setError('Failed to load weekly summary: ' + err.message);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchWeeklySummary();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className={`border-b p-6 flex-shrink-0 ${
        isDark 
          ? 'bg-[#1a1f2c] border-emerald-400/20' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Current Week Summary
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {getWeekRange()}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CalendarIcon size={20} />
              Calendar
            </button>
            
            {/* Calendar Modal */}
            <Calendar 
              selectedDate={new Date().toISOString().split('T')[0]}
              onDateSelect={() => {}}
              onClose={() => setShowCalendar(false)}
              isOpen={showCalendar}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className={`border px-4 py-3 rounded-lg ${
              isDark
                ? 'bg-yellow-900/20 border-yellow-600 text-yellow-400'
                : 'bg-yellow-100 border-yellow-400 text-yellow-700'
            }`}>
              <p className="text-sm">⚠️ {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={`rounded-xl shadow-lg p-6 text-center ${
              isDark ? 'bg-[#1a1f2c]' : 'bg-white'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Loading weekly summary...
                </span>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && expenseData.length === 0 && (
            <div className={`rounded-xl shadow-lg p-12 text-center ${
              isDark ? 'bg-[#1a1f2c]' : 'bg-white'
            }`}>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No expenses recorded this week
              </p>
            </div>
          )}

          {/* Expense Cards */}
          {!loading && expenseData.length > 0 && (
            <ExpenseCards data={expenseData} />
          )}

          {/* Charts Section */}
          {!loading && expenseData.length > 0 && (
            <div className="flex flex-col items-center w-full gap-6">
              <div className="w-full">
                <Graph data={expenseData} />
              </div>
              <div className="w-full max-w-2xl">
                <Chart data={expenseData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeek;
