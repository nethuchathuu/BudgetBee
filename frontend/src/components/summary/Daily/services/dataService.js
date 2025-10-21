// Data service for Daily Summary components
// Acts as a microservice data layer for API calls and data management

class DataService {
  constructor() {
    this.sampleData = [
      { category: 'Groceries', amount: 145.50, color: '#4A90E2' },
      { category: 'Transport', amount: 45.00, color: '#2ECC71' },
      { category: 'Food & Dining', amount: 78.25, color: '#E74C3C' },
      { category: 'Entertainment', amount: 35.00, color: '#F39C12' },
      { category: 'Utilities', amount: 125.30, color: '#9B59B6' }
    ];
  }

  // Fetch daily expense data for a specific date
  async getDailyExpenses(date) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/expenses/daily?date=${date}`);
      // return await response.json();
      
      // For now, return sample data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.sampleData);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching daily expenses:', error);
      return [];
    }
  }

  // Calculate total spent from expense data
  calculateTotalSpent(expenseData) {
    return expenseData.reduce((sum, item) => sum + item.amount, 0);
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