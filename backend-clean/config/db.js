const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration with enhanced settings
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'customo_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // Enhanced security and performance settings
  charset: 'utf8mb4',
  timezone: '+00:00',
  // Connection pool settings
  queueLimit: 0,
  // SSL settings (for production)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Retry settings
  retryDelay: 2000,
  maxRetries: 3
};

// Create connection pool with error handling
let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ Database connection pool created successfully');
} catch (error) {
  console.error('❌ Failed to create database connection pool:', error.message);
  throw error;
}

// Test database connection with retry logic
async function testConnection(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await pool.getConnection();
      await connection.ping(); // Test the connection
      console.log('✅ Database connected successfully');
      connection.release();
      return true;
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        console.error('❌ All database connection attempts failed');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  return false;
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

// Execute query with enhanced error handling
async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Validate SQL query (basic protection against SQL injection)
    if (typeof sql !== 'string' || sql.trim().length === 0) {
      throw new Error('Invalid SQL query provided');
    }
    
    // Log query in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Executing query:', sql.substring(0, 100) + (sql.length > 100 ? '...' : ''));
    }
    
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ Database query error:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      query: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
    });
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Duplicate entry found');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('Database table not found');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Database access denied');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Database connection refused');
    }
    
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Get connection from pool
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Failed to get database connection:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  executeQuery,
  getConnection
};
