import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all devices for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    // For now, return empty array - can be implemented later
    res.json({
      success: true,
      data: {
        devices: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;