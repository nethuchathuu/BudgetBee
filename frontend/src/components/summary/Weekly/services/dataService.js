// Data service for Weekly Summary components
// Acts as a microservice data layer for API calls and data management

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class WeeklyDataService {
  constructor() {
    // Removed sampleData - using real API now
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

  // Helper function to get YEARWEEK format for MySQL
  getYearWeek(date) {
    const year = date.getFullYear();
    const weekNumber = this.getWeekNumber(date);
    return `${year}${String(weekNumber).padStart(2, '0')}`;
  }

  // Fetch weekly expense data for a specific week
  async getWeeklyExpenses(weekStartDate, userId = 1) {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!userId) {
        console.error('❌ No user_id provided');
        return [];
      }

      // Check if weekStartDate is current week or a selected week
      const currentWeek = this.getYearWeek(new Date());
      const selectedWeek = this.getYearWeek(weekStartDate);
      
      let endpoint;
      if (currentWeek === selectedWeek) {
        endpoint = `${API_URL}/expenses/summary/weekly/${userId}`;
      } else {
        endpoint = `${API_URL}/expenses/summary/weekly/${userId}/${selectedWeek}`;
      }

      console.log('📅 Fetching weekly expenses:', {
        weekStartDate: weekStartDate.toISOString(),
        selectedWeek,
        currentWeek,
        userId,
        endpoint
      });

      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(endpoint, { headers });
      
      console.log('📊 Weekly API Response:', response.data);

      // Backend now returns array directly: [{ category_name, category_total, products: [...] }]
      if (Array.isArray(response.data)) {
        console.log('✅ Successfully fetched weekly data:', response.data);
        return response.data;
      }

      console.warn('⚠️ API returned unexpected format:', response.data);
      return [];

    } catch (error) {
      console.error('❌ Error fetching weekly expenses:', error);
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

  // Get the day with highest expense (mock implementation)
  getHighestExpenseDay(expenseData) {
    if (expenseData.length === 0) {
      return { day: 'N/A', amount: 0 };
    }
    
    // Mock data - in real implementation, this would analyze daily totals
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const topCategory = this.getTopCategory(expenseData);
    const randomDayIndex = Math.floor(Math.random() * 7);
    
    return {
      day: days[randomDayIndex],
      amount: topCategory.amount * 0.8 // Mock: assume highest day is 80% of top category
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