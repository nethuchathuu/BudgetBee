import React, { useState, useEffect } from "react";
import NavBar from "../components/NavHome";
import Header from "../components/newPage/header";
import ExpenseCards from "../components/newPage/expenseCards";
import Graph from "../components/newPage/graph";
import Chart from "../components/newPage/chart";
import Calendar from "../components/newPage/calendar";
import PastSumD from "../components/newPage/pastSumD";
import PastSumW from "../components/newPage/pastSumW";
import PastSumM from "../components/newPage/pastSumM";
import PastSumY from "../components/newPage/pastSumY";
import { expensesAPI, getUserId, transformExpenseData, formatDateForAPI } from "../services/api";
import { 
  CalendarDays, 
  Calendar as CalendarIcon, 
  BarChart3, 
  TrendingUp, 
  Clock,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState('today'); // 'today', 'daily', 'weekly', 'monthly', 'yearly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch today's expenses on component mount
  useEffect(() => {
    fetchTodaysExpenses();
  }, []);

  const fetchTodaysExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      console.log('Fetching expenses for user:', userId);
      const response = await expensesAPI.getDailySummary(userId);
      const transformedData = transformExpenseData(response);
      setExpenseData(transformedData);
      console.log('✅ Backend connection successful!');
    } catch (err) {
      console.error('Error fetching today\'s expenses:', err);
      console.warn('⚠️ Backend connection failed:', err.message, 'Showing sample data.');
      setError('Backend connection failed: ' + err.message);
      // Fallback to sample data if backend is not available
      setExpenseData([
        { category: 'Groceries', amount: 45.50, color: '#8B5CF6' },
        { category: 'Transport', amount: 12.00, color: '#EF4444' },
        { category: 'Food & Drink', amount: 28.75, color: '#F59E0B' },
        { category: 'Entertainment', amount: 15.00, color: '#10B981' },
        { category: 'Utilities', amount: 85.30, color: '#3B82F6' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close calendar after selection
    
    // If clicking on today's date, use today view, otherwise switch to daily view
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      setCurrentView('today');
      await fetchTodaysExpenses();
    } else {
      setCurrentView('daily');
    }
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowCalendar(false); // Close calendar when changing views
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'daily':
        return <PastSumD selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      case 'weekly':
        return <PastSumW selectedDate={selectedDate} onWeekChange={setSelectedDate} />;
      case 'monthly':
        return <PastSumM selectedDate={selectedDate} onMonthChange={setSelectedDate} />;
      case 'yearly':
        return <PastSumY selectedDate={selectedDate} onYearChange={(year) => {
          const newDate = new Date(selectedDate);
          newDate.setFullYear(year);
          setSelectedDate(newDate);
        }} />;
      default: // 'today'
        return (
          <div className="flex h-screen bg-gray-100">
            {/* Left Sidebar - Dashboard Menu */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="text-emerald-600" size={24} />
                  View Summaries
                </h2>
                <p className="text-sm text-gray-600 mt-1">Expense Analytics</p>
              </div>
              
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => handleViewChange('daily')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                >
                  <CalendarDays size={20} className="text-emerald-600" />
                  <span className="font-medium">Daily Summary</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button
                  onClick={() => handleViewChange('weekly')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                >
                  <CalendarIcon size={20} className="text-emerald-600" />
                  <span className="font-medium">Weekly Summary</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button
                  onClick={() => handleViewChange('monthly')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                >
                  <TrendingUp size={20} className="text-emerald-600" />
                  <span className="font-medium">Monthly Summary</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button
                  onClick={() => handleViewChange('yearly')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                >
                  <Clock size={20} className="text-emerald-600" />
                  <span className="font-medium">Yearly Summary</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative">
              {/* Header with Calendar Button */}
              <div className="bg-white shadow-sm border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Today's Expenses</h1>
                    <p className="text-gray-600">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={handleCalendarToggle}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <CalendarIcon size={20} />
                      Select Date
                    </button>
                    
                    {/* Calendar Dropdown */}
                    {showCalendar && (
                      <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200">
                        <Calendar 
                          selectedDate={selectedDate}
                          onDateSelect={handleDateClick}
                          onDateClick={handleDateClick}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                      <p className="text-sm">
                        ⚠️ Backend connection failed: {error}. Showing sample data.
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading today's expenses...</span>
                      </div>
                    </div>
                  )}

                  {/* Expense Cards */}
                  {!loading && <ExpenseCards expenses={expenseData} />}

                  {/* Charts Section */}
                  {!loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Graph expenses={expenseData} />
                      <Chart expenses={expenseData} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Only show on main dashboard view */}
      {currentView === 'today' && <NavBar />}
      
      {/* Navigation Bar for Summary Views */}
      {currentView !== 'today' && (
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => handleViewChange('today')}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('daily')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  currentView === 'daily' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handleViewChange('weekly')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  currentView === 'weekly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleViewChange('monthly')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  currentView === 'monthly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleViewChange('yearly')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  currentView === 'yearly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {renderCurrentView()}
      </main>
    </div>
  );
}
