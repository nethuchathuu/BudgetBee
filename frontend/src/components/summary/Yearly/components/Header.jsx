import React from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';

const Header = ({ 
  currentYear, 
  onNavigateYear, 
  onDownloadStructured 
}) => {
  return (
    <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        {/* Year Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateYear(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="text-gray-600" size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar style={{ color: '#4A90E2' }} size={20} />
            <span className="text-xl font-semibold text-gray-800">
              Year {currentYear}
            </span>
          </div>

          <button
            onClick={() => onNavigateYear(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="text-gray-600" size={24} />
          </button>
        </div>

        {/* PDF Download */}
        <button
          onClick={onDownloadStructured}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#4A90E2' }}
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Header;
