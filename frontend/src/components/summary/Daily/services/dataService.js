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
      
      // Backend now returns array directly: [{ category_name, category_total, products: [...] }]
      if (Array.isArray(response.data)) {
        console.log('✅ Successfully fetched data:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ API returned unexpected format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching daily expenses:', error);
      // Return empty array
      return [];
    }
  }

  // Calculate total spent from expense data
  calculateTotalSpent(expenseData) {
    // Handle array format: [{ category_name, category_total, products: [...] }]
    if (Array.isArray(expenseData)) {
      return expenseData.reduce((sum, item) => sum + (Number(item.category_total) || 0), 0);
    }
    return 0;
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