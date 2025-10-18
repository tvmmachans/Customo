const logger = require('../utils/logger');

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log the request
    logger.request(req, res, responseTime);
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = requestLogger;
