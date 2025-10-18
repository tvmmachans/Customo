import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { getPool, withConnection } from '../db/sqlite';
import crypto from 'crypto';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['SECURITY', 'ASSISTANT', 'INDUSTRIAL', 'DRONE', 'COMPONENT']),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Build SQL query
    let sql = 'SELECT p.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE p.is_active = 1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (minPrice !== undefined) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (inStock !== undefined) {
      sql += ' AND p.in_stock = ?';
      params.push(inStock === 'true');
    }

    sql += ' GROUP BY p.id';

    // Add ordering
    sql += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const result = await getPool().query(sql, params);
    const products = result[0] as any[];

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1';
    const countParams: any[] = [];

    if (category) {
      countSql += ' AND p.category = ?';
      countParams.push(category);
    }

    if (search) {
      countSql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    if (minPrice !== undefined) {
      countSql += ' AND p.price >= ?';
      countParams.push(minPrice);
    }

    if (maxPrice !== undefined) {
      countSql += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }

    if (inStock !== undefined) {
      countSql += ' AND p.in_stock = ?';
      countParams.push(inStock === 'true');
    }

    const countResult = await getPool().query(countSql, countParams);
    const countRows = countResult[0] as any[];
    const total = countRows[0].total;

    // Format products
    const productsWithRatings = (products as any[]).map(product => ({
      ...product,
      rating: product.avg_rating ? Math.round(product.avg_rating * 10) / 10 : 0,
      reviewCount: product.review_count || 0
    }));

    res.json({
      success: true,
      data: {
        products: productsWithRatings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productResult = await getPool().query(
      'SELECT p.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE p.id = ? GROUP BY p.id',
      [id]
    );
    const productRows = productResult[0] as any[];
    const product = productRows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get reviews
    const reviewsResult = await getPool().query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
      [id]
    );
    const reviews = reviewsResult[0] as any[];

    const productWithRating = {
      ...product,
      rating: product.avg_rating ? Math.round(product.avg_rating * 10) / 10 : 0,
      reviewCount: product.review_count || 0,
      reviews: (reviews as any[]).map(review => ({
        ...review,
        user: {
          firstName: review.first_name,
          lastName: review.last_name
        }
      }))
    };

    res.json({
      success: true,
      data: { product: productWithRating }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create product (Admin only)
router.post('/', [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('category').isIn(['SECURITY', 'ASSISTANT', 'INDUSTRIAL', 'DRONE', 'COMPONENT']),
  body('images').isArray(),
  body('features').isArray(),
  body('specifications').optional().isObject(),
  body('stockCount').optional().isInt({ min: 0 }),
  body('originalPrice').optional().isFloat({ min: 0 })
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      features,
      specifications,
      stockCount = 0,
      badge
    } = req.body;

    const productId = cryptoRandomId();
    await withConnection(async (conn) => {
      await conn.query(
        `INSERT INTO products (id, name, description, price, original_price, category, images, specifications, features, in_stock, stock_count, badge, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [productId, name, description, price, originalPrice || null, category, JSON.stringify(images), JSON.stringify(specifications || {}), JSON.stringify(features), stockCount > 0, stockCount, badge || null]
      );
    });

    const product = {
      id: productId,
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      features,
      specifications,
      stockCount,
      inStock: stockCount > 0,
      badge
    };

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update product (Admin only)
router.put('/:id', [
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['SECURITY', 'ASSISTANT', 'INDUSTRIAL', 'DRONE', 'COMPONENT']),
  body('images').optional().isArray(),
  body('features').optional().isArray(),
  body('specifications').optional().isObject(),
  body('stockCount').optional().isInt({ min: 0 }),
  body('originalPrice').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // If stockCount is being updated, update inStock accordingly
    if (updateData.stockCount !== undefined) {
      updateData.inStock = updateData.stockCount > 0;
    }

    await withConnection(async (conn) => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          let dbKey = key;
          if (key === 'originalPrice') dbKey = 'original_price';
          if (key === 'stockCount') dbKey = 'stock_count';
          if (key === 'isActive') dbKey = 'is_active';
          if (key === 'images' || key === 'features' || key === 'specifications') {
            value = JSON.stringify(value);
          }
          updateFields.push(`${dbKey} = ?`);
          updateValues.push(value);
        }
      });

      if (updateFields.length > 0) {
        updateValues.push(id);
        await conn.query(
          `UPDATE products SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
          updateValues
        );
      }
    });

    const productResult = await getPool().query('SELECT * FROM products WHERE id = ?', [id]);
    const productRows = productResult[0] as any[];
    const product = productRows[0];

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;

    await withConnection(async (conn) => {
      await conn.query('DELETE FROM products WHERE id = ?', [id]);
    });

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
});

// Add product review
router.post('/:id/reviews', [
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').optional().trim(),
  body('comment').optional().trim()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if product exists
    const productResult = await getPool().query('SELECT id FROM products WHERE id = ?', [id]);
    const productRows = productResult[0] as any[];
    const product = productRows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingResult = await getPool().query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, id]
    );
    const existingRows = existingResult[0] as any[];
    const existingReview = existingRows[0];

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const reviewId = cryptoRandomId();
    await withConnection(async (conn) => {
      await conn.query(
        'INSERT INTO reviews (id, user_id, product_id, rating, title, comment, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())',
        [reviewId, userId, id, rating, title || null, comment || null]
      );
    });

    const reviewResult = await getPool().query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
      [reviewId]
    );
    const reviewRows = reviewResult[0] as any[];
    const review = reviewRows[0];

    // Update product rating
    const allReviewsResult = await getPool().query('SELECT rating FROM reviews WHERE product_id = ?', [id]);
    const allReviews = allReviewsResult[0] as any[];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await withConnection(async (conn) => {
      await conn.query(
        'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
        [avgRating, allReviews.length, id]
      );
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get product reviews
router.get('/:id/reviews', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviewsResult = await getPool().query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?',
      [id, Number(limit), skip]
    );
    const reviews = reviewsResult[0] as any[];

    const countResult = await getPool().query('SELECT COUNT(*) as total FROM reviews WHERE product_id = ?', [id]);
    const countRows = countResult[0] as any[];
    const total = countRows[0].total;

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => ({
          ...review,
          user: {
            firstName: review.first_name,
            lastName: review.last_name
          }
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

function cryptoRandomId(): string {
	// Use crypto.randomUUID when available (Node 14.17+/16+). Fallback to manual UUID v4 creation.
	if ((crypto as any).randomUUID) {
		return (crypto as any).randomUUID();
	}

	// Fallback UUID v4 generator
	const bytes = crypto.randomBytes(16);
	// Per RFC 4122 section 4.4, set bits for version and `clock_seq_hi_and_reserved`
	bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
	bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

	const hex = bytes.toString('hex');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export default router;
