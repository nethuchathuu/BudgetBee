import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calendar = ({ selectedDate, onDateSelect, onClose, isOpen }) => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : today
  );

  // Helper function to get week number of month
  const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekday = firstDayOfMonth.getDay();
    return Math.ceil((date.getDate() + firstWeekday) / 7);
  };

  // Get the first day of the month and calculate calendar grid
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate previous month days to show
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysFromPrevMonth = firstDayOfWeek;

  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];

    // Previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      days.push({
        day,
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = dateString === today.toISOString().split('T')[0];
      const isSelected = selectedDate && dateString === selectedDate;

      days.push({
        day,
        date: dateString,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }

    // Next month days to complete the grid
    const totalCells = 42; // 6 weeks × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({
        day,
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  }, [currentDate, selectedDate, daysInMonth, daysFromPrevMonth, today]);

  // Get unique weeks with proper week numbers
  const weeks = useMemo(() => {
    const weekNumbers = [];
    for (let i = 0; i < 6; i++) {
      const firstDayOfWeek = calendarDays[i * 7];
      if (firstDayOfWeek && firstDayOfWeek.isCurrentMonth) {
        const weekDate = new Date(firstDayOfWeek.date);
        const weekNum = getWeekOfMonth(weekDate);
        weekNumbers.push(weekNum);
      } else {
        weekNumbers.push(i + 1);
      }
    }
    return weekNumbers;
  }, [calendarDays]);

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const formatYear = (date) => {
    return date.getFullYear();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (day.isCurrentMonth) {
      onDateSelect?.(day.date);
      onClose?.();
      // Navigate to DailySum component
      navigate('/summary/daily', { state: { selectedDate: day.date } });
    }
  };

  const handleMonthClick = () => {
    onClose?.();
    // Navigate to MonthlySum component
    navigate('/summary/monthly', { 
      state: { 
        selectedMonth: currentDate.getMonth() + 1,
        selectedYear: currentDate.getFullYear()
      } 
    });
  };

  const handleYearClick = () => {
    onClose?.();
    // Navigate to YearlySum component
    navigate('/summary/yearly', { 
      state: { selectedYear: currentDate.getFullYear() } 
    });
  };

  const handleWeekClick = (weekNumber) => {
    onClose?.();
    // Navigate to WeeklySum component
    navigate('/summary/weekly', { 
      state: { 
        selectedWeek: weekNumber,
        selectedMonth: currentDate.getMonth() + 1,
        selectedYear: currentDate.getFullYear()
      } 
    });
  };

  const handleKeyDown = (event, day) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDateClick(day);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Calendar Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-[450px] max-h-[90vh] overflow-hidden">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close calendar"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Content */}
        <div className="p-6">
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5 text-emerald-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMonthClick}
                className="text-lg font-semibold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {formatMonth(currentDate)}
              </button>
              <button
                onClick={handleYearClick}
                className="text-lg font-semibold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {formatYear(currentDate)}
              </button>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-8 gap-1">
            {/* Week Label Header */}
            <div className="text-center text-xs font-semibold text-gray-500 py-2">
              Week
            </div>
            
            {/* Weekday Headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-emerald-50 p-2 text-center text-sm font-medium text-emerald-700 rounded"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days with Week Labels */}
            {weeks.map((weekNumber, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {/* Week Number */}
                <button
                  onClick={() => handleWeekClick(weekNumber)}
                  className="text-center text-xs text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 py-2 rounded transition-colors cursor-pointer font-medium"
                >
                  {weekNumber}
                </button>
                
                {/* Days for this week */}
                {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                  let buttonClass = "w-full h-10 rounded-lg transition-all duration-200 text-sm font-medium";
                  
                  if (day.isCurrentMonth) {
                    buttonClass += " text-gray-700 hover:bg-emerald-50";
                  } else {
                    buttonClass += " text-gray-400 hover:text-gray-600";
                  }
                  
                  if (day.isToday && day.isSelected) {
                    buttonClass += " bg-emerald-600 text-white font-bold hover:bg-emerald-700";
                  } else if (day.isToday) {
                    buttonClass += " bg-emerald-500 text-white font-bold hover:bg-emerald-600";
                  } else if (day.isSelected) {
                    buttonClass += " bg-emerald-400 text-white font-semibold hover:bg-emerald-500";
                  }

                  return (
                    <button
                      key={`${day.date}-${dayIndex}`}
                      onClick={() => handleDateClick(day)}
                      onKeyDown={(e) => handleKeyDown(e, day)}
                      className={buttonClass}
                      disabled={!day.isCurrentMonth}
                      aria-label={`Select ${day.date}`}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Footer with Today's Date */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              <button
                onClick={() => handleDateClick({ date: today.toISOString().split('T')[0], isCurrentMonth: true })}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Go to Today ({today.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;