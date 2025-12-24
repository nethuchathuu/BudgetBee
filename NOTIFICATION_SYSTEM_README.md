# Notification System Documentation

## Overview
The BudgetBee notification system alerts users when they exceed their spending limits across daily, weekly, monthly, and yearly periods.

## Features

### 1. Notification Page (`/notification`)
- **Design**: Glass-morphism effect with backdrop blur
- **Layout**: Centered container (max-width: 768px)
- **Notification States**:
  - **Unread**: Bold text + emerald border glow + shadow
  - **Read**: Normal text + gray border
- **Actions**:
  - Mark as Read (✓)
  - Delete (🗑️)
  - Mark All as Read

### 2. Notification Badge
- **Location**: Bell icon in NavHome
- **Display**: Red badge with unread count
- **Updates**: Auto-refreshes every 30 seconds
- **Max Display**: Shows "99+" for counts > 99

### 3. Spending Limits Configuration (`/settings/notLimit`)
Four configurable limits:
- **Daily Limit** (📅 Blue)
- **Weekly Limit** (📊 Purple)
- **Monthly Limit** (📈 Green)
- **Yearly Limit** (🎯 Yellow)

Each limit includes:
- Amount input (Rs.)
- Enable/Disable toggle
- Alert threshold (50-100%)

### 4. Automatic Notifications
Triggered when:
- User adds new expense via OCR
- Spending exceeds configured limits
- Only one notification per day per limit type

**Notification Templates**:
- Daily: "Daily Spending Limit Exceeded! 📅"
- Weekly: "Weekly Spending Limit Exceeded! 📊"
- Monthly: "Monthly Budget Exceeded! 📈"
- Yearly: "Yearly Budget Limit Reached! 🎯"

## Backend Structure

### Database Tables

#### `notifications`
```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('daily', 'weekly', 'monthly', 'yearly', 'general'),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  isRead BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `user_limits`
```sql
CREATE TABLE user_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  daily_limit DECIMAL(10, 2) DEFAULT 0,
  weekly_limit DECIMAL(10, 2) DEFAULT 0,
  monthly_limit DECIMAL(10, 2) DEFAULT 0,
  yearly_limit DECIMAL(10, 2) DEFAULT 0,
  alert_threshold INT DEFAULT 80,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### API Endpoints

#### Notifications
- `GET /api/notifications/:user_id` - Get all notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/user/:user_id` - Delete all

#### Limits
- `GET /api/limits/:user_id` - Get user limits
- `POST /api/limits` - Save/Update limits
- `POST /api/limits/check` - Trigger limit checks

### Files Structure

```
Backend/
├── controllers/
│   ├── notificationController.js
│   └── limitsController.js
├── routes/
│   ├── notificationRouter.js
│   └── limitsRouter.js
├── utils/
│   └── limitChecker.js
└── database/
    └── notifications_schema.sql

frontend/src/
├── components/
│   ├── notification/
│   │   └── Notification.jsx
│   ├── NavHome.jsx (updated with badge)
│   └── setting/
│       └── NotLimit.jsx (updated with DB integration)
└── App.jsx (updated with route)
```

## Usage Flow

### Setting Up Limits
1. Navigate to Settings → Notification Limits
2. Set desired limits for each period
3. Configure alert threshold (default: 80%)
4. Click "Save Changes"
5. Limits saved to database + localStorage backup

### Receiving Notifications
1. User adds expense via OCR
2. System calculates current spending totals
3. Compares against configured limits
4. Creates notification if limit exceeded
5. Prevents duplicate notifications (max 1/day per type)

### Viewing Notifications
1. Click bell icon in navbar
2. Badge shows unread count
3. Navigate to `/notification`
4. View all notifications sorted by timestamp
5. Mark as read or delete

### Notification States
- **Unread**: Emerald glow, bold text, visible badge
- **Read**: Normal appearance, no badge
- **Deleted**: Removed from list permanently

## Technical Details

### Limit Checking Logic
```javascript
// Runs after each expense addition
1. Get user limits from database
2. Calculate current totals:
   - Daily: SUM(price) WHERE DATE = today
   - Weekly: SUM(price) WHERE YEARWEEK = current
   - Monthly: SUM(price) WHERE MONTH = current
   - Yearly: SUM(price) WHERE YEAR = current
3. Compare totals against limits
4. Check if notification already sent today
5. Create notification if exceeded and not sent
```

### Fallback Strategy
- **Primary**: MySQL database storage
- **Fallback**: localStorage for offline access
- All operations try DB first, fall back to localStorage on error

### Real-time Updates
- Notification badge updates every 30 seconds
- Manual refresh on navigation
- Auto-refresh after mark as read/delete actions

## Customization

### Adding New Notification Types
1. Update `type` enum in database schema
2. Add template in `limitChecker.js`
3. Create check function for new type
4. Add to `checkAllLimits` function
5. Update UI icons/colors in `Notification.jsx`

### Styling
All components use theme-aware styling:
- Dark mode: `bg-[#0c111c]`, `bg-[#1a1f2c]`
- Light mode: `bg-white`, `bg-gray-50`
- Accent: Emerald (`emerald-400`/`emerald-500`)

## Security
- All routes protected with `verifyUser` middleware
- User can only access their own notifications
- SQL injection prevention via prepared statements
- XSS protection via React's built-in escaping

## Performance
- Indexed database queries on `user_id` and `timestamp`
- Debounced API calls in frontend
- Lazy loading of notifications
- Optimistic UI updates

## Installation

### Database Setup
```bash
# Run SQL schema
mysql -u root -p budgetbee < Backend/database/notifications_schema.sql
```

### Backend Dependencies
```bash
cd Backend
npm install
# Dependencies already included in existing package.json
```

### Frontend Dependencies
```bash
cd frontend
npm install
# Dependencies already included in existing package.json
```

### Start Services
```bash
# Backend (Terminal 1)
cd Backend
node index.js

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## Testing

### Manual Testing Steps
1. Set a low daily limit (e.g., Rs. 100)
2. Add expense > limit via OCR
3. Check bell icon for badge
4. Navigate to /notification
5. Verify notification appears
6. Test "Mark as Read" button
7. Test "Delete" button
8. Verify badge updates

### Expected Results
- ✅ Badge shows "1" unread
- ✅ Notification has emerald glow (unread)
- ✅ Mark as read removes glow
- ✅ Delete removes notification
- ✅ Badge decrements appropriately

## Troubleshooting

### Badge Not Updating
- Check browser console for API errors
- Verify token in localStorage
- Check backend server is running
- Verify database connection

### Notifications Not Created
- Check user_limits table has values
- Verify expense total exceeds limit
- Check for existing notification today
- Review backend logs for errors

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in config
- Ensure tables are created
- Check user permissions

## Future Enhancements
- [ ] Push notifications (browser API)
- [ ] Email notifications
- [ ] SMS notifications (Twilio)
- [ ] Custom notification sounds
- [ ] Notification categories/filtering
- [ ] Bulk delete operations
- [ ] Export notification history
- [ ] Notification preferences per limit type
