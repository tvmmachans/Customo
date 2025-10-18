import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
// Use CommonJS helper for JWT to centralize secret handling and types
const { signToken, verifyToken } = require('../utils/jwt');
import { getPool, withConnection } from '../db/sqlite';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
// Using MySQL via mysql2 now; no Prisma

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phone').optional().trim(),
  body('company').optional().trim()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password, firstName, lastName, phone, company } = req.body;

    // Check if user already exists
    const result = await getPool().query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const rows = result[0] as any[];
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = cryptoRandomId();
    await withConnection(async (conn) => {
      await conn.query(
        `INSERT INTO users (id, email, password, first_name, last_name, phone, company, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'CUSTOMER', 1, NOW(), NOW())`,
        [userId, email, hashedPassword, firstName || null, lastName || null, phone || null, company || null]
      );
    });
    const user = {
      id: userId,
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      company: company || null,
      role: 'CUSTOMER',
      createdAt: new Date()
    };

    // Generate JWT token
    // Generate JWT token
    let token: string;
    try {
      token = signToken({ userId: user.id, email: user.email });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const result = await getPool().query(
      'SELECT id, email, password, first_name, last_name, phone, company, role, is_active, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const rows = result[0] as any[];
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    let token: string;
    try {
      token = signToken({ userId: user.id, email: user.email });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          company: user.company,
          role: user.role,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    let decoded: any;
    try {
      decoded = verifyToken(token) as any;
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    
    const result = await getPool().query(
      'SELECT id, email, first_name, last_name, phone, company, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );
    const rows = result[0] as any[];
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
      return;
    }

    res.json({
      success: true,
      data: { user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        company: user.company,
        role: user.role,
        isActive: !!user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      } }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Update profile
router.put('/profile', [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phone').optional().trim(),
  body('company').optional().trim()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    let decoded: any;
    try {
      decoded = verifyToken(token) as any;
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    const { firstName, lastName, phone, company } = req.body;

    await withConnection(async (conn) => {
      await conn.query(
        `UPDATE users SET first_name = ?, last_name = ?, phone = ?, company = ?, updated_at = NOW() WHERE id = ?`,
        [firstName || null, lastName || null, phone || null, company || null, decoded.userId]
      );
    });
    const result = await getPool().query(
      'SELECT id, email, first_name, last_name, phone, company, role, updated_at FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );
    const rows = result[0] as any[];
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        company: user.company,
        role: user.role,
        updatedAt: user.updated_at,
      } }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password
router.put('/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    let decoded: any;
    try {
      decoded = verifyToken(token) as any;
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    const { currentPassword, newPassword } = req.body;

    const result = await getPool().query(
      'SELECT id, password FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );
    const rows = result[0] as any[];
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await withConnection(async (conn) => {
      await conn.query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedNewPassword, decoded.userId]);
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

function cryptoRandomId(): string {
  // UUID v4 compatible
  return ([1e7] as any+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
}