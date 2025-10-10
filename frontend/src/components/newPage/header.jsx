import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const Header = ({ date, onDateClick, title = "Today Expenses" }) => {
  const formatDate = (dateString) => {
    let dateObj;
    if (typeof dateString === 'string') {
      dateObj = new Date(dateString + 'T00:00:00');
    } else if (dateString instanceof Date) {
      dateObj = dateString;
    } else {
      dateObj = new Date(); // Fallback to current date
    }
    
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(); // Fallback if invalid date
    }
    
    return dateObj.toLocaleDateString('en-LK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    let dateObj;
    if (typeof dateString === 'string') {
      dateObj = new Date(dateString + 'T00:00:00');
    } else if (dateString instanceof Date) {
      dateObj = dateString;
    } else {
      dateObj = new Date(); // Fallback to current date
    }
    
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(); // Fallback if invalid date
    }
    
    return dateObj.toLocaleDateString('en-LK', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600 text-lg">
              {formatDate(date)}
            </p>
          </div>

          {/* Date Pill */}
          <div className="flex items-center">
            <button
              onClick={onDateClick}
              className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span className="text-gray-700 font-medium">
                {formatDateShort(date)}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;