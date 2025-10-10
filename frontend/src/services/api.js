// API Service for BudgetBee Backend Integration

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to get user ID
export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id || user.user_id || 1; // Fallback to 1 for testing
};

// Expenses API
export const expensesAPI = {
  // Add new expense
  addExpense: async (expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expenses/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add expense');
    }
    
    return response.json();
  },

  // Get daily summary (current date)
  getDailySummary: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/daily/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily summary');
    }
    
    return response.json();
  },

  // Get daily summary for selected date
  getSelectedDateSummary: async (userId, selectedDate) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/daily/${userId}/${selectedDate}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch selected date summary');
    }
    
    return response.json();
  },

  // Get weekly summary (current week)
  getWeeklySummary: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/weekly/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch weekly summary');
    }
    
    return response.json();
  },

  // Get weekly summary for selected week
  getSelectedWeekSummary: async (userId, selectedWeek) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/weekly/${userId}/${selectedWeek}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch selected week summary');
    }
    
    return response.json();
  },

  // Get monthly summary (current month)
  getMonthlySummary: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/monthly/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch monthly summary');
    }
    
    return response.json();
  },

  // Get monthly summary for selected month
  getSelectedMonthSummary: async (userId, year, month) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/monthly/${userId}/${year}/${month}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch selected month summary');
    }
    
    return response.json();
  },

  // Get yearly summary (current year)
  getYearlySummary: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/yearly/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch yearly summary');
    }
    
    return response.json();
  },

  // Get yearly summary for selected year
  getSelectedYearSummary: async (userId, year) => {
    const response = await fetch(`${API_BASE_URL}/expenses/summary/yearly/${userId}/${year}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch selected year summary');
    }
    
    return response.json();
  },

  // Get all expenses for a user
  getAllExpenses: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/all/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    
    return response.json();
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    
    return response.json();
  }
};

// Helper functions to transform backend data for frontend components
export const transformExpenseData = (backendData) => {
  if (!backendData || !backendData.data) return [];

  // Group by category and calculate totals
  const categoryMap = new Map();
  
  backendData.data.forEach(item => {
    const category = item.category_name;
    const amount = parseFloat(item.product_total);
    
    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category) + amount);
    } else {
      categoryMap.set(category, amount);
    }
  });

  // Convert to array format expected by frontend components
  const colors = [
    '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#EC4899', '#F97316', '#8B5A2B', '#6B7280', '#84CC16'
  ];

  return Array.from(categoryMap.entries()).map(([category, amount], index) => ({
    category,
    amount,
    color: colors[index % colors.length]
  }));
};

// Calculate week number from date
export const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

// Format date for API calls
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

export default { expensesAPI, transformExpenseData, getUserId, getWeekNumber, formatDateForAPI };