const { testConnection, initializeDatabase } = require('../config/db');
require('dotenv').config();

async function initialize() {
  console.log('🚀 Initializing Customo Backend...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your database configuration.');
      process.exit(1);
    }

    // Initialize database tables
    console.log('🗄️  Initializing database tables...');
    await initializeDatabase();

    console.log('\n✅ Backend initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test the API endpoints using the examples in README.md');
    console.log('3. Connect your frontend to http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
initialize();
