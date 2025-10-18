import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get cart for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    // For now, return empty cart - can be implemented later
    res.json({
      success: true,
      data: {
        items: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;