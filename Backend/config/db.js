const sql = require("mysql2/promise");
const dotenv = require("dotenv").config();

const pool = sql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budgetBee',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: parseInt(process.env.DB_PORT) || 3306,
  connectTimeout: 60000,
  charset: 'utf8mb4'
});

// Function to check if the connection is established with the database
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release();
  } catch (error) {
    console.log("Connection error: " + error);
    throw error;
    
  }
}

module.exports = { pool, checkConnection }; 