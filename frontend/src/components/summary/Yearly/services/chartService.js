// Chart service for Yearly Summary components
// Handles chart formatting, colors, and visualization utilities

class YearlyChartService {
  constructor() {
    // Color palette for yearly charts
    this.colors = [
      '#4A90E2', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6',
      '#1ABC9C', '#34495E', '#E67E22', '#3498DB', '#27AE60',
      '#F1C40F', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'
    ];
  }

  // Format currency with K/M notation for large amounts
  formatCurrency(amount) {
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${Number(amount).toFixed(2)}`;
  }

  // Format percentage values
  formatPercentage(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  // Assign colors to expense data for consistency
  assignColors(expenseData) {
    return expenseData.map((item, index) => ({
      ...item,
      color: item.color || this.colors[index % this.colors.length]
    }));
  }

  // Prepare data for Bar Chart
  prepareBarChartData(expenseData) {
    return this.assignColors(expenseData).map(item => ({
      category: item.category,
      amount: item.amount,
      color: item.color,
      formattedAmount: this.formatCurrency(item.amount)
    }));
  }

  // Prepare data for Pie Chart
  preparePieChartData(expenseData) {
    return this.assignColors(expenseData).map(item => ({
      name: item.category,
      value: item.amount,
      category: item.category,
      amount: item.amount,
      color: item.color,
      formattedAmount: this.formatCurrency(item.amount)
    }));
  }

  // Calculate chart statistics
  getChartStats(expenseData) {
    const totalAmount = expenseData.reduce((sum, item) => sum + item.amount, 0);
    
    return expenseData.map(item => ({
      ...item,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
      formattedPercentage: totalAmount > 0 ? this.formatPercentage((item.amount / totalAmount) * 100) : '0%'
    }));
  }

  // Get top N categories by spending
  getTopCategories(expenseData, limit = 5) {
    return [...expenseData]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        formattedAmount: this.formatCurrency(item.amount)
      }));
  }

  // Generate yearly trend data (mock implementation)
  generateYearlyTrendData(expenseData, year) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const totalYearly = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const baseMonthly = totalYearly / 12;

    return months.map((month, index) => {
      // Mock: add some variation to make it look realistic
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const amount = baseMonthly * (1 + variation);
      
      return {
        month,
        amount: Math.max(0, amount),
        formattedAmount: this.formatCurrency(amount),
        index
      };
    });
  }

  // Generate category comparison data
  generateCategoryComparison(currentData, previousData = null) {
    return currentData.map(item => {
      const previousItem = previousData?.find(prev => prev.category === item.category);
      const change = previousItem ? 
        ((item.amount - previousItem.amount) / previousItem.amount) * 100 : 0;

      return {
        ...item,
        previousAmount: previousItem?.amount || 0,
        change,
        changeDirection: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'same',
        formattedChange: this.formatPercentage(Math.abs(change))
      };
    });
  }

  // Calculate spending velocity (spending rate over time)
  calculateSpendingVelocity(expenseData, timeframe = 'yearly') {
    const totalAmount = expenseData.reduce((sum, item) => sum + item.amount, 0);
    
    const periods = {
      'yearly': 365,
      'monthly': 30,
      'weekly': 7,
      'daily': 1
    };

    const days = periods[timeframe] || 365;
    const velocity = totalAmount / days;

    return {
      velocity,
      formattedVelocity: this.formatCurrency(velocity),
      timeframe,
      description: `Average ${this.formatCurrency(velocity)} per ${timeframe.slice(0, -2)}`
    };
  }

  // Generate budget progress data
  generateBudgetProgress(expenseData, yearlyBudget = 180000) {
    const totalSpent = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const remaining = Math.max(0, yearlyBudget - totalSpent);
    const usagePercentage = (totalSpent / yearlyBudget) * 100;

    return {
      budget: yearlyBudget,
      spent: totalSpent,
      remaining,
      usagePercentage,
      formattedBudget: this.formatCurrency(yearlyBudget),
      formattedSpent: this.formatCurrency(totalSpent),
      formattedRemaining: this.formatCurrency(remaining),
      formattedUsage: this.formatPercentage(usagePercentage),
      status: usagePercentage > 100 ? 'over' : usagePercentage > 80 ? 'warning' : 'good'
    };
  }

  // Custom tooltip formatter for charts
  formatTooltip(value, name, props) {
    return [this.formatCurrency(value), name];
  }

  // Format axis labels for better readability
  formatAxisLabel(value, type = 'currency') {
    switch (type) {
      case 'currency':
        return this.formatCurrency(value);
      case 'percentage':
        return this.formatPercentage(value);
      case 'number':
        return Number(value).toLocaleString();
      default:
        return value;
    }
  }

  // Generate chart configuration for responsive design
  getResponsiveConfig(chartType = 'bar') {
    const baseConfig = {
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    const configs = {
      bar: {
        ...baseConfig,
        barCategoryGap: '10%'
      },
      pie: {
        ...baseConfig,
        innerRadius: 40,
        outerRadius: 140
      },
      line: {
        ...baseConfig,
        strokeWidth: 2
      }
    };

    return configs[chartType] || baseConfig;
  }
}

// Export singleton instance
export default new YearlyChartService();
