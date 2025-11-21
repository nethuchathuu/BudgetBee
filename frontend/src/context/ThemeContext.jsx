import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    return localStorage.getItem('budgetbee-theme') || 'light';
  });
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load theme from database on mount
  useEffect(() => {
    const loadThemeFromDB = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          const response = await fetch(`http://localhost:5000/api/user/theme/${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.theme) {
              setTheme(data.theme);
              localStorage.setItem('budgetbee-theme', data.theme);
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme from database:', error);
        // Fallback to localStorage theme
      } finally {
        setThemeLoaded(true);
      }
    };

    loadThemeFromDB();
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('budgetbee-theme', theme);
    
    // Apply theme class to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
