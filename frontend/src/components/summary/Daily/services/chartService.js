// Chart service for reusable chart configurations and transformations
// Provides consistent styling and behavior across all charts

export const chartService = {
  // Common chart colors
  colors: {
    primary: '#4A90E2',
    secondary: '#2ECC71',
    accent: '#E74C3C',
    warning: '#F39C12',
    purple: '#9B59B6',
    gray: '#95A5A6'
  },

  // Bar chart configuration
  getBarChartConfig() {
    return {
      margin: { top: 20, right: 30, left: 20, bottom: 60 },
      cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: "#f0f0f0"
      },
      xAxis: {
        tick: { fontSize: 12 },
        angle: -45,
        textAnchor: "end",
        height: 60
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

  // Pie chart configuration
  getPieChartConfig() {
    return {
      innerRadius: 60,
      outerRadius: 120,
      stroke: "#ffffff",
      strokeWidth: 2,
      cx: "50%",
      cy: "50%"
    };
  },

  // Custom tooltip styles
  getTooltipStyles() {
    return {
      backgroundColor: 'white',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };
  },

  // Format currency for tooltips and labels
  formatCurrency(amount) {
    return `Rs. ${Number(amount).toFixed(2)}`;
  },

  // Transform data for charts if needed
  transformDataForChart(data, chartType = 'bar') {
    switch (chartType) {
      case 'bar':
        return data.map(item => ({
          ...item,
          formattedAmount: this.formatCurrency(item.amount)
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

  // Get responsive container props
  getResponsiveProps() {
    return {
      width: '100%',
      height: 300
    };
  }
};

export default chartService;