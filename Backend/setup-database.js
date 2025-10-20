const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

async function setupDatabase() {
  let connection;
  try {
    console.log("Connecting to MySQL server...");
    
    // First, try connecting without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      connectTimeout: 30000
    });

    console.log("✅ Connected to MySQL server!");
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' is ready`);
    
    // Switch to the database
    await connection.execute(`USE \`${process.env.DB_NAME}\``);
    console.log(`✅ Using database '${process.env.DB_NAME}'`);
    
    // Create a simple users table for testing
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createUsersTable);
    console.log("✅ Users table is ready");
    
    // Test inserting and selecting data
    console.log("✅ Database setup completed successfully!");
    
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.log("\n🔧 This appears to be a connection timeout issue.");
      console.log("Try these solutions:");
      console.log("1. Open XAMPP Control Panel");
      console.log("2. Stop and restart MySQL service");
      console.log("3. Check if any antivirus/firewall is blocking connections");
      console.log("4. Try running this as administrator");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("\n🔧 Access denied - check your MySQL credentials:");
      console.log("1. Make sure the MySQL root user has no password set");
      console.log("2. Or update DB_PASSWORD in .env file with the correct password");
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();