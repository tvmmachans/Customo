const axios = require('axios');

async function testBackend() {
  const BASE_URL = 'http://localhost:5000';
  
  try {
    console.log('🧪 Testing Backend-Clean API...\n');
    
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test 2: Get products
    console.log('\n2️⃣ Testing get products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Get products successful:', productsResponse.data.data.products.length, 'products found');
    
    // Test 3: Register user
    console.log('\n3️⃣ Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('✅ User registration successful');
      console.log('User ID:', registerResponse.data.data.user.id);
      console.log('Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  User already exists, this is expected');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
        throw error;
      }
    }
    
    // Test 4: Login user
    console.log('\n4️⃣ Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User login successful');
    console.log('User ID:', loginResponse.data.data.user.id);
    console.log('Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
    
    const authToken = loginResponse.data.data.token;
    
    // Test 5: Get current user
    console.log('\n5️⃣ Testing get current user...');
    const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get current user successful:', userResponse.data.data.user.name);
    
    console.log('\n🎉 All backend tests passed successfully!');
    console.log('\n📋 Backend Summary:');
    console.log('- ✅ Health check working');
    console.log('- ✅ Product listing working');
    console.log('- ✅ User registration working');
    console.log('- ✅ User login working');
    console.log('- ✅ JWT authentication working');
    console.log('- ✅ Database integration working');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testBackend();
