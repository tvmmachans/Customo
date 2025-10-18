const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters long')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be 6-128 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Product creation validation
const validateProductCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be 2-255 characters long'),
  
  body('price')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be a positive number between 0 and 999,999.99'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters long'),
  
  body('image_url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image URL must be a valid HTTP/HTTPS URL'),
  
  handleValidationErrors
];

// Product update validation
const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be 2-255 characters long'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be a positive number between 0 and 999,999.99'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters long'),
  
  body('image_url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image URL must be a valid HTTP/HTTPS URL'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  handleValidationErrors
];

// Query parameter validation for products
const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be 2-100 characters long'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProductCreation,
  validateProductUpdate,
  validateId,
  validateProductQuery,
  handleValidationErrors
};
