// Chart service for Monthly Summary components
// Provides consistent styling and behavior across all monthly charts

export const monthlyChartService = {
  // Extended color palette for monthly data (more categories)
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
    cyan: '#00BCD4',
    lime: '#CDDC39',
    amber: '#FFC107'
  },

  // Monthly bar chart configuration (adjusted for more data)
  getMonthlyBarChartConfig() {
    return {
      margin: { top: 20, right: 30, left: 20, bottom: 80 },
      cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: "#f0f0f0"
      },
      xAxis: {
        tick: { fontSize: 11 },
        angle: -45,
        textAnchor: "end",
        height: 80,
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

  // Monthly pie chart configuration (larger for more categories)
  getMonthlyPieChartConfig() {
    return {
      innerRadius: 50,
      outerRadius: 130,
      stroke: "#ffffff",
      strokeWidth: 2,
      cx: "50%",
      cy: "50%"
    };
  },

  // Custom tooltip styles for monthly data
  getMonthlyTooltipStyles() {
    return {
      backgroundColor: 'white',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '200px'
    };
  },

  // Format currency for monthly amounts (larger numbers)
  formatCurrency(amount) {
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${Number(amount).toFixed(2)}`;
  },

  // Format percentage for budget and other ratios
  formatPercentage(value) {
    return `${Number(value).toFixed(1)}%`;
  },

  // Transform data for monthly charts
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

  // Shorten category names for better display
  shortenCategoryName(category) {
    const shortNames = {
      'Food & Dining': 'Food',
      'Entertainment': 'Fun',
      'Transportation': 'Transport',
      'Utilities': 'Bills',
      'Healthcare': 'Health',
      'Education': 'Education',
      'Shopping': 'Shopping',
      'Groceries': 'Groceries'
    };
    return shortNames[category] || category;
  },

  // Get responsive container props for monthly charts
  getResponsiveProps() {
    return {
      width: '100%',
      height: 350 // Slightly taller for monthly data
    };
  },

  // Calculate percentage for pie chart tooltips
  calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(1);
  },

  // Get chart colors array for multiple categories
  getColorArray() {
    return Object.values(this.colors);
  },

  // Generate color for category if not provided
  getColorForCategory(categoryIndex) {
    const colors = this.getColorArray();
    return colors[categoryIndex % colors.length];
  },

  // Monthly specific chart configurations
  getMonthlySpecificConfig() {
    return {
      animationDuration: 800,
      animationEasing: 'ease-out',
      showGrid: true,
      showLabels: true,
      compactMode: false
    };
  }
};

export default monthlyChartService;