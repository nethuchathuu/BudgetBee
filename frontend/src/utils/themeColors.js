// Theme color definitions
export const themeColors = {
  dark: {
    // Dark mode colors (from signin, signup, features, how it works, upload)
    background: {
      primary: '#0c111c',
      secondary: '#1a1f2c',
      tertiary: '#0a0f1a',
      gradient: 'from-[#0c111c] via-[#0a0f1a] to-[#0b1422]'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      muted: '#94a3b8'
    },
    accent: {
      primary: '#10b981', // emerald-400
      secondary: '#34d399',
      hover: '#059669'
    },
    border: {
      primary: 'rgba(16, 185, 129, 0.2)',
      secondary: 'rgba(16, 185, 129, 0.3)'
    },
    card: {
      background: '#1a1f2c',
      hover: '#252b3b'
    }
  },
  light: {
    // Light mode colors (from homepage, summaries, calendar)
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      gradient: 'from-white via-gray-50 to-gray-100'
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#6b7280'
    },
    accent: {
      primary: '#10b981',
      secondary: '#34d399',
      hover: '#059669'
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db'
    },
    card: {
      background: '#ffffff',
      hover: '#f9fafb'
    }
  }
};

// Helper function to get theme colors
export const getThemeColors = (theme) => {
  return themeColors[theme] || themeColors.light;
};

export default themeColors;
