import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { technicianMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's service tickets
router.get('/tickets', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CANCELLED']),
  query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
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
      status,
      priority
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;

    // Build where clause
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const [tickets, total] = await Promise.all([
      prisma.serviceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      }),
      prisma.serviceTicket.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get service tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single service ticket
router.get('/tickets/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const ticket = await prisma.serviceTicket.findFirst({
      where: {
        id,
        userId
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            location: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Service ticket not found'
      });
    }

    res.json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Get service ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create service ticket
router.post('/tickets', [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('issueType').notEmpty().trim(),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('deviceId').optional().isUUID(),
  body('scheduledDate').optional().isISO8601()
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
      title,
      description,
      issueType,
      priority,
      deviceId,
      scheduledDate
    } = req.body;
    const userId = req.user?.id;

    // If deviceId is provided, verify it exists and belongs to user
    if (deviceId) {
      const device = await prisma.device.findFirst({
        where: { id: deviceId, userId }
      });

      if (!device) {
        return res.status(400).json({
          success: false,
          message: 'Device not found or does not belong to you'
        });
      }
    }

    // Generate ticket number
    const ticketCount = await prisma.serviceTicket.count();
    const ticketNumber = `TK-${String(ticketCount + 1).padStart(3, '0')}`;

    const ticket = await prisma.serviceTicket.create({
      data: {
        ticketNumber,
        userId,
        deviceId,
        title,
        description,
        issueType,
        priority,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service ticket created successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Create service ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update service ticket (user can only update their own tickets)
router.put('/tickets/:id', [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('scheduledDate').optional().isISO8601()
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
    const userId = req.user?.id;
    const updateData = req.body;

    // Check if ticket exists and belongs to user
    const existingTicket = await prisma.serviceTicket.findFirst({
      where: { id, userId }
    });

    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: 'Service ticket not found'
      });
    }

    // Users can only update certain fields
    const allowedFields = ['title', 'description', 'priority', 'scheduledDate'];
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {} as any);

    if (filteredData.scheduledDate) {
      filteredData.scheduledDate = new Date(filteredData.scheduledDate);
    }

    const ticket = await prisma.serviceTicket.update({
      where: { id },
      data: filteredData,
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Service ticket updated successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Update service ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Cancel service ticket
router.put('/tickets/:id/cancel', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if ticket exists and belongs to user
    const ticket = await prisma.serviceTicket.findFirst({
      where: { id, userId }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Service ticket not found'
      });
    }

    if (ticket.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed ticket'
      });
    }

    const updatedTicket = await prisma.serviceTicket.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      message: 'Service ticket cancelled successfully',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    console.error('Cancel service ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all service tickets (Admin/Technician only)
router.get('/admin/tickets', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CANCELLED']),
  query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  query('assignedTo').optional().trim()
], technicianMiddleware, async (req: AuthRequest, res) => {
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
      priority,
      assignedTo
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    const [tickets, total] = await Promise.all([
      prisma.serviceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          device: {
            select: {
              id: true,
              name: true,
              type: true,
              status: true
            }
          }
        }
      }),
      prisma.serviceTicket.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get admin service tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign ticket to technician
router.put('/admin/tickets/:id/assign', [
  body('assignedTo').notEmpty().trim()
], technicianMiddleware, async (req: AuthRequest, res) => {
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
    const { assignedTo } = req.body;

    const ticket = await prisma.serviceTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Service ticket not found'
      });
    }

    const updatedTicket = await prisma.serviceTicket.update({
      where: { id },
      data: {
        assignedTo,
        status: 'IN_PROGRESS'
      }
    });

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update ticket status (Admin/Technician only)
router.put('/admin/tickets/:id/status', [
  body('status').isIn(['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CANCELLED']),
  body('notes').optional().trim()
], technicianMiddleware, async (req: AuthRequest, res) => {
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
    const { status, notes } = req.body;

    const updateData: any = { status };

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const ticket = await prisma.serviceTicket.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      completedTickets,
      urgentTickets
    ] = await Promise.all([
      prisma.serviceTicket.count({ where: { userId } }),
      prisma.serviceTicket.count({ where: { userId, status: 'OPEN' } }),
      prisma.serviceTicket.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.serviceTicket.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.serviceTicket.count({ where: { userId, priority: 'URGENT' } })
    ]);

    res.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        inProgressTickets,
        completedTickets,
        urgentTickets
      }
    });
  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
