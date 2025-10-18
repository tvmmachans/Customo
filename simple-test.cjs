const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing products endpoint...');
    const response = await axios.get('http://localhost:5000/api/products');
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
  }
}

simpleTest();
