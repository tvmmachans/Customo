const { executeQuery, testConnection, initializeDatabase } = require('./config/db-sqlite');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await testConnection();
    
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Testing simple query...');
    const result = await executeQuery('SELECT COUNT(*) as count FROM products');
    console.log('Products count:', result);
    
    console.log('Testing products query...');
    const products = await executeQuery('SELECT id, name, price, description, image_url, created_at FROM products LIMIT 5');
    console.log('Products:', products);
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
