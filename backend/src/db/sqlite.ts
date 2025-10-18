import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

let db: sqlite3.Database | null = null;

export function getDatabase(): sqlite3.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../customo.db');
    db = new sqlite3.Database(dbPath);
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Create tables if they don't exist
    initializeTables();
  }
  return db;
}

export function getPool() {
  return {
    query: (sql: string, params: any[] = []): Promise<[any]> => {
      return new Promise((resolve, reject) => {
        const database = getDatabase();
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          database.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve([rows || []]);
          });
        } else {
          database.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve([{ changes: this.changes, lastID: this.lastID }]);
          });
        }
      });
    }
  };
}

export async function withConnection<T>(fn: (conn: any) => Promise<T>): Promise<T> {
  const database = getDatabase();
  return fn(database);
}

async function initializeTables() {
  const database = getDatabase();
  
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      company TEXT,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const createProducts = `
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      images TEXT NOT NULL,
      specifications TEXT,
      features TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      stock_count INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      badge TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const createDevices = `
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'OFFLINE',
      battery INTEGER NOT NULL DEFAULT 100,
      location TEXT,
      last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_online INTEGER NOT NULL DEFAULT 0,
      tasks TEXT,
      user_id TEXT NOT NULL,
      product_id TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
  
  const createOrders = `
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      total_amount REAL NOT NULL,
      shipping_address TEXT NOT NULL,
      billing_address TEXT,
      payment_status TEXT NOT NULL DEFAULT 'PENDING',
      payment_intent_id TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  
  const createOrderItems = `
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
  
  const createReviews = `
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT,
      is_verified INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
  
  const createCarts = `
    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  
  const createCartItems = `
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT,
      price REAL NOT NULL DEFAULT 0,
      quantity INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
  
  const createServiceTickets = `
    CREATE TABLE IF NOT EXISTS service_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      device_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'OPEN',
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      issue_type TEXT NOT NULL,
      assigned_to TEXT,
      scheduled_date DATETIME,
      completed_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );
  `;
  
  const createCustomBuilds = `
    CREATE TABLE IF NOT EXISTS custom_builds (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      design_files TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      total_cost REAL NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  
  const createCustomBuildParts = `
    CREATE TABLE IF NOT EXISTS custom_build_parts (
      id TEXT PRIMARY KEY,
      build_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (build_id) REFERENCES custom_builds(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
  
  // Execute all table creation queries
  const queries = [
    createUsers, createProducts, createDevices, createOrders, 
    createOrderItems, createReviews, createCarts, createCartItems,
    createServiceTickets, createCustomBuilds, createCustomBuildParts
  ];
  
  for (const query of queries) {
    await new Promise<void>((resolve, reject) => {
      database.run(query, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  console.log('Database tables initialized successfully');
}

export async function initializeDatabase(): Promise<void> {
  // Tables are created in getDatabase()
  console.log('SQLite database initialized');
}
