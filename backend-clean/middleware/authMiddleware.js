const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Expected: Bearer <token>'
      });
    }

    // Extract token
    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and trim

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // Verify token with enhanced options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'customo-backend',
      audience: 'customo-frontend'
    });
    
    // Validate token payload
    if (!decoded.userId || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
      });
    }

    // Validate token type
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      tokenType: decoded.type
    };

    // Log successful authentication (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Authenticated user: ${decoded.email} (ID: ${decoded.userId})`);
    }

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', {
      message: error.message,
      name: error.name,
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token not active'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

module.exports = authMiddleware;
