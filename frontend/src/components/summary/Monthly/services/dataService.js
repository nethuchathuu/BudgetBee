// Data service for Monthly Summary components
// Acts as a microservice data layer for API calls and data management
import axios from 'axios';

class MonthlyDataService {
  constructor() {
    this.apiBaseUrl = 'http://localhost:5000/api/expenses';
    // Removed sampleData - using real API now
  }

  // Fetch monthly expense data for a specific month
  async getMonthlyExpenses(year, month, userId = 1) {
    try {
      let endpoint;
      const currentDate = new Date();
      const isCurrentMonth = year === currentDate.getFullYear() && month === (currentDate.getMonth() + 1);
      
      if (isCurrentMonth) {
        // Current month
        endpoint = `${this.apiBaseUrl}/summary/monthly/${userId}`;
      } else {
        // Selected month
        endpoint = `${this.apiBaseUrl}/summary/monthly/${userId}/${year}/${month}`;
      }

      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📅 Fetching monthly expenses:', {
        year,
        month,
        userId,
        endpoint
      });
      
      const response = await axios.get(endpoint, { headers });
      
      console.log('📊 Monthly API Response:', response.data);
      
      // Backend now returns array directly: [{ category_name, category_total, products: [...] }]
      if (Array.isArray(response.data)) {
        console.log('✅ Successfully fetched monthly data:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ API returned unexpected format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching monthly expenses:', error);
      // Return empty array
      return [];
    }
  }

  // Calculate total spent from expense data
  calculateTotalSpent(expenseData) {
    if (Array.isArray(expenseData)) {
      return expenseData.reduce((sum, item) => sum + (Number(item.category_total) || 0), 0);
    }
    return 0;
  }

  // Get categories count
  getCategoriesCount(expenseData) {
    return Array.isArray(expenseData) ? expenseData.length : 0;
  }

  // Find the category with highest spending
  getTopCategory(expenseData) {
    if (!Array.isArray(expenseData) || expenseData.length === 0) {
      return { category: 'N/A', amount: 0 };
    }
    
    const topCat = expenseData.reduce((prev, current) => 
      ((prev.category_total || 0) > (current.category_total || 0)) ? prev : current
    );
    
    return {
      category: topCat.category_name || 'N/A',
      amount: topCat.category_total || 0
    };
  }

  // Get highest single expense
  getHighestExpense(expenseData) {
    if (!Array.isArray(expenseData) || expenseData.length === 0) return 0;
    return Math.max(...expenseData.map(item => item.amount || 0));
  }

  // Calculate budget usage percentage
  calculateBudgetUsage(expenseData, budget = 15000) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return (totalSpent / budget) * 100;
  }

  // Format month for display
  formatMonth(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Format month for PDF filename
  formatMonthForPDF(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Get days in month
  getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  // Format date for display
  formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Format date for API calls
  formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
  }

  // Calculate monthly insights
  getMonthlyInsights(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    const categoriesCount = this.getCategoriesCount(expenseData);
    const topCategory = this.getTopCategory(expenseData);
    const highestExpense = this.getHighestExpense(expenseData);
    const budgetUsage = this.calculateBudgetUsage(expenseData);
    const dailyAverage = this.calculateDailyAverage(expenseData);

    return {
      totalSpent,
      categoriesCount,
      topCategory,
      highestExpense,
      budgetUsage,
      dailyAverage,
      budget: this.monthlyBudget,
      remainingBudget: this.monthlyBudget - totalSpent
    };
  }

  // Format month for display
  formatMonth(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Get number of days in a month
  getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
}

// Export singleton instance
export default new MonthlyDataService();