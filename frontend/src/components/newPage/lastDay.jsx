import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

// Import Daily summary components
import { 
  Cards as DailyCards, 
  BarChart as DailyBarChart, 
  PieChart as DailyPieChart,
  dataService as dailyDataService 
} from '../summary/Daily';

const LastDay = () => {
  const navigate = useNavigate();
  const [previousDay, setPreviousDay] = useState(new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set previous day (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setPreviousDay(yesterday);
    
    loadPreviousDayData(yesterday);
  }, []);

  const loadPreviousDayData = async (date) => {
    setLoading(true);
    try {
      const data = await dailyDataService.getDailyExpenses(dailyDataService.formatDateForPDF(date));
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading previous day data:', error);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              
              <div className="flex items-center gap-2">
                <Clock style={{ color: '#4A90E2' }} size={24} />
                <h1 className="text-2xl font-bold text-gray-800">Yesterday's Summary</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {dailyDataService.formatDate(previousDay)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📊 Review your spending from yesterday to track your daily habits and identify patterns.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <DailyCards 
          expenseData={expenseData}
          isLoading={loading}
        />

        {/* Charts Section */}
        {expenseData.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <DailyBarChart 
              data={expenseData}
              isLoading={loading}
              title="Yesterday's Expenses by Category"
            />

            {/* Pie Chart */}
            <DailyPieChart 
              data={expenseData}
              isLoading={loading}
              title="Yesterday's Spending Distribution"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyBarChart isLoading={true} />
            <DailyPieChart isLoading={true} />
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
            <p className="text-gray-500">No expenses recorded for {dailyDataService.formatDate(previousDay)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastDay;