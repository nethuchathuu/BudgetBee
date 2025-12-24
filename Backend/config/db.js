const sql = require("mysql2/promise");
const dotenv = require("dotenv").config();

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port:process.env.DB_PORT,
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

// Provide a lightweight db helper compatible with code that calls `db.execute()` or uses `pool`
const db = {
  pool,
  checkConnection,
  // proxy execute to the pool
  execute: (...args) => pool.execute(...args),
  // proxy query to the pool (for raw queries)
  query: (...args) => pool.query(...args),
  // allow getting a connection if needed
  getConnection: (...args) => pool.getConnection(...args),
};

module.exports = db;