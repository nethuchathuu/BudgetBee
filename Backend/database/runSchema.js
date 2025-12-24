const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runSchema() {
  try {
    console.log('Reading SQL schema file...');
    const schemaPath = path.join(__dirname, 'notifications_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon to execute each statement separately
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      await db.execute(statements[i]);
      console.log(`✓ Statement ${i + 1} completed`);
    }
    
    console.log('\n✓ All tables created successfully!');
    
    // Verify tables exist
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME IN ('notifications', 'user_limits')
    `);
    
    console.log('\nCreated tables:');
    tables.forEach(table => console.log(`  - ${table.TABLE_NAME}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error running schema:', error);
    process.exit(1);
  }
}

runSchema();
