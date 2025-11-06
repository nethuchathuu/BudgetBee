// Data service for Yearly Summary components
// Acts as a microservice data layer for API calls and data management

class YearlyDataService {
  constructor() {
    this.sampleData = [
      { category: 'Groceries', amount: 15675.50, color: '#4A90E2' },
      { category: 'Transport', amount: 8456.75, color: '#2ECC71' },
      { category: 'Food & Dining', amount: 12789.25, color: '#E74C3C' },
      { category: 'Entertainment', amount: 7567.00, color: '#F39C12' },
      { category: 'Utilities', amount: 28340.80, color: '#9B59B6' },
      { category: 'Shopping', amount: 11234.60, color: '#1ABC9C' },
      { category: 'Healthcare', amount: 5234.90, color: '#34495E' },
      { category: 'Education', amount: 18000.00, color: '#E67E22' },
      { category: 'Insurance', amount: 24000.00, color: '#3498DB' },
      { category: 'Travel', amount: 9876.50, color: '#27AE60' }
    ];
  }

  // Fetch yearly expense data for a specific year
  async getYearlyExpenses(year) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/expenses/yearly?year=${year}`);
      // return await response.json();
      
      // For now, return sample data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.sampleData);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching yearly expenses:', error);
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

  // Calculate monthly average spending for the year
  calculateMonthlyAverage(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return totalSpent / 12; // 12 months in a year
  }

  // Calculate daily average spending for the year
  calculateDailyAverage(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return totalSpent / 365; // 365 days in a year
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

  // Get highest single expense in the year
  getHighestExpense(expenseData) {
    if (expenseData.length === 0) return 0;
    return Math.max(...expenseData.map(item => item.amount));
  }

  // Calculate average spending per category
  getAveragePerCategory(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    const categoriesCount = this.getCategoriesCount(expenseData);
    return categoriesCount > 0 ? totalSpent / categoriesCount : 0;
  }

  // Get month with highest expense (mock implementation)
  getHighestExpenseMonth(expenseData) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (expenseData.length === 0) {
      return { month: 'N/A', amount: 0 };
    }
    
    // Mock: assume the month with highest expense is related to top category
    const topCategory = this.getTopCategory(expenseData);
    const randomMonthIndex = Math.floor(Math.random() * 12);
    
    return {
      month: months[randomMonthIndex],
      amount: topCategory.amount * 2.5 // Mock: assume monthly peak is 2.5x of top category
    };
  }

  // Get week with highest expense (mock implementation)
  getHighestExpenseWeek(expenseData) {
    if (expenseData.length === 0) {
      return { week: 'N/A', amount: 0 };
    }
    
    const topCategory = this.getTopCategory(expenseData);
    const randomWeekNumber = Math.floor(Math.random() * 52) + 1;
    
    return {
      week: `Week ${randomWeekNumber}`,
      amount: topCategory.amount * 0.6 // Mock: assume weekly peak is 60% of top category
    };
  }

  // Get date with highest expense (mock implementation)
  getHighestExpenseDate(expenseData) {
    if (expenseData.length === 0) {
      return { date: 'N/A', amount: 0 };
    }
    
    const topCategory = this.getTopCategory(expenseData);
    const currentYear = new Date().getFullYear();
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const mockDate = new Date(currentYear, randomMonth, randomDay);
    
    return {
      date: this.formatDate(mockDate),
      amount: topCategory.amount * 0.15 // Mock: assume daily peak is 15% of top category
    };
  }

  // Calculate weekly average spending for the year
  calculateWeeklyAverage(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return totalSpent / 52; // 52 weeks in a year
  }

  // Calculate budget usage percentage
  calculateBudgetUsage(expenseData, yearlyBudget = 180000) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return (totalSpent / yearlyBudget) * 100;
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

  // Get comprehensive yearly insights
  getYearlyInsights(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    const categoriesCount = this.getCategoriesCount(expenseData);
    const topCategory = this.getTopCategory(expenseData);
    const highestExpense = this.getHighestExpense(expenseData);
    const monthlyAverage = this.calculateMonthlyAverage(expenseData);
    const dailyAverage = this.calculateDailyAverage(expenseData);
    const weeklyAverage = this.calculateWeeklyAverage(expenseData);
    const averagePerCategory = this.getAveragePerCategory(expenseData);
    const budgetUsage = this.calculateBudgetUsage(expenseData);
    const highestMonth = this.getHighestExpenseMonth(expenseData);
    const highestWeek = this.getHighestExpenseWeek(expenseData);
    const highestDate = this.getHighestExpenseDate(expenseData);

    return {
      totalSpent,
      categoriesCount,
      topCategory,
      highestExpense,
      monthlyAverage,
      dailyAverage,
      weeklyAverage,
      averagePerCategory,
      budgetUsage,
      highestMonth,
      highestWeek,
      highestDate,
      yearInfo: {
        year: new Date().getFullYear(),
        months: 12,
        weeks: 52,
        days: 365
      }
    };
  }

  // Compare with previous year (placeholder for future implementation)
  async compareWithPreviousYear(currentYearData, year) {
    // TODO: Implement comparison logic
    const previousYear = year - 1;
    
    // For now, return mock comparison
    return {
      totalSpentChange: 12.5, // percentage change
      topCategoryChange: 'Utilities', // new top category
      trend: 'increasing' // increasing/decreasing/stable
    };
  }
}

// Export singleton instance
export default new YearlyDataService();
