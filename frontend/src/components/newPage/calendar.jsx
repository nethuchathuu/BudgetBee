import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selectedDate, onDateSelect, onMonthChange }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate + 'T00:00:00') : today
  );

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

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  // Calculate week numbers within the month
  const weeks = useMemo(() => {
    const weekNumbers = [];
    for (let i = 0; i < 6; i++) {
      weekNumbers.push(i + 1);
    }
    return weekNumbers;
  }, []);

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-LK', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleDateClick = (day) => {
    if (day.isCurrentMonth) {
      onDateSelect?.(day.date);
    }
  };

  const handleKeyDown = (event, day) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDateClick(day);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="bg-emerald-50 p-4 rounded-t-xl border-b border-emerald-100">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-emerald-800 font-semibold text-lg">
            {formatMonth(currentDate)}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Labels and Days Grid */}
        <div className="grid grid-cols-8 gap-1">
          {/* Week Label Header */}
          <div className="text-center text-xs font-semibold text-gray-500 py-2">
            Week
          </div>
          
          {/* Weekday Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600 rounded"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days with Week Labels */}
          {weeks.map((weekNumber) => (
            <React.Fragment key={weekNumber}>
              {/* Week Label */}
              <div className="text-center text-xs text-gray-500 py-2 flex items-center justify-center">
                Week {weekNumber}
              </div>
              
              {/* Days for this week */}
              {calendarDays.slice((weekNumber - 1) * 7, weekNumber * 7).map((day, dayIndex) => {
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
      </div>

      {/* Footer with Today's Date */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-center text-sm text-gray-600">
          <button
            onClick={() => handleDateClick({ date: formatDateLocal(today), isCurrentMonth: true })}
            className="text-emerald-600 hover:text-emerald-800 font-medium"
          >
            Go to Today ({today.toLocaleDateString('en-LK', { day: '2-digit', month: 'short' })})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;