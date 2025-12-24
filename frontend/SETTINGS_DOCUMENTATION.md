# BudgetBee Settings System

## Overview
Complete settings system with dark/light theme support, dashboard preferences, notification limits, help & support, and data reset functionality.

## Folder Structure
```
frontend/src/
├── components/
│   └── setting/
│       ├── Setting.jsx          # Main settings page with sidebar menu
│       ├── Appearance.jsx       # Dark/Light theme toggle
│       ├── SetHome.jsx          # Default dashboard selection
│       ├── NotLimit.jsx         # Budget alert limits
│       ├── Help.jsx             # Help & Support
│       └── Reset.jsx            # Reset app data
├── context/
│   └── ThemeContext.jsx         # Theme state management
└── utils/
    └── themeColors.js           # Theme color definitions
```

## Features

### 1. Appearance Settings (`/settings/appearance`)
- **Dark Mode**: Dark theme colors from signin, signup, features, how it works, upload pages
  - Background: `#0c111c`, `#1a1f2c`, `#0a0f1a`
  - Gradient: `from-[#0c111c] via-[#0a0f1a] to-[#0b1422]`
  - Accent: Emerald-400 (`#10b981`)

- **Light Mode**: Light theme colors from homepage, summaries, calendar pages
  - Background: `#ffffff`, `#f9fafb`, `#f3f4f6`
  - Text: Gray-800 to Gray-600
  - Accent: Emerald-500

- **Preview Cards**: Visual representation of each theme before selection
- **Persistence**: Saves preference to localStorage

### 2. Default Dashboard (`/settings/setHome`)
Choose your preferred starting view:
- Daily Summary
- Weekly Summary
- Monthly Summary
- Yearly Summary

Saved to `localStorage` as `budgetbee-default-dashboard`

### 3. Notification Limits (`/settings/notLimit`)
Configure budget alerts:
- **Daily Limit**: Set maximum daily spending
- **Weekly Limit**: Set maximum weekly spending
- **Monthly Limit**: Set maximum monthly spending
- **Alert Threshold**: Percentage (50-100%) to trigger notifications
- **Toggle Alerts**: Enable/disable alerts for each period

Saved to `localStorage` as `budgetbee-notification-limits`

### 4. Help & Support (`/settings/help`)
- Popular help topics with guides
- Contact options:
  - Email: support@budgetbee.com
  - Phone: +1 (555) 123-4567
  - Live Chat
- FAQ section
- Link to full documentation

### 5. Reset App Data (`/settings/reset`)
Quick reset options:
- **Reset Preferences**: Clear theme, dashboard, notification settings
- **Clear Cache**: Remove temporary data

Full reset option:
- Clears all localStorage (except authentication token)
- Requires typing "RESET" to confirm
- Preserves account and server-stored expense data

## Navigation

### Top Bar Icons (Left to Right)
1. **Bell** - Notifications
2. **Settings** - Settings menu (gear icon)
3. **User** - Profile

### Settings Menu Routes
```javascript
/settings                    // Main settings page
/settings/appearance         // Theme toggle
/settings/setHome           // Default dashboard
/settings/notLimit          // Notification limits
/settings/help              // Help & Support
/settings/reset             // Reset data
```

## Theme Context Usage

```jsx
import { useTheme } from '../../context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className={isDark ? 'bg-[#0c111c]' : 'bg-white'}>
      {/* Your content */}
    </div>
  );
}
```

## Color System

### Dark Mode Colors
```javascript
{
  background: {
    primary: '#0c111c',
    secondary: '#1a1f2c',
    tertiary: '#0a0f1a'
  },
  text: {
    primary: '#ffffff',
    secondary: '#e2e8f0',
    muted: '#94a3b8'
  },
  accent: {
    primary: '#10b981'  // emerald-400
  }
}
```

### Light Mode Colors
```javascript
{
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6'
  },
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    muted: '#6b7280'
  },
  accent: {
    primary: '#10b981'  // emerald-500
  }
}
```

## LocalStorage Keys
- `budgetbee-theme`: Current theme ('light' | 'dark')
- `budgetbee-default-dashboard`: Default view ('daily' | 'weekly' | 'monthly' | 'yearly')
- `budgetbee-notification-limits`: Budget alert settings (JSON object)

## Implementation Details

### Theme Persistence
- Theme saved to localStorage on change
- Applied to document root via class: `document.documentElement.classList.add('dark')`
- Loads user preference on app start

### Responsive Design
- Sidebar sticky on desktop (width: 320px)
- Mobile-friendly with collapsible menu
- Grid layouts for settings cards

### Icons Used (lucide-react)
- Palette: Appearance
- Home: Default Dashboard
- Bell: Notification Limits
- HelpCircle: Help & Support
- RotateCcw: Reset Data
- Settings: Settings menu icon

## Integration with Existing Pages

All pages should use the `useTheme` hook to apply appropriate colors:

```jsx
const { isDark } = useTheme();

<div className={`
  ${isDark 
    ? 'bg-[#0c111c] text-white' 
    : 'bg-white text-gray-800'
  }
`}>
  {/* Content */}
</div>
```

## Future Enhancements
- Auto theme based on system preference
- Custom color scheme builder
- Export/import settings
- Multi-language support
- Notification sound preferences
