// Data service for Yearly Summary components
// Acts as a microservice data layer for API calls and data management

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses/summary/yearly';

class YearlyDataService {
  // Fetch yearly expense data for current year
  async getYearlyExpenses(userId = 1) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        return this.getEmptyData();
      }

      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Backend now returns array directly: [{ category_name, category_total, products: [...] }]
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching yearly expenses:', error);
      return this.getEmptyData();
    }
  }

  // Fetch yearly expense data for a specific year
  async getYearlyExpensesByYear(userId = 1, year) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        return this.getEmptyData();
      }

      const response = await axios.get(`${API_URL}/${userId}/${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Backend now returns array directly: [{ category_name, category_total, products: [...] }]
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching yearly expenses by year:', error);
      return this.getEmptyData();
    }
  }

  // Return empty data structure when no expenses found
  getEmptyData() {
    return {
      totalSpent: 0,
      monthlyAverage: 0,
      weeklyAverage: 0,
      dailyAverage: 0,
      highestMonth: { month: 'N/A', total: 0 },
      highestWeek: { week: 'N/A', total: 0 },
      highestDate: { date: 'N/A', total: 0 },
      topCategory: 'N/A',
      topAmount: 0,
      categoryBreakdown: [],
      monthlyBreakdown: []
    };
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
}

// Export singleton instance
export default new YearlyDataService();
