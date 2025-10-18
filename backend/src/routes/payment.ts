import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', async (req: AuthRequest, res) => {
  try {
    // For now, return mock data - can be implemented later
    res.json({
      success: true,
      data: {
        clientSecret: 'mock_client_secret',
        paymentIntentId: 'mock_payment_intent_id'
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;