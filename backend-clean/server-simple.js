const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock auth endpoints for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock validation
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        },
        token: 'mock-jwt-token-123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: 2,
        name,
        email
      },
      token: 'mock-jwt-token-456'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString()
      }
    }
  });
});

// Mock products endpoints
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Security Robot Pro',
      price: 2999.99,
      description: 'Advanced security robot with AI-powered surveillance',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Assistant Bot',
      price: 1999.99,
      description: 'Smart assistant robot for daily tasks',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      created_at: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        pages: 1
      }
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = {
    id: parseInt(id),
    name: 'Security Robot Pro',
    price: 2999.99,
    description: 'Advanced security robot with AI-powered surveillance',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
    created_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: { product }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  console.log(`✅ Backend is ready to accept requests!`);
});

module.exports = app;

