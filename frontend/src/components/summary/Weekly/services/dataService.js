// Data service for Weekly Summary components
// Acts as a microservice data layer for API calls and data management

class WeeklyDataService {
  constructor() {
    this.sampleData = [
      { category: 'Groceries', amount: 275.50, color: '#4A90E2' },
      { category: 'Transport', amount: 89.25, color: '#2ECC71' },
      { category: 'Food & Dining', amount: 165.75, color: '#E74C3C' },
      { category: 'Entertainment', amount: 120.00, color: '#F39C12' },
      { category: 'Utilities', amount: 85.30, color: '#9B59B6' },
      { category: 'Shopping', amount: 234.80, color: '#1ABC9C' },
      { category: 'Healthcare', amount: 45.90, color: '#34495E' }
    ];
  }

  // Get start of week (Monday as first day)
  getStartOfWeek(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  // Get end of week (Sunday)
  getEndOfWeek(startDate) {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  // Fetch weekly expense data for a specific week
  async getWeeklyExpenses(weekStartDate) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/expenses/weekly?startDate=${weekStartDate.toISOString()}`);
      // return await response.json();
      
      // For now, return sample data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.sampleData);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching weekly expenses:', error);
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

  // Calculate daily average spending for the week
  calculateDailyAverage(expenseData) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    return totalSpent / 7; // 7 days in a week
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

  // Get highest single expense in the week
  getHighestExpense(expenseData) {
    if (expenseData.length === 0) return 0;
    return Math.max(...expenseData.map(item => item.amount));
  }

  // Format week range for display
  formatWeekRange(startDate) {
    const endDate = this.getEndOfWeek(startDate);
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  }

  // Format week for PDF filename
  formatWeekForPDF(startDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get week number in year
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Get current week information
  getCurrentWeekInfo(date) {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = this.getEndOfWeek(startOfWeek);
    const weekNumber = this.getWeekNumber(startOfWeek);
    
    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
      weekNumber,
      formattedRange: this.formatWeekRange(startOfWeek),
      year: startOfWeek.getFullYear()
    };
  }

  // Calculate weekly insights
  getWeeklyInsights(expenseData, weekStartDate) {
    const totalSpent = this.calculateTotalSpent(expenseData);
    const categoriesCount = this.getCategoriesCount(expenseData);
    const topCategory = this.getTopCategory(expenseData);
    const highestExpense = this.getHighestExpense(expenseData);
    const dailyAverage = this.calculateDailyAverage(expenseData);
    const weekInfo = this.getCurrentWeekInfo(weekStartDate);

    return {
      totalSpent,
      categoriesCount,
      topCategory,
      highestExpense,
      dailyAverage,
      weekInfo,
      daysInWeek: 7
    };
  }

  // Compare with previous week (placeholder for future implementation)
  async compareWithPreviousWeek(currentWeekData, weekStartDate) {
    // TODO: Implement comparison logic
    const previousWeekStart = new Date(weekStartDate);
    previousWeekStart.setDate(weekStartDate.getDate() - 7);
    
    // For now, return mock comparison
    return {
      totalSpentChange: 5.2, // percentage change
      topCategoryChange: 'Shopping', // new top category
      trend: 'increasing' // increasing/decreasing/stable
    };
  }
}

// Export singleton instance
export default new WeeklyDataService();