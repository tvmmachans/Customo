// Input validation utilities
const validator = require('validator');

// Sanitize and validate input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

// Validate email format
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email) && email.length <= 255;
};

// Validate password strength
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  // Password requirements:
  // - At least 6 characters
  // - At least one letter
  // - At least one number
  // - Maximum 128 characters
  if (password.length < 6 || password.length > 128) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
};

// Validate name
const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  // Name requirements:
  // - 2-50 characters
  // - Only letters, spaces, hyphens, and apostrophes
  // - No leading/trailing spaces
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) return false;
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(trimmedName);
};

// Validate product name
const isValidProductName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 255;
};

// Validate price
const isValidPrice = (price) => {
  if (price === null || price === undefined) return false;
  
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
};

// Validate description
const isValidDescription = (description) => {
  if (!description || typeof description !== 'string') return false;
  
  const trimmedDesc = description.trim();
  return trimmedDesc.length >= 10 && trimmedDesc.length <= 2000;
};

// Validate URL
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return validator.isURL(url, { protocols: ['http', 'https'] });
};

// Validate ID parameter
const isValidId = (id) => {
  if (!id) return false;
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

// Rate limiting helper
const createRateLimit = (windowMs, max, message) => {
  return {
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  };
};

module.exports = {
  sanitizeInput,
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidProductName,
  isValidPrice,
  isValidDescription,
  isValidUrl,
  isValidId,
  createRateLimit
};
