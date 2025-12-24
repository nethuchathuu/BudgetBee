import React from 'react';

export default function DiaryPage({ 
  date, 
  content, 
  isEditable, 
  onChange, 
  isLeftPage,
  mood,
  onMoodChange,
  isDark 
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const moods = ['😊', '😔', '😐', '😍', '😤', '🤔'];

  return (
    <div className={`diary-page ${isLeftPage ? 'left-page' : 'right-page'}`}>
      <div className="page-content">
        <div className="page-date">{formatDate(date)}</div>
        
        {isEditable ? (
          <>
            <textarea
              className="page-text"
              value={content || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Something that keeps you moving forward…"
              style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            />
            
            {/* Mood Selector */}
            <div className="mood-selector">
              {moods.map((m) => (
                <button
                  key={m}
                  className={`mood-button ${mood === m ? 'selected' : ''}`}
                  onClick={() => onMoodChange(m)}
                  type="button"
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        ) : content ? (
          <>
            <div className="page-text" style={{ whiteSpace: 'pre-wrap' }}>
              {content}
            </div>
            {mood && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', fontSize: '1.5rem' }}>
                {mood}
              </div>
            )}
          </>
        ) : (
          <div className="empty-page-message">
            No entry for this day
          </div>
        )}
      </div>
    </div>
  );
}
