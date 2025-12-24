import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/NavHome";
import CurrentDay from "../components/dashboard/CurrentDay";
import CurrentWeek from "../components/dashboard/CurrentWeek";
import CurrentMonth from "../components/dashboard/CurrentMonth";
import CurrentYear from "../components/dashboard/CurrentYear";
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  
  // Get default dashboard from localStorage (set in SetHome settings)
  const [currentView, setCurrentView] = useState(() => {
    const defaultDashboard = localStorage.getItem('budgetbee-default-dashboard');
    return defaultDashboard || 'daily'; // Default to 'daily' if not set
  });

  const renderCurrentView = () => {
    switch (currentView) {
      case 'daily':
        return <CurrentDay />;
      case 'weekly':
        return <CurrentWeek />;
      case 'monthly':
        return <CurrentMonth />;
      case 'yearly':
        return <CurrentYear />;
      default:
        return <CurrentDay />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />
      
      {/* Navigation Bar for Summary Views */}
      

      {/* Main Content */}
      <main className={`flex-grow ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
        {renderCurrentView()}
      </main>
    </div>
  );
}
