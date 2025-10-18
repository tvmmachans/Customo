import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Upload single file
router.post('/single', async (req: AuthRequest, res) => {
  try {
    // For now, return mock data - can be implemented later
    res.json({
      success: true,
      data: {
        url: 'mock_file_url',
        publicId: 'mock_public_id'
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;