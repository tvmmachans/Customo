const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  validateProductCreation, 
  validateProductUpdate, 
  validateId, 
  validateProductQuery 
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Rate limiting for product routes
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes with validation
router.get('/', productLimiter, validateProductQuery, getAllProducts);
router.get('/:id', productLimiter, validateId, getProductById);

// Admin routes (protected with authentication)
router.post('/', authMiddleware, productLimiter, validateProductCreation, createProduct);
router.put('/:id', authMiddleware, productLimiter, validateId, validateProductUpdate, updateProduct);
router.delete('/:id', authMiddleware, productLimiter, validateId, deleteProduct);

module.exports = router;
