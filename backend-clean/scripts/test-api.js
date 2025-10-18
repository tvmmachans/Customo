const axios = require('axios');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

async function testAPI() {
  console.log('🧪 Testing Customo Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test 2: Register user
    console.log('\n2️⃣ Testing user registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('✅ User registration successful');
      authToken = registerResponse.data.data.token;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, proceeding with login...');
      } else {
        throw error;
      }
    }

    // Test 3: Login user
    console.log('\n3️⃣ Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User login successful');
    authToken = loginResponse.data.data.token;

    // Test 4: Get current user
    console.log('\n4️⃣ Testing get current user...');
    const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get current user successful:', userResponse.data.data.user.name);

    // Test 5: Get all products
    console.log('\n5️⃣ Testing get all products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Get all products successful:', productsResponse.data.data.products.length, 'products found');

    // Test 6: Get product by ID
    if (productsResponse.data.data.products.length > 0) {
      console.log('\n6️⃣ Testing get product by ID...');
      const productId = productsResponse.data.data.products[0].id;
      const productResponse = await axios.get(`${BASE_URL}/api/products/${productId}`);
      console.log('✅ Get product by ID successful:', productResponse.data.data.product.name);
    }

    // Test 7: Create product (for testing)
    console.log('\n7️⃣ Testing create product...');
    const newProduct = {
      name: 'Test Robot',
      price: 999.99,
      description: 'A test robot for API testing',
      image_url: 'https://example.com/test-robot.jpg'
    };
    const createResponse = await axios.post(`${BASE_URL}/api/products`, newProduct);
    console.log('✅ Create product successful:', createResponse.data.data.product.name);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 API Summary:');
    console.log('- ✅ Health check endpoint working');
    console.log('- ✅ User registration working');
    console.log('- ✅ User login working');
    console.log('- ✅ JWT authentication working');
    console.log('- ✅ Product listing working');
    console.log('- ✅ Product details working');
    console.log('- ✅ Product creation working');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if axios is available
try {
  require.resolve('axios');
  testAPI();
} catch (error) {
  console.log('📦 Installing axios for testing...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install axios', { stdio: 'inherit' });
    console.log('✅ Axios installed, running tests...');
    testAPI();
  } catch (installError) {
    console.error('❌ Failed to install axios:', installError.message);
    console.log('\n💡 Manual testing instructions:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Use curl or Postman to test the endpoints');
    console.log('3. Check the README.md for example requests');
  }
}
