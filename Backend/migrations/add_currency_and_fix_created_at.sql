-- Migration: Add currency column and fix created_at column
-- Run this in phpMyAdmin or MySQL command line

-- Step 1: Add currency column if it doesn't exist
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'LKR';

-- Step 2: Modify created_at to allow manual values (remove DEFAULT CURRENT_TIMESTAMP)
ALTER TABLE expenses 
MODIFY COLUMN created_at DATETIME NULL;

-- Step 3: Update existing NULL created_at values to match their bill_date
UPDATE expenses 
SET created_at = bill_date 
WHERE created_at IS NULL;

-- Verify the changes
DESCRIBE expenses;
