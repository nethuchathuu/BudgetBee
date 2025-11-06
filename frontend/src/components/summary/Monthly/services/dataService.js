// Data service for Monthly Summary components
// Acts as a microservice data layer for API calls and data management
import axios from 'axios';

class MonthlyDataService {
  constructor() {
    this.apiBaseUrl = 'http://localhost:5000/api/expenses';
    this.sampleData = [
      { category: 'Groceries', amount: 1125.50, color: '#4A90E2' },
      { category: 'Transport', amount: 456.75, color: '#2ECC71' },
      { category: 'Food & Dining', amount: 789.25, color: '#E74C3C' },
      { category: 'Entertainment', amount: 567.00, color: '#F39C12' },
      { category: 'Utilities', amount: 2340.80, color: '#9B59B6' },
      { category: 'Shopping', amount: 934.60, color: '#1ABC9C' },
      { category: 'Healthcare', amount: 234.90, color: '#34495E' },
      { category: 'Education', amount: 1500.00, color: '#E67E22' }
    ];
    this.monthlyBudget = 15000; // Sample monthly budget
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
      
      const response = await axios.get(endpoint);
      
      if (response.data.success) {
        return response.data.data; // Array of { category, amount, color }
      } else {
        console.warn('API returned unsuccessful response:', response.data);
        return this.sampleData; // Fallback to sample data
      }
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      // Return sample data as fallback
      return this.sampleData;
    }
  }

  // Calculate total spent from expense data
  calculateTotalSpent(expenseData) {
    return expenseData.reduce((sum, item) => sum + item.amount, 0);
  }

  // Get categories count
  getCategoriesCount(expenseData) {
    return expenseData.length;
  }

  // Calculate daily average spending
  calculateDailyAverage(expenseData, daysInMonth = 30) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return totalSpent / daysInMonth;
  }

  // Find the category with highest spending
  getTopCategory(expenseData) {
    if (expenseData.length === 0) {
      return { category: 'N/A', amount: 0 };
    }
    return expenseData.reduce((prev, current) => 
      (prev.amount > current.amount) ? prev : current
    );
  }

  // Get highest single expense
  getHighestExpense(expenseData) {
    if (expenseData.length === 0) return 0;
    return Math.max(...expenseData.map(item => item.amount));
  }

  // Calculate budget usage percentage
  calculateBudgetUsage(expenseData, budget = null) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    const monthlyBudget = budget || this.monthlyBudget;
    return (totalSpent / monthlyBudget) * 100;
  }

  // Get monthly budget
  getMonthlyBudget() {
    return this.monthlyBudget;
  }

  // Set monthly budget
  setMonthlyBudget(budget) {
    this.monthlyBudget = budget;
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