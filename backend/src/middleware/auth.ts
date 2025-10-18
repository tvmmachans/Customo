import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getPool } from '../db/sqlite';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user from database
    const result = await getPool().query(
      'SELECT id, email, role, is_active FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );
    const rows = result[0] as any[];
    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found.' 
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required.' 
    });
  }
  return next();
};

export const technicianMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!['ADMIN', 'TECHNICIAN'].includes(req.user?.role || '')) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Technician role required.' 
    });
  }
  return next();
};
