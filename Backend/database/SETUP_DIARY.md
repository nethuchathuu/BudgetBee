# Database Setup Guide - Diary Feature

## Quick Setup

### Option 1: Using MySQL Workbench (Recommended)
1. Open MySQL Workbench
2. Connect to your database
3. Open the `diary_table.sql` file
4. Click the lightning bolt icon to execute
5. Verify the table was created: `SHOW TABLES;`

### Option 2: Using Command Line
```bash
# Navigate to the Backend directory
cd E:\FinalYearProject\Backend

# Run the SQL script
mysql -u your_username -p your_database_name < database/diary_table.sql

# Enter your password when prompted
```

### Option 3: Using phpMyAdmin
1. Open phpMyAdmin in your browser
2. Select your database
3. Go to the "SQL" tab
4. Copy and paste the contents of `diary_table.sql`
5. Click "Go" to execute

### Option 4: Manual Creation
Copy this SQL and run it in your MySQL client:

```sql
CREATE TABLE IF NOT EXISTS diary_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_date (user_id, entry_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, entry_date),
  INDEX idx_entry_date (entry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Verification

After creating the table, verify it was created correctly:

```sql
-- Check if table exists
SHOW TABLES LIKE 'diary_entries';

-- View table structure
DESCRIBE diary_entries;

-- Expected output:
-- +------------+--------------+------+-----+-------------------+-------------------+
-- | Field      | Type         | Null | Key | Default           | Extra             |
-- +------------+--------------+------+-----+-------------------+-------------------+
-- | id         | int          | NO   | PRI | NULL              | auto_increment    |
-- | user_id    | int          | NO   | MUL | NULL              |                   |
-- | entry_date | date         | NO   | MUL | NULL              |                   |
-- | content    | text         | NO   |     | NULL              |                   |
-- | mood       | varchar(50)  | YES  |     | NULL              |                   |
-- | created_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
-- | updated_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
-- +------------+--------------+------+-----+-------------------+-------------------+
```

## Testing the Setup

After table creation, test the API endpoints:

### 1. Start Backend Server
```bash
cd E:\FinalYearProject\Backend
nodemon
```

### 2. Test Endpoints (using Postman or curl)

**Get Entry (should return empty for new users):**
```bash
curl -X GET http://localhost:5000/api/diary/2025-12-05 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Entry:**
```bash
curl -X POST http://localhost:5000/api/diary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-05",
    "content": "This is my first diary entry!",
    "mood": "😊"
  }'
```

**Get All Entries:**
```bash
curl -X GET http://localhost:5000/api/diary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Error: Table already exists
- This is fine! The SQL uses `CREATE TABLE IF NOT EXISTS`
- Your table is already set up

### Error: Foreign key constraint fails
- Ensure your `users` table exists
- The `user_id` column must reference an existing users table
- Check: `SHOW CREATE TABLE users;`

### Error: Unknown database
- Make sure you've selected the correct database
- Use: `USE your_database_name;` before running the script

### Error: Access denied
- Check your MySQL username and password
- Ensure your user has CREATE TABLE privileges
- Grant privileges: `GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';`

## Database Configuration

Ensure your `.env` file has the correct database settings:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306
```

## Next Steps

After successful database setup:

1. ✅ Database table created
2. ✅ Backend server running
3. ✅ Start frontend: `cd frontend && npm run dev`
4. ✅ Navigate to http://localhost:5173/diary
5. ✅ Sign in to your account
6. ✅ Start writing diary entries!

## Sample Data (Optional)

If you want to test with sample data:

```sql
-- Insert sample diary entries (replace user_id with actual user)
INSERT INTO diary_entries (user_id, entry_date, content, mood) VALUES
(1, '2025-12-01', 'Started working on the diary feature. Excited about the realistic book design!', '😊'),
(1, '2025-12-02', 'Implemented the two-page layout. Left page for yesterday, right for today.', '🤔'),
(1, '2025-12-03', 'Added auto-save functionality. No more lost entries!', '😍'),
(1, '2025-12-04', 'Finished the mood tracker. Love the emoji selection!', '😊');
```

## Maintenance

### Backup Diary Entries
```sql
-- Export diary entries
SELECT * FROM diary_entries 
INTO OUTFILE '/path/to/backup/diary_backup.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

### Clean Old Entries (Optional)
```sql
-- Delete entries older than 2 years
DELETE FROM diary_entries 
WHERE entry_date < DATE_SUB(CURDATE(), INTERVAL 2 YEAR);
```

### View Statistics
```sql
-- Count total entries per user
SELECT user_id, COUNT(*) as total_entries 
FROM diary_entries 
GROUP BY user_id;

-- Most common moods
SELECT mood, COUNT(*) as count 
FROM diary_entries 
WHERE mood IS NOT NULL 
GROUP BY mood 
ORDER BY count DESC;
```
