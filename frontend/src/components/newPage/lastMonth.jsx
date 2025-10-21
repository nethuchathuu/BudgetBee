import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

// Import Monthly summary components
import { 
  Cards as MonthlyCards, 
  BarChart as MonthlyBarChart, 
  PieChart as MonthlyPieChart,
  dataService as monthlyDataService 
} from '../summary/Monthly';

const LastMonth = () => {
  const navigate = useNavigate();
  const [previousMonth, setPreviousMonth] = useState(new Date());
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set previous month (last month)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setPreviousMonth(lastMonth);
    
    loadPreviousMonthData(lastMonth);
  }, []);

  const loadPreviousMonthData = async (month) => {
    setLoading(true);
    try {
      const year = month.getFullYear();
      const monthNum = month.getMonth() + 1;
      const data = await monthlyDataService.getMonthlyExpenses(year, monthNum);
      setExpenseData(data);
    } catch (error) {
      console.error('Error loading previous month data:', error);
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
                <h1 className="text-2xl font-bold text-gray-800">Last Month's Summary</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span className="text-lg font-medium">
                {monthlyDataService.formatMonth(previousMonth)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              💰 Review your monthly spending trends and budget performance from last month.
            </p>
          </div>

          {/* Month Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">
            <span>Month {previousMonth.getMonth() + 1}</span>
            <span>•</span>
            <span>{previousMonth.getFullYear()}</span>
            <span>•</span>
            <span>{monthlyDataService.getDaysInMonth(previousMonth)} days</span>
          </div>
        </div>

        {/* Summary Cards */}
        <MonthlyCards 
          expenseData={expenseData}
          currentMonth={previousMonth}
          isLoading={loading}
        />

        {/* Charts Section */}
        {expenseData.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <MonthlyBarChart 
              data={expenseData}
              isLoading={loading}
              title="Last Month's Expenses by Category"
            />

            {/* Pie Chart */}
            <MonthlyPieChart 
              data={expenseData}
              isLoading={loading}
              title="Last Month's Spending Distribution"
              showLegend={true}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyBarChart isLoading={true} />
            <MonthlyPieChart isLoading={true} />
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
            <p className="text-gray-500">No expenses recorded for {monthlyDataService.formatMonth(previousMonth)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastMonth;