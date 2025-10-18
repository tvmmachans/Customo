import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all custom builds for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    // For now, return empty array - can be implemented later
    res.json({
      success: true,
      data: {
        builds: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Get custom builds error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;