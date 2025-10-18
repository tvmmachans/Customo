const { executeQuery } = require('../config/db-sqlite');
const { 
  sanitizeInput, 
  isValidProductName, 
  isValidPrice, 
  isValidDescription, 
  isValidUrl, 
  isValidId 
} = require('../utils/validation');

// Get all products with pagination and filtering
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, minPrice, maxPrice } = req.query;
    
    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
      });
    }
    
    const offset = (pageNum - 1) * limitNum;
    
    // Build query with optional filters
    let query = 'SELECT id, name, price, description, image_url, created_at FROM products WHERE 1=1';
    const params = [];
    
    if (search) {
      const sanitizedSearch = sanitizeInput(search);
      if (sanitizedSearch.length >= 2) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${sanitizedSearch}%`;
        params.push(searchTerm, searchTerm);
      }
    }
    
    if (minPrice && !isNaN(minPrice) && parseFloat(minPrice) >= 0) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice && !isNaN(maxPrice) && parseFloat(maxPrice) >= 0) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);
    
    const products = await executeQuery(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (search) {
      const sanitizedSearch = sanitizeInput(search);
      if (sanitizedSearch.length >= 2) {
        countQuery += ' AND (name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${sanitizedSearch}%`;
        countParams.push(searchTerm, searchTerm);
      }
    }
    
    if (minPrice && !isNaN(minPrice) && parseFloat(minPrice) >= 0) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }
    
    if (maxPrice && !isNaN(maxPrice) && parseFloat(maxPrice) >= 0) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }
    
    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get all products error:', {
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

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    const products = await executeQuery(
      'SELECT id, name, price, description, image_url, created_at FROM products WHERE id = ?',
      [parseInt(id)]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    res.json({
      success: true,
      data: {
        product
      }
    });

  } catch (error) {
    console.error('❌ Get product by ID error:', {
      message: error.message,
      code: error.code,
      productId: req.params.id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Create product (Admin only - for testing purposes)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image_url } = req.body;

    // Validate required fields
    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and description are required'
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedImageUrl = image_url ? sanitizeInput(image_url) : null;

    // Validate input formats
    if (!isValidProductName(sanitizedName)) {
      return res.status(400).json({
        success: false,
        message: 'Product name must be 2-255 characters long'
      });
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number between 0 and 999,999.99'
      });
    }

    if (!isValidDescription(sanitizedDescription)) {
      return res.status(400).json({
        success: false,
        message: 'Description must be 10-2000 characters long'
      });
    }

    if (sanitizedImageUrl && !isValidUrl(sanitizedImageUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Image URL must be a valid HTTP/HTTPS URL'
      });
    }

    const result = await executeQuery(
      'INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)',
      [sanitizedName, parseFloat(price), sanitizedDescription, sanitizedImageUrl]
    );

    const productId = result.insertId;

    // Log successful creation
    console.log(`✅ Product created successfully: ${sanitizedName} (ID: ${productId})`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: {
          id: productId,
          name: sanitizedName,
          price: parseFloat(price),
          description: sanitizedDescription,
          image_url: sanitizedImageUrl
        }
      }
    });

  } catch (error) {
    console.error('❌ Create product error:', {
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

// Update product (Admin only - for testing purposes)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    // Check if product exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (price !== undefined) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number'
        });
      }
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE products SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    // Get updated product
    const updatedProducts = await executeQuery(
      'SELECT id, name, price, description, image_url, created_at, updated_at FROM products WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProducts[0]
      }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete product (Admin only - for testing purposes)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid product ID is required'
      });
    }

    // Check if product exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await executeQuery('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
