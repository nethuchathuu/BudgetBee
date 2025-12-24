import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Check, AlertCircle } from 'lucide-react';

export default function DiaryNavigation({ 
  currentDate, 
  onPreviousDay, 
  onNextDay, 
  onDateSelect,
  canGoNext,
  isDark,
  saveStatus
}) {
  const formatDisplayDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="diary-navigation">
      <button
        onClick={onPreviousDay}
        className="nav-button"
        title="Previous Day"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-4">
        <div className="nav-date-display">
          {formatDisplayDate(currentDate)}
        </div>
        
        {/* Save Status Indicator */}
        {saveStatus && (
          <div className={`save-status-inline ${saveStatus}`}>
            {saveStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
                <span className="text-xs">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3" />
                <span className="text-xs">Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">Error</span>
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onNextDay}
        disabled={!canGoNext}
        className="nav-button"
        title="Next Day"
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
