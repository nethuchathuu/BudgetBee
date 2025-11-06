// Data service for Daily Summary components
// Acts as a microservice data layer for API calls and data management
import axios from 'axios';

class DataService {
  constructor() {
    this.apiBaseUrl = 'http://localhost:5000/api/expenses';
  }

  // Fetch daily expense data for a specific date
  async getDailyExpenses(date, userId = 1) {
    try {
      let endpoint;
      if (date && date !== new Date().toISOString().split('T')[0]) {
        // Selected date
        endpoint = `${this.apiBaseUrl}/summary/daily/${userId}/${date}`;
      } else {
        // Current date
        endpoint = `${this.apiBaseUrl}/summary/daily/${userId}`;
      }
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('📅 Fetching daily expenses:', { date, userId, endpoint });
      const response = await axios.get(endpoint, { headers });
      console.log('📊 API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        // Backend returns: { totalSpent, topCategory, topAmount, categoryBreakdown }
        // Return the full data object, not just categoryBreakdown
        console.log('✅ Successfully fetched data:', response.data.data);
        return response.data.data;
      } else {
        console.warn('⚠️ API returned unsuccessful response:', response.data);
        // Return empty data structure instead of sample data
        return {
          totalSpent: 0,
          topCategory: null,
          topAmount: 0,
          categoryBreakdown: []
        };
      }
    } catch (error) {
      console.error('❌ Error fetching daily expenses:', error);
      // Return empty data structure instead of sample data
      return {
        totalSpent: 0,
        topCategory: null,
        topAmount: 0,
        categoryBreakdown: []
      };
    }
  }

  // Calculate total spent from expense data
  calculateTotalSpent(expenseData) {
    // Handle both array format (legacy) and object format (from backend)
    if (Array.isArray(expenseData)) {
      return expenseData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    } else if (expenseData && typeof expenseData.totalSpent === 'number') {
      return expenseData.totalSpent;
    }
    return 0;
  }

  // Find the category with highest spending
  getTopCategory(expenseData) {
    // Handle object format from backend (preferred)
    if (expenseData && !Array.isArray(expenseData)) {
      return {
        category: expenseData.topCategory || 'N/A',
        amount: expenseData.topAmount || 0
      };
    }
    
    // Handle array format (legacy)
    if (!Array.isArray(expenseData) || expenseData.length === 0) {
      return { category: 'N/A', amount: 0 };
    }
    return expenseData.reduce((prev, current) => 
      ((prev.amount || 0) > (current.amount || 0)) ? prev : current
    );
  }

  // Format date for display
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format date for PDF filename
  formatDateForPDF(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Export singleton instance
export default new DataService();