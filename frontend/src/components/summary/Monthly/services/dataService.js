// Data service for Monthly Summary components
// Acts as a microservice data layer for API calls and data management

class MonthlyDataService {
  constructor() {
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
  async getMonthlyExpenses(year, month) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/expenses/monthly?year=${year}&month=${month}`);
      // return await response.json();
      
      // For now, return sample data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.sampleData);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      return [];
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
}

// Export singleton instance
export default new MonthlyDataService();