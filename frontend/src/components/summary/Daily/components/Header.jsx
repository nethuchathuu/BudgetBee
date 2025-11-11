import React from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import SumNav from '../../sumNav';
import dataService from '../services/dataService';

const Header = ({ 
  currentDate, 
  onNavigateDate, 
  onDownloadStructured,
  isLoading = false 
}) => {
  const handlePrevDate = () => {
    onNavigateDate(-1);
  };

  const handleNextDate = () => {
    onNavigateDate(1);
  };

  return (
    <>
      {/* Navigation */}
      <SumNav pageTitle="Daily Summary" />
      
      {/* Date Navigation & PDF Download */}
      <div className="bg-white rounded-xl shadow-lg p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevDate}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="text-gray-600" size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar style={{ color: '#4A90E2' }} size={20} />
              <span className="text-xl font-semibold text-gray-800">
                {dataService.formatDate(currentDate)}
              </span>
            </div>

            <button
              onClick={handleNextDate}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRight className="text-gray-600" size={24} />
            </button>
          </div>

          {/* PDF Download */}
          <button
            onClick={onDownloadStructured}
            disabled={isLoading}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4A90E2' }}
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