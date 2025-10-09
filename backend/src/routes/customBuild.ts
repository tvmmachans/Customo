import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's custom builds
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['DRAFT', 'QUOTE_REQUESTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'])
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
      status
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const userId = req.user?.id;

    // Build where clause
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [builds, total] = await Promise.all([
      prisma.customBuild.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          parts: {
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
      prisma.customBuild.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        builds,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
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

// Get single custom build
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const build = await prisma.customBuild.findFirst({
      where: {
        id,
        userId
      },
      include: {
        parts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                description: true,
                specifications: true
              }
            }
          }
        }
      }
    });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Custom build not found'
      });
    }

    res.json({
      success: true,
      data: { build }
    });
  } catch (error) {
    console.error('Get custom build error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create custom build
router.post('/', [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('designFiles').optional().isArray(),
  body('parts').isArray({ min: 1 }),
  body('parts.*.productId').isUUID(),
  body('parts.*.quantity').isInt({ min: 1 })
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

    const { name, description, designFiles = [], parts } = req.body;
    const userId = req.user?.id;

  // Calculate total cost
  let totalCost = 0;
  const buildParts: any[] = [];

    for (const part of parts) {
      const product = await prisma.product.findUnique({
        where: { id: part.productId }
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${part.productId} not found`
        });
      }

      if (!product.inStock || product.stockCount < part.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`
        });
      }

      const partTotal = Number(product.price) * part.quantity;
      totalCost += partTotal;

      buildParts.push({
        productId: part.productId,
        quantity: part.quantity
      });
    }

    // Create custom build (cast data to any to match Prisma types temporarily)
    const build = await prisma.customBuild.create({
      data: {
        userId: userId as any,
        name,
        description,
        designFiles,
        totalCost,
        status: 'DRAFT'
      } as any
    } as any);

    // Create build parts
    await prisma.customBuildPart.createMany({
      data: buildParts.map(part => ({
        buildId: build.id,
        ...part
      }))
    });

    // Get the complete build with parts
    const completeBuild = await prisma.customBuild.findUnique({
      where: { id: build.id },
      include: {
        parts: {
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
    });

    res.status(201).json({
      success: true,
      message: 'Custom build created successfully',
      data: { build: completeBuild }
    });
  } catch (error) {
    console.error('Create custom build error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update custom build
router.put('/:id', [
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('designFiles').optional().isArray(),
  body('parts').optional().isArray(),
  body('parts.*.productId').optional().isUUID(),
  body('parts.*.quantity').optional().isInt({ min: 1 })
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
    const { name, description, designFiles, parts } = req.body;
    const userId = req.user?.id;

    // Check if build exists and belongs to user
    const existingBuild = await prisma.customBuild.findFirst({
      where: { id, userId }
    });

    if (!existingBuild) {
      return res.status(404).json({
        success: false,
        message: 'Custom build not found'
      });
    }

    if (existingBuild.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update build in current status'
      });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (designFiles) updateData.designFiles = designFiles;

    // If parts are being updated, recalculate total cost
    if (parts) {
      let totalCost = 0;

      for (const part of parts) {
        const product = await prisma.product.findUnique({
          where: { id: part.productId }
        });

        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product ${part.productId} not found`
          });
        }

        const partTotal = Number(product.price) * part.quantity;
        totalCost += partTotal;
      }

      updateData.totalCost = totalCost;

      // Update build parts
      await prisma.customBuildPart.deleteMany({
        where: { buildId: id }
      });

      await prisma.customBuildPart.createMany({
        data: parts.map((part: any) => ({
          buildId: id,
          productId: part.productId,
          quantity: part.quantity
        })) as any
      } as any);
    }

    const build = await prisma.customBuild.update({
      where: { id },
      data: updateData,
      include: {
        parts: {
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
    });

    res.json({
      success: true,
      message: 'Custom build updated successfully',
      data: { build }
    });
  } catch (error) {
    console.error('Update custom build error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Request quote for custom build
router.post('/:id/request-quote', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const build = await prisma.customBuild.findFirst({
      where: { id, userId }
    });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Custom build not found'
      });
    }

    if (build.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Quote already requested for this build'
      });
    }

    const updatedBuild = await prisma.customBuild.update({
      where: { id },
      data: { status: 'QUOTE_REQUESTED' }
    });

    res.json({
      success: true,
      message: 'Quote request submitted successfully',
      data: { build: updatedBuild }
    });
  } catch (error) {
    console.error('Request quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Cancel custom build
router.put('/:id/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const build = await prisma.customBuild.findFirst({
      where: { id, userId }
    });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Custom build not found'
      });
    }

    if (['COMPLETED', 'CANCELLED'].includes(build.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel build in current status'
      });
    }

    const updatedBuild = await prisma.customBuild.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      message: 'Custom build cancelled successfully',
      data: { build: updatedBuild }
    });
  } catch (error) {
    console.error('Cancel custom build error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete custom build
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const build = await prisma.customBuild.findFirst({
      where: { id, userId }
    });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Custom build not found'
      });
    }

    if (!['DRAFT', 'CANCELLED'].includes(build.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete build in current status'
      });
    }

    await prisma.customBuild.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Custom build deleted successfully'
    });
  } catch (error) {
    console.error('Delete custom build error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
