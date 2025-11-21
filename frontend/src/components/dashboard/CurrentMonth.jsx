import React, { useState, useEffect } from 'react';
import ExpenseCards from '../newPage/expenseCards';
import Graph from '../newPage/graph';
import Chart from '../newPage/chart';
import { expensesAPI, getUserId } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const CurrentMonth = () => {
  const { theme, isDark } = useTheme();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get month name for display
  const getMonthName = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Fetch current month summary
  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const response = await expensesAPI.getMonthlySummary(userId);
      
      console.log('Monthly expenses response:', response);

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
          products: [] // Monthly summary doesn't have product details
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

      console.log('Transformed monthly data:', transformedData);
      setExpenseData(transformedData);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError('Failed to load monthly summary: ' + err.message);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchMonthlySummary();
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
              Current Month Summary
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {getMonthName()}
            </p>
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
                  Loading monthly summary...
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
                No expenses recorded this month
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

export default CurrentMonth;
