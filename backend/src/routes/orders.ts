import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user orders
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
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

    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;

    // Build where clause
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single order
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Cancel order
router.put('/:id/cancel', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockCount: {
            increment: item.quantity
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update shipping address
router.put('/:id/shipping-address', [
  body('shippingAddress').isObject()
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
    const { shippingAddress } = req.body;
    const userId = req.user?.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update shipping address for shipped orders'
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { shippingAddress }
    });

    res.json({
      success: true,
      message: 'Shipping address updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Update shipping address error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Track order
router.get('/:id/tracking', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        trackingNumber: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Mock tracking information based on order status
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.status === 'SHIPPED' 
        ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        : null,
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: order.createdAt,
          description: 'Your order has been placed and is being processed'
        },
        ...(order.status !== 'PENDING' ? [{
          status: 'Confirmed',
          timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000), // 30 minutes later
          description: 'Your order has been confirmed'
        }] : []),
        ...(order.status === 'SHIPPED' || order.status === 'DELIVERED' ? [{
          status: 'Shipped',
          timestamp: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day later
          description: `Your order has been shipped${order.trackingNumber ? ` with tracking number ${order.trackingNumber}` : ''}`
        }] : []),
        ...(order.status === 'DELIVERED' ? [{
          status: 'Delivered',
          timestamp: new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
          description: 'Your order has been delivered'
        }] : [])
      ]
    };

    res.json({
      success: true,
      data: { tracking: trackingInfo }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
