// Frontend Integration Examples
// This file shows how to connect your frontend to the Customo backend

const API_BASE_URL = 'http://localhost:5000';

// Example API service class
class CustomoAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Make authenticated request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(credentials) {
    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return await this.makeRequest('/api/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Product methods
  async getAllProducts() {
    return await this.makeRequest('/api/products');
  }

  async getProductById(id) {
    return await this.makeRequest(`/api/products/${id}`);
  }

  // Health check
  async healthCheck() {
    return await this.makeRequest('/health');
  }
}

// Example usage in a React component
const exampleReactUsage = `
import React, { useState, useEffect } from 'react';

function App() {
  const [api] = useState(new CustomoAPI());
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if user is logged in
      if (api.token) {
        const userResponse = await api.getCurrentUser();
        setUser(userResponse.data.user);
      }

      // Load products
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.data.products);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await api.register({ name, email, password });
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <h2>Products</h2>
            {products.map(product => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <p>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1>Please login or register</h1>
          {/* Login/Register forms would go here */}
        </div>
      )}
    </div>
  );
}

export default App;
`;

// Example usage in vanilla JavaScript
const exampleVanillaJS = `
// Initialize API
const api = new CustomoAPI();

// Login function
async function login(email, password) {
  try {
    const response = await api.login({ email, password });
    console.log('Login successful:', response.data.user);
    
    // Redirect to dashboard or update UI
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login failed:', error.message);
    alert('Login failed: ' + error.message);
  }
}

// Register function
async function register(name, email, password) {
  try {
    const response = await api.register({ name, email, password });
    console.log('Registration successful:', response.data.user);
    
    // Redirect to dashboard or update UI
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Registration failed:', error.message);
    alert('Registration failed: ' + error.message);
  }
}

// Load products
async function loadProducts() {
  try {
    const response = await api.getAllProducts();
    const products = response.data.products;
    
    // Update UI with products
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => \`
      <div class="product">
        <h3>\${product.name}</h3>
        <p class="price">$\${product.price}</p>
        <p class="description">\${product.description}</p>
        <button onclick="viewProduct(\${product.id})">View Details</button>
      </div>
    \`).join('');
  } catch (error) {
    console.error('Failed to load products:', error.message);
  }
}

// View product details
async function viewProduct(id) {
  try {
    const response = await api.getProductById(id);
    const product = response.data.product;
    
    // Show product details modal or navigate to product page
    alert(\`Product: \${product.name}\\nPrice: $\${product.price}\\nDescription: \${product.description}\`);
  } catch (error) {
    console.error('Failed to load product:', error.message);
  }
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
  if (api.token) {
    try {
      const response = await api.getCurrentUser();
      console.log('User is logged in:', response.data.user);
      // Update UI to show logged-in state
    } catch (error) {
      console.log('Token is invalid, clearing it');
      api.clearToken();
    }
  }
  
  // Load products
  await loadProducts();
});
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CustomoAPI, exampleReactUsage, exampleVanillaJS };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.CustomoAPI = CustomoAPI;
  window.exampleReactUsage = exampleReactUsage;
  window.exampleVanillaJS = exampleVanillaJS;
}
