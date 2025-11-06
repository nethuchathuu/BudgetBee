-- Migration: add columns for storing original and converted amounts
-- Run this on your MySQL database that contains the `expenses` table.

ALTER TABLE expenses
  ADD COLUMN original_currency VARCHAR(10) NULL,
  ADD COLUMN original_amount DECIMAL(10,2) NULL,
  ADD COLUMN converted_amount DECIMAL(12,2) NULL,
  ADD COLUMN conversion_rate FLOAT NULL;

-- Example INSERT (if you want to insert via SQL directly):
-- INSERT INTO expenses (user_id, bill_date, shop_name, category_name, product_name, price, original_amount, original_currency, converted_amount, conversion_rate, currency)
-- VALUES (1, '2025-11-02', 'Test Shop', 'Groceries', 'Milk', 450.00, 1.50, 'USD', 450.00, 300.00, 'LKR');

-- Notes:
-- 1) Adjust column types if needed for your project; DECIMAL precision chosen conservatively.
-- 2) After applying this migration, backend will be able to store both original and converted values.
