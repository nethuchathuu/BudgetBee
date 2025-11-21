import React from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import SumNav from '../../sumNav';
import dataService from '../services/dataService';

const Header = ({ 
  currentMonth, 
  onNavigateMonth, 
  onDownloadStructured,
  isLoading = false 
}) => {
  const { theme } = useTheme();
  
  const handlePrevMonth = () => {
    onNavigateMonth(-1);
  };

  const handleNextMonth = () => {
    onNavigateMonth(1);
  };

  return (
    <>
      {/* Navigation */}
      <SumNav pageTitle="Monthly Summary" />
      
      {/* Month Navigation & PDF Download */}
      <div className={`rounded-xl shadow-lg p-6 border ${
        theme === 'dark'
          ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-emerald-600/10'
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                theme === 'dark' ? 'hover:bg-[#0c111c]' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar style={{ color: theme === 'dark' ? '#34d399' : '#4A90E2' }} size={20} />
              <span className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {dataService.formatMonth(currentMonth)}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                theme === 'dark' ? 'hover:bg-[#0c111c]' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} size={24} />
            </button>
          </div>

          {/* PDF Download */}
          <button
            onClick={onDownloadStructured}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#4A90E2] hover:opacity-90 text-white'
            }`}
          >
            <Download size={20} />
            {isLoading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;