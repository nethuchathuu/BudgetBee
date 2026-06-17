import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Calendar = ({ selectedDate, onDateSelect, onClose, isOpen }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  // Always get current date fresh to avoid stale "today" highlighting
  const today = useMemo(() => new Date(), [isOpen]);
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  // Helper function to format date as YYYY-MM-DD using local time
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
        date: formatDateLocal(date),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDateLocal(date);
      const isToday = dateString === formatDateLocal(today);
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
        date: formatDateLocal(date),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  }, [currentDate, selectedDate, daysInMonth, daysFromPrevMonth, today]);

  // Get unique weeks with simple sequential numbering (1, 2, 3, 4, 5, 6)
  const weeks = useMemo(() => {
    return [1, 2, 3, 4, 5, 6];
  }, []);

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
      navigate('/daily-summary', { state: { selectedDate: new Date(day.date) } });
    }
  };

  const handleMonthClick = () => {
    onClose?.();
    // Navigate to MonthlySum component
    navigate('/monthly-summary', { 
      state: { selectedMonth: currentDate } 
    });
  };

  const handleYearClick = () => {
    onClose?.();
    // Navigate to YearlySum component
    navigate('/yearly-summary', { 
      state: { selectedYear: currentDate.getFullYear() } 
    });
  };

  // Helper function to get start of week for a given week number
  const getStartOfWeek = (month, weekNumber) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOfFirstWeek = new Date(firstDay);
    startOfFirstWeek.setDate(firstDay.getDate() - firstDay.getDay() + 1); // Monday as start
    
    const targetWeek = new Date(startOfFirstWeek);
    targetWeek.setDate(startOfFirstWeek.getDate() + (weekNumber - 1) * 7);
    
    return targetWeek;
  };

  const handleWeekClick = (weekNumber) => {
    onClose?.();
    const weekStart = getStartOfWeek(currentDate, weekNumber);
    // Navigate to WeeklySum component
    navigate('/weekly-summary', { 
      state: { selectedWeek: weekStart } 
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
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Glass Morphism Overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-md pointer-events-auto"
        onClick={onClose}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(12,17,28,0.3), rgba(16,185,129,0.1), rgba(59,130,246,0.1))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(16,185,129,0.1), rgba(59,130,246,0.1))',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)'
        }}
      />
      
      {/* Calendar Dropdown - Positioned relative to button */}
      <div className="absolute top-20 right-6 pointer-events-auto">
        <div 
          className={`backdrop-blur-xl rounded-2xl shadow-2xl border w-[420px] overflow-hidden ${
            isDark ? 'border-emerald-400/20' : 'border-white/30'
          }`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(26,31,44,0.95), rgba(26,31,44,0.9))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(52,211,153,0.2)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Glassmorphism Header */}
          <div 
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-emerald-400/20' : 'border-white/20'
            }`}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))'
                : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))',
            }}
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Calendar
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                isDark ? 'hover:bg-[#0c111c]/30 text-gray-300' : 'hover:bg-white/20 text-gray-600'
              }`}
              aria-label="Close calendar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Content */}
          <div className="p-6">
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-6 notranslate" translate="no">
              <button
                onClick={handlePrevMonth}
                className={`p-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                  isDark ? 'hover:bg-[#0c111c]/30' : 'hover:bg-white/30'
                }`}
                aria-label="Previous month"
              >
                <ChevronLeft className={`h-5 w-5 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMonthClick}
                  className={`text-lg font-semibold transition-colors cursor-pointer px-2 py-1 rounded-lg ${
                    isDark
                      ? 'text-white hover:text-emerald-400 hover:bg-[#0c111c]/30'
                      : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/20'
                  }`}
                >
                  {formatMonth(currentDate)}
                </button>
                <button
                  onClick={handleYearClick}
                  className={`text-lg font-semibold transition-colors cursor-pointer px-2 py-1 rounded-lg ${
                    isDark
                      ? 'text-white hover:text-emerald-400 hover:bg-[#0c111c]/30'
                      : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/20'
                  }`}
                >
                  {formatYear(currentDate)}
                </button>
              </div>
              
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                  isDark ? 'hover:bg-[#0c111c]/30' : 'hover:bg-white/30'
                }`}
                aria-label="Next month"
              >
                <ChevronRight className={`h-5 w-5 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-8 gap-1 notranslate" translate="no">
              {/* Week Label Header */}
              <div className={`text-center text-xs font-semibold py-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Week
              </div>
              
              {/* Weekday Headers */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className={`backdrop-blur-sm p-2 text-center text-sm font-medium rounded border ${
                    isDark
                      ? 'bg-[#0c111c]/50 text-gray-300 border-emerald-400/20'
                      : 'bg-gradient-to-br from-emerald-50/80 to-blue-50/80 text-emerald-700 border-white/30'
                  }`}
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
                    className={`text-center text-xs py-2 rounded transition-all duration-200 cursor-pointer font-medium backdrop-blur-sm border ${
                      isDark
                        ? 'bg-[#0c111c] text-emerald-400 hover:text-emerald-300 hover:bg-[#0a0f1a] border-emerald-400/20'
                        : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/30 border-white/20'
                    }`}
                  >
                    {weekNumber}
                  </button>
                  
                  {/* Days for this week */}
                  {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                    let buttonClass = `w-full h-10 rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm border ${
                      isDark ? 'border-emerald-400/10' : 'border-white/20'
                    }`;
                    
                    if (day.isCurrentMonth) {
                      buttonClass += isDark
                        ? ' text-gray-300 hover:bg-[#0c111c] hover:scale-105'
                        : ' text-gray-700 hover:bg-white/40 hover:scale-105';
                    } else {
                      buttonClass += isDark
                        ? ' text-gray-600 hover:text-gray-500'
                        : ' text-gray-400 hover:text-gray-600';
                    }
                    
                    if (day.isToday && day.isSelected) {
                      buttonClass += isDark
                        ? ' bg-gradient-to-br from-emerald-500 to-emerald-600 text-black font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg'
                        : ' bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold hover:from-emerald-700 hover:to-emerald-800 shadow-lg';
                    } else if (day.isToday) {
                      buttonClass += isDark
                        ? ' bg-gradient-to-br from-emerald-500 to-emerald-600 text-black font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg'
                        : ' bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg';
                    } else if (day.isSelected) {
                      buttonClass += isDark
                        ? ' bg-gradient-to-br from-emerald-400 to-emerald-500 text-black font-semibold hover:from-emerald-500 hover:to-emerald-600 shadow-md'
                        : ' bg-gradient-to-br from-emerald-400 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-600 shadow-md';
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
            <div className={`mt-6 pt-4 border-t ${
              isDark ? 'border-emerald-400/20' : 'border-white/20'
            }`}>
              <div className={`text-center text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <button
                  onClick={() => handleDateClick({ date: today.toISOString().split('T')[0], isCurrentMonth: true })}
                  className={`font-medium px-3 py-1 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-[#0c111c]'
                      : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/20'
                  }`}
                >
                  Go to Today ({today.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;