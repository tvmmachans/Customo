const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Rate limiting for auth routes (more restrictive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes with rate limiting and validation
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
