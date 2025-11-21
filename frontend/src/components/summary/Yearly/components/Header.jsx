import React from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

const Header = ({ 
  currentYear, 
  onNavigateYear, 
  onDownloadStructured 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg p-6 border ${
      theme === 'dark'
        ? 'bg-[#1a1f2c] border-emerald-400/20 shadow-emerald-600/10'
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        {/* Year Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateYear(-1)}
            className={`p-2 rounded-lg transition-colors ${
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
              Year {currentYear}
            </span>
          </div>

          <button
            onClick={() => onNavigateYear(1)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-[#0c111c]' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} size={24} />
          </button>
        </div>

        {/* PDF Download */}
        <button
          onClick={onDownloadStructured}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#4A90E2] hover:opacity-90 text-white'
          }`}
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Header;
