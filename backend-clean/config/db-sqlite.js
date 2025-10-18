const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../customo-clean.db');

// Create database connection
let db;

try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
    } else {
      console.log('✅ Connected to SQLite database');
    }
  });
} catch (error) {
  console.error('❌ Failed to create database connection:', error.message);
  throw error;
}

// Test database connection
async function testConnection() {
  return new Promise((resolve) => {
    db.get('SELECT 1 as test', (err, row) => {
      if (err) {
        console.error('❌ Database connection test failed:', err.message);
        resolve(false);
      } else {
        console.log('✅ Database connection test successful');
        resolve(true);
      }
    });
  });
}

// Initialize database tables
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Create users table first
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Users table created/verified');
      
      // Create products table after users table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating products table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Products table created/verified');
        
        // Insert sample products if table is empty
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
          if (err) {
            console.error('❌ Error checking products count:', err.message);
            reject(err);
            return;
          }
          
          if (row.count === 0) {
            const sampleProducts = [
              ['Security Robot Pro', 2999.99, 'Advanced security robot with AI-powered surveillance and 24/7 monitoring capabilities.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500'],
              ['Assistant Bot', 1999.99, 'Smart assistant robot that helps with daily tasks and home automation.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
              ['Industrial Robot Arm', 4999.99, 'Heavy-duty industrial robot arm for manufacturing and assembly operations.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500'],
              ['Drone Surveillance', 1299.99, 'High-tech surveillance drone with HD camera and GPS tracking.', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'],
              ['Robot Components Kit', 299.99, 'Complete kit of essential components for building custom robots.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500'],
              ['Smart Home Controller', 599.99, 'Central controller for managing all your smart home devices and robots.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
              ['Cleaning Robot', 899.99, 'Autonomous cleaning robot with advanced navigation and scheduling.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
              ['Educational Robot Kit', 199.99, 'Fun and educational robot kit perfect for learning robotics basics.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500']
            ];

            const stmt = db.prepare('INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)');
            
            sampleProducts.forEach(product => {
              stmt.run(product, (err) => {
                if (err) {
                  console.error('❌ Error inserting sample product:', err.message);
                }
              });
            });
            
            stmt.finalize((err) => {
              if (err) {
                console.error('❌ Error finalizing product insertions:', err.message);
                reject(err);
              } else {
                console.log('✅ Sample products inserted successfully');
                resolve();
              }
            });
          } else {
            console.log('✅ Products table already has data');
            resolve();
          }
        });
      });
    });
  });
}

// Execute query with promise wrapper
function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('❌ Database query error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('❌ Database query error:', err.message);
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    }
  });
}

// Get database instance
function getDatabase() {
  return db;
}

module.exports = {
  testConnection,
  initializeDatabase,
  executeQuery,
  getDatabase
};