// Enhanced logging utility
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (can be set via environment variable)
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.INFO;

// Format timestamp
const formatTimestamp = () => {
  return new Date().toISOString();
};

// Format log message
const formatMessage = (level, message, meta = {}) => {
  const timestamp = formatTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
};

// Write to log file
const writeToFile = (level, message, meta = {}) => {
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const formattedMessage = formatMessage(level, message, meta) + '\n';
  
  fs.appendFile(logFile, formattedMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Logger object
const logger = {
  error: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      const formattedMessage = formatMessage('ERROR', message, meta);
      console.error(formattedMessage);
      writeToFile('ERROR', message, meta);
    }
  },

  warn: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      const formattedMessage = formatMessage('WARN', message, meta);
      console.warn(formattedMessage);
      writeToFile('WARN', message, meta);
    }
  },

  info: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      const formattedMessage = formatMessage('INFO', message, meta);
      console.log(formattedMessage);
      writeToFile('INFO', message, meta);
    }
  },

  debug: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      const formattedMessage = formatMessage('DEBUG', message, meta);
      console.log(formattedMessage);
      writeToFile('DEBUG', message, meta);
    }
  },

  // Request logging
  request: (req, res, responseTime) => {
    const meta = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.userId || null
    };

    if (res.statusCode >= 400) {
      logger.error(`Request failed: ${req.method} ${req.url}`, meta);
    } else {
      logger.info(`Request: ${req.method} ${req.url}`, meta);
    }
  },

  // Database logging
  database: (operation, query, duration, error = null) => {
    const meta = {
      operation,
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      error: error ? error.message : null
    };

    if (error) {
      logger.error(`Database operation failed: ${operation}`, meta);
    } else {
      logger.debug(`Database operation: ${operation}`, meta);
    }
  },

  // Authentication logging
  auth: (action, email, success, ip, error = null) => {
    const meta = {
      action,
      email,
      success,
      ip,
      error: error ? error.message : null
    };

    if (success) {
      logger.info(`Authentication success: ${action}`, meta);
    } else {
      logger.warn(`Authentication failed: ${action}`, meta);
    }
  }
};

module.exports = logger;
