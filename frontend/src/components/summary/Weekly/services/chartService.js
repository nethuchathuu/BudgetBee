// Chart service for Weekly Summary components
// Provides consistent styling and behavior across all weekly charts

export const weeklyChartService = {
  // Weekly color palette (7 colors for typical weekly categories)
  colors: {
    primary: '#4A90E2',
    secondary: '#2ECC71',
    accent: '#E74C3C', 
    warning: '#F39C12',
    purple: '#9B59B6',
    teal: '#1ABC9C',
    dark: '#34495E',
    orange: '#E67E22',
    pink: '#E91E63',
    cyan: '#00BCD4'
  },

  // Weekly bar chart configuration
  getWeeklyBarChartConfig() {
    return {
      margin: { top: 20, right: 30, left: 20, bottom: 70 },
      cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: "#f0f0f0"
      },
      xAxis: {
        tick: { fontSize: 11 },
        angle: -45,
        textAnchor: "end",
        height: 70,
        interval: 0
      },
      yAxis: {
        tick: { fontSize: 12 }
      },
      bar: {
        fill: this.colors.primary,
        radius: [4, 4, 0, 0]
      }
    };
  },

  // Weekly pie chart configuration (medium size)
  getWeeklyPieChartConfig() {
    return {
      innerRadius: 55,
      outerRadius: 110,
      stroke: "#ffffff",
      strokeWidth: 2,
      cx: "50%",
      cy: "50%"
    };
  },

  // Custom tooltip styles for weekly data
  getWeeklyTooltipStyles() {
    return {
      backgroundColor: 'white',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '180px'
    };
  },

  // Format currency for weekly amounts
  formatCurrency(amount) {
    if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${Number(amount).toFixed(2)}`;
  },

  // Format percentage for weekly comparisons
  formatPercentage(value) {
    return `${Number(value).toFixed(1)}%`;
  },

  // Transform data for weekly charts
  transformDataForChart(data, chartType = 'bar') {
    switch (chartType) {
      case 'bar':
        return data.map(item => ({
          ...item,
          formattedAmount: this.formatCurrency(item.amount),
          shortCategory: this.shortenCategoryName(item.category)
        }));
      case 'pie':
        return data.map(item => ({
          name: item.category,
          value: item.amount,
          color: item.color,
          formattedValue: this.formatCurrency(item.amount)
        }));
      default:
        return data;
    }
  },

  // Shorten category names for better weekly display
  shortenCategoryName(category) {
    const shortNames = {
      'Food & Dining': 'Food',
      'Entertainment': 'Fun',
      'Transportation': 'Transport',
      'Utilities': 'Bills',
      'Healthcare': 'Health',
      'Education': 'Study',
      'Shopping': 'Shopping',
      'Groceries': 'Grocery'
    };
    return shortNames[category] || category;
  },

  // Get responsive container props for weekly charts
  getResponsiveProps() {
    return {
      width: '100%',
      height: 320 // Medium height for weekly data
    };
  },

  // Calculate percentage for pie chart tooltips
  calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(1);
  },

  // Get chart colors array for weekly categories
  getColorArray() {
    return Object.values(this.colors);
  },

  // Generate color for category if not provided
  getColorForCategory(categoryIndex) {
    const colors = this.getColorArray();
    return colors[categoryIndex % colors.length];
  },

  // Weekly specific chart configurations
  getWeeklySpecificConfig() {
    return {
      animationDuration: 600,
      animationEasing: 'ease-in-out',
      showGrid: true,
      showLabels: true,
      compactMode: true // More compact for weekly view
    };
  },

  // Format week range for chart titles and labels
  formatWeekRange(startDate, endDate) {
    const options = { month: 'short', day: 'numeric' };
    const start = startDate.toLocaleDateString('en-US', options);
    const end = endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });
    return `${start} - ${end}`;
  },

  // Get day names for weekly breakdown charts (if needed)
  getDayNames() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  },

  // Weekly trend indicators
  getTrendIndicator(currentValue, previousValue) {
    if (previousValue === 0) return { trend: 'new', change: 0 };
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    let trend = 'stable';
    
    if (change > 5) trend = 'increasing';
    else if (change < -5) trend = 'decreasing';
    
    return { trend, change: Math.abs(change) };
  }
};

export default weeklyChartService;