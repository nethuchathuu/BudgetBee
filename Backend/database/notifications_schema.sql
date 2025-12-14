-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('daily', 'weekly', 'monthly', 'yearly', 'general') DEFAULT 'general',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  isRead BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_timestamp (user_id, timestamp),
  INDEX idx_isRead (isRead)
);

-- Create user_limits table
CREATE TABLE IF NOT EXISTS user_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  daily_limit DECIMAL(10, 2) DEFAULT 0,
  weekly_limit DECIMAL(10, 2) DEFAULT 0,
  monthly_limit DECIMAL(10, 2) DEFAULT 0,
  yearly_limit DECIMAL(10, 2) DEFAULT 0,
  alert_threshold INT DEFAULT 80,
  enable_daily_alerts BOOLEAN DEFAULT TRUE,
  enable_weekly_alerts BOOLEAN DEFAULT TRUE,
  enable_monthly_alerts BOOLEAN DEFAULT TRUE,
  enable_yearly_alerts BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
