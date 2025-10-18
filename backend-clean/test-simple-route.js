const express = require('express');
const { executeQuery } = require('./config/db-sqlite');

const app = express();
app.use(express.json());

// Simple test route without validation
app.get('/test-products', async (req, res) => {
  try {
    console.log('Test route called');
    const products = await executeQuery('SELECT id, name, price, description, image_url, created_at FROM products LIMIT 5');
    console.log('Products retrieved:', products.length);
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
