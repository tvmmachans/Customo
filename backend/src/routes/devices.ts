import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's devices
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['ACTIVE', 'IDLE', 'MAINTENANCE', 'OFFLINE', 'ERROR']),
  query('type').optional().trim(),
  query('isOnline').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
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
      status,
      type,
      isOnline
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;

    // Build where clause
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = { contains: type, mode: 'insensitive' };
    }

    if (isOnline !== undefined) {
      where.isOnline = isOnline === 'true';
    }

    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true
            }
          }
        }
      }),
      prisma.device.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        devices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
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

// Get single device
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const device = await prisma.device.findFirst({
      where: {
        id,
        userId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            specifications: true
          }
        },
        serviceTickets: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: { device }
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add new device
router.post('/', [
  body('name').notEmpty().trim(),
  body('type').notEmpty().trim(),
  body('location').optional().trim(),
  body('productId').optional().isUUID()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, type, location, productId } = req.body;
    const userId = req.user?.id;

    // If productId is provided, verify it exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found'
        });
      }
    }

    const device = await prisma.device.create({
      data: {
        name,
        type,
        location,
        productId,
        userId: userId!
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Device added successfully',
      data: { device }
    });
  } catch (error) {
    console.error('Add device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update device
router.put('/:id', [
  body('name').optional().trim(),
  body('type').optional().trim(),
  body('location').optional().trim(),
  body('status').optional().isIn(['ACTIVE', 'IDLE', 'MAINTENANCE', 'OFFLINE', 'ERROR']),
  body('battery').optional().isInt({ min: 0, max: 100 }),
  body('tasks').optional().trim()
], async (req: AuthRequest, res: Response) => {
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
    const userId = req.user?.id;
    const updateData = req.body;

    // Check if device exists and belongs to user
    const existingDevice = await prisma.device.findFirst({
      where: { id, userId }
    });

    if (!existingDevice) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const device = await prisma.device.update({
      where: { id },
      data: {
        ...updateData,
        lastSeen: new Date(),
        isOnline: updateData.status !== 'OFFLINE' && updateData.status !== 'ERROR'
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: { device }
    });
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete device
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if device exists and belongs to user
    const device = await prisma.device.findFirst({
      where: { id, userId }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    await prisma.device.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Control device (start, stop, pause, reset)
router.post('/:id/control', [
  body('action').isIn(['start', 'stop', 'pause', 'reset', 'maintenance']),
  body('parameters').optional().isObject()
], async (req: AuthRequest, res: Response) => {
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
    const { action, parameters } = req.body;
    const userId = req.user?.id;

    // Check if device exists and belongs to user
    const device = await prisma.device.findFirst({
      where: { id, userId }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update device status based on action
    let newStatus = device.status;
    let newTasks = device.tasks;

    switch (action) {
      case 'start':
        newStatus = 'ACTIVE';
        newTasks = 'Device started and running';
        break;
      case 'stop':
        newStatus = 'IDLE';
        newTasks = 'Device stopped';
        break;
      case 'pause':
        newStatus = 'IDLE';
        newTasks = 'Device paused';
        break;
      case 'reset':
        newStatus = 'IDLE';
        newTasks = 'Device reset';
        break;
      case 'maintenance':
        newStatus = 'MAINTENANCE';
        newTasks = 'Device in maintenance mode';
        break;
    }

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        status: newStatus,
        tasks: newTasks,
        lastSeen: new Date(),
        isOnline: newStatus !== 'OFFLINE' && newStatus !== 'ERROR'
      }
    });

    res.json({
      success: true,
      message: `Device ${action} command executed successfully`,
      data: { device: updatedDevice }
    });
  } catch (error) {
    console.error('Control device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get device statistics
router.get('/stats/overview', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [
      totalDevices,
      activeDevices,
      onlineDevices,
      maintenanceDevices,
      lowBatteryDevices
    ] = await Promise.all([
      prisma.device.count({ where: { userId } }),
      prisma.device.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.device.count({ where: { userId, isOnline: true } }),
      prisma.device.count({ where: { userId, status: 'MAINTENANCE' } }),
      prisma.device.count({ where: { userId, battery: { lte: 20 } } })
    ]);

    res.json({
      success: true,
      data: {
        totalDevices,
        activeDevices,
        onlineDevices,
        maintenanceDevices,
        lowBatteryDevices
      }
    });
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update device location
router.put('/:id/location', [
  body('location').notEmpty().trim()
], async (req: AuthRequest, res: Response) => {
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
    const { location } = req.body;
    const userId = req.user?.id;

    // Check if device exists and belongs to user
    const device = await prisma.device.findFirst({
      where: { id, userId }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: { location }
    });

    res.json({
      success: true,
      message: 'Device location updated successfully',
      data: { device: updatedDevice }
    });
  } catch (error) {
    console.error('Update device location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
