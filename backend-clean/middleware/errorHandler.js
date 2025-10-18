// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error with context
  console.error('❌ Global Error Handler:', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  // Handle specific error types
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  } else if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  } else if (err.name === 'NotBeforeError') {
    error.message = 'Token not active';
    error.statusCode = 401;
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    error.message = 'Duplicate entry found';
    error.statusCode = 409;
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    error.message = 'Database table not found';
    error.statusCode = 500;
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    error.message = 'Database access denied';
    error.statusCode = 500;
  } else if (err.code === 'ECONNREFUSED') {
    error.message = 'Database connection refused';
    error.statusCode = 503;
  } else if (err.code === 'ER_BAD_DB_ERROR') {
    error.message = 'Database not found';
    error.statusCode = 500;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.statusCode = 400;
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON in request body';
    error.statusCode = 400;
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    error.message = 'Too many requests, please try again later';
    error.statusCode = 429;
  }

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(isDevelopment && { 
      stack: err.stack,
      details: err 
    })
  });
};

module.exports = errorHandler;
