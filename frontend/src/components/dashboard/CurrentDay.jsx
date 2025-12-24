import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import ExpenseCards from '../newPage/expenseCards';
import Graph from '../newPage/graph';
import Chart from '../newPage/chart';
import Calendar from '../newPage/calendar';
import { expensesAPI, getUserId, formatDateForAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const CurrentDay = () => {
  const { theme, isDark } = useTheme();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Format date for display
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // Fetch expenses for selected date
  const fetchDailyExpenses = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      
      let response;
      const today = new Date();
      const isCurrentDay = date.toDateString() === today.toDateString();
      
      if (isCurrentDay) {
        // Fetch today's expenses
        console.log('Fetching today\'s expenses for user:', userId);
        response = await expensesAPI.getDailySummary(userId);
      } else {
        // Fetch specific date expenses
        const dateStr = formatDateForAPI(date);
        console.log('Fetching expenses for date:', dateStr, 'user:', userId);
        response = await expensesAPI.getSelectedDateSummary(userId, dateStr);
      }

      console.log('Daily expenses response:', response);
      console.log('Response type:', typeof response);
      console.log('Is array?:', Array.isArray(response));

      // Transform response - handle multiple possible formats
      let transformedData = [];
      
      if (Array.isArray(response)) {
        // Response is already an array
        transformedData = response;
      } else if (response && response.categories && Array.isArray(response.categories)) {
        // Response has a categories property
        transformedData = response.categories;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response has a data property
        transformedData = response.data;
      } else if (response && typeof response === 'object') {
        // Try to extract any array from the response object
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          transformedData = possibleArrays[0];
        }
      }

      console.log('Transformed expense data:', transformedData);
      console.log('Data length:', transformedData.length);
      
      setExpenseData(transformedData);
      console.log('✅ Daily expenses loaded successfully, items:', transformedData.length);
    } catch (err) {
      console.error('Error fetching daily expenses:', err);
      setError('Failed to load expenses: ' + err.message);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchDailyExpenses(selectedDate);
  }, [selectedDate]);

  // Handle date selection from calendar
  const handleDateClick = (date) => {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date && typeof date === 'object' && date.date) {
      dateObj = new Date(date.date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date();
    }

    setSelectedDate(dateObj);
    setShowCalendar(false);
  };

  // Toggle calendar modal
  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

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
              {isToday() ? "Today's Expenses" : "Daily Expenses"}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={handleCalendarToggle}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CalendarIcon size={20} />
              Calendar
            </button>
            
            {/* Calendar Modal */}
            <Calendar 
              selectedDate={formatDateForAPI(selectedDate)}
              onDateSelect={handleDateClick}
              onClose={handleCalendarToggle}
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
                  Loading expenses...
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
                No expenses recorded for this date
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

export default CurrentDay;
