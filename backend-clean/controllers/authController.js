const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/db-sqlite');
const { 
  sanitizeInput, 
  isValidEmail, 
  isValidPassword, 
  isValidName 
} = require('../utils/validation');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Validate input formats
    if (!isValidName(sanitizedName)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be 2-50 characters long and contain only letters, spaces, hyphens, and apostrophes'
      });
    }

    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be 6-128 characters long and contain at least one letter and one number'
      });
    }

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [sanitizedEmail]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password with enhanced security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with sanitized data
    const result = await executeQuery(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [sanitizedName, sanitizedEmail, hashedPassword]
    );

    const userId = result.insertId;

    // Generate JWT token with enhanced security
    const token = jwt.sign(
      { 
        userId, 
        email: sanitizedEmail,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'customo-backend',
        audience: 'customo-frontend'
      }
    );

    // Log successful registration (without sensitive data)
    console.log(`✅ User registered successfully: ${sanitizedEmail}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userId,
          name: sanitizedName,
          email: sanitizedEmail
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Handle specific database errors
    if (error.message === 'Duplicate entry found') {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Find user
    const users = await executeQuery(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [sanitizedEmail]
    );

    if (users.length === 0) {
      // Log failed login attempt (without revealing if user exists)
      console.log(`❌ Failed login attempt for email: ${sanitizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      console.log(`❌ Failed login attempt for email: ${sanitizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token with enhanced security
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'customo-backend',
        audience: 'customo-frontend'
      }
    );

    // Log successful login
    console.log(`✅ User logged in successfully: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get current user (protected route)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const users = await executeQuery(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at
        }
      }
    });

  } catch (error) {
    console.error('❌ Get current user error:', {
      message: error.message,
      code: error.code,
      userId: req.user?.userId,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
