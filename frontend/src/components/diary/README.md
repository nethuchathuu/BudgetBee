# Diary Feature - BudgetBee

## Overview
A realistic diary book interface where users can write daily entries. The diary displays a two-page spread with yesterday's entry on the left (read-only) and today's entry on the right (editable).

## Features

### User Interface
- **Realistic Book Design**: Paper texture, binding spine, and authentic page styling
- **Two-Page Spread**:
  - Left Page: Yesterday's entry (read-only)
  - Right Page: Current day's entry (editable)
- **Navigation**: Previous/Next day buttons with date display
- **Mood Tracker**: Select emoji mood for each entry
- **Auto-Save**: Entries save automatically 2 seconds after typing stops
- **Save Status Indicator**: Shows saving/saved/error states

### Backend Features
- **RESTful API**: Full CRUD operations for diary entries
- **Authentication**: JWT token-based authentication required
- **Date-Based Storage**: One entry per user per day
- **Mood Storage**: Optional mood emoji for each entry

## Database Schema

```sql
CREATE TABLE diary_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_date (user_id, entry_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Get Diary Entry
```
GET /api/diary/:date
Headers: Authorization: Bearer <token>
Response: { success: true, data: { id, user_id, entry_date, content, mood } }
```

### Save/Update Diary Entry
```
POST /api/diary
Headers: Authorization: Bearer <token>
Body: { date: "YYYY-MM-DD", content: "...", mood: "😊" }
Response: { success: true, message: "Diary entry saved successfully" }
```

### Get All Entries
```
GET /api/diary?limit=30
Headers: Authorization: Bearer <token>
Response: { success: true, data: [...] }
```

### Delete Entry
```
DELETE /api/diary/:date
Headers: Authorization: Bearer <token>
Response: { success: true, message: "Diary entry deleted successfully" }
```

## Components

### DiaryBook.jsx
Main container component that manages state and API calls.
- Handles date navigation
- Fetches diary entries from backend
- Auto-saves content changes
- Displays save status

### DiaryPage.jsx
Renders individual diary page (left or right).
- Read-only or editable mode
- Displays date, content, and mood
- Styled like real diary paper with lines

### DiaryNavigation.jsx
Navigation controls for moving between days.
- Previous/Next day buttons
- Current date display
- Prevents navigation beyond today

### diary.css
Realistic diary book styling.
- Paper texture and color
- Lined paper effect
- Book spine separator
- Responsive design for mobile

## Installation & Setup

### 1. Database Setup
Run the SQL script to create the diary_entries table:
```bash
mysql -u your_username -p your_database < Backend/database/diary_table.sql
```

### 2. Backend Setup
The backend routes are automatically configured. Ensure your server is running:
```bash
cd Backend
nodemon
```

### 3. Frontend Setup
The diary route is already added to App.jsx. Start the frontend:
```bash
cd frontend
npm run dev
```

### 4. Access the Diary
Click the "Diary" button in the navigation bar or navigate to `/diary`

## Usage

1. **Writing Entries**: Click on the right page and start typing. The entry saves automatically.
2. **Selecting Mood**: Click on an emoji at the bottom of the right page to set your mood.
3. **Viewing Past Entries**: Use the Previous/Next buttons to navigate through days.
4. **Reading Yesterday**: The left page always shows yesterday's entry (read-only).

## Features in Detail

### Auto-Save System
- Saves 2 seconds after user stops typing
- Shows "Saving..." indicator while saving
- Shows "Saved" confirmation when complete
- Shows error state if save fails

### Date Navigation
- Previous button: Always available, goes back one day
- Next button: Disabled if viewing today (can't view future)
- Date display: Shows current viewing date in full format

### Responsive Design
- Desktop: Side-by-side pages
- Mobile: Stacked pages with adjusted styling
- Maintains diary aesthetic across all screen sizes

### Dark Mode Support
- Automatically adapts to system preferences
- Dark paper background in dark mode
- Adjusted text colors for readability

## File Structure
```
frontend/src/components/diary/
├── DiaryBook.jsx          # Main container
├── DiaryPage.jsx          # Individual page component
├── DiaryNavigation.jsx    # Navigation controls
└── diary.css              # Diary-specific styles

Backend/
├── controllers/diary_controller/
│   └── diaryController.js # API logic
├── routes/
│   └── diaryRouter.js     # Route definitions
└── database/
    └── diary_table.sql    # Database schema
```

## Customization

### Changing Moods
Edit the `moods` array in `DiaryPage.jsx`:
```javascript
const moods = ['😊', '😔', '😐', '😍', '😤', '🤔'];
```

### Adjusting Auto-Save Delay
Modify the timeout in `DiaryBook.jsx`:
```javascript
setTimeout(() => {
  if (newContent.trim()) {
    saveDiaryEntry(currentDate, newContent, rightPageMood);
  }
}, 2000); // Change 2000 to desired milliseconds
```

### Styling
All diary-specific styles are in `diary.css`. Modify CSS variables for colors, fonts, and spacing.

## Future Enhancements
- Search functionality across all entries
- Export diary as PDF
- Attach photos to entries
- Calendar view of all entries
- Entry statistics and insights
- Rich text formatting
- Tags and categories

## Troubleshooting

### Entries Not Saving
- Check browser console for errors
- Verify JWT token is valid in localStorage
- Ensure backend server is running
- Check database connection

### Navigation Not Working
- Verify date format is YYYY-MM-DD
- Check browser console for errors
- Ensure state updates are triggering re-renders

### Styling Issues
- Clear browser cache
- Check if diary.css is imported correctly
- Verify Tailwind classes are not conflicting
