const { pool } = require('./config/db');

async function addColumns() {
    try {
        await pool.execute(
            `ALTER TABLE users 
             ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'light',
             ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
        );
        console.log('✅ Columns added successfully');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

addColumns();
