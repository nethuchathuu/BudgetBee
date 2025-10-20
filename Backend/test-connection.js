const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_PORT:", process.env.DB_PORT);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_NAME:", process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000
    });

    console.log("✅ Connected to MySQL server successfully!");
    
    // Test if database exists
    const [databases] = await connection.execute("SHOW DATABASES");
    console.log("Available databases:", databases.map(db => db.Database));
    
    // Check if our database exists
    const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
      
      // Test connection to specific database
      await connection.execute(`USE ${process.env.DB_NAME}`);
      console.log(`✅ Successfully connected to database '${process.env.DB_NAME}'`);
      
      // Show tables
      const [tables] = await connection.execute("SHOW TABLES");
      console.log("Tables in database:", tables);
      
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does not exist`);
      console.log("Creating database...");
      await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error code:", error.code);
    
    if (error.code === 'ETIMEDOUT') {
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure WAMP/XAMPP is running");
      console.log("2. Check if MySQL service is started");
      console.log("3. Verify MySQL is running on port 3306");
      console.log("4. Check firewall settings");
    }
  }
}

testConnection();