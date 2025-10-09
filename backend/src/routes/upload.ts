import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'model/step',
      'model/stl',
      'application/octet-stream' // For CAD files
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, ZIP files, and CAD files are allowed.'));
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const userId = req.user?.id;
    const { type = 'general' } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `customo/${type}/${userId}`,
          public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
          transformation: type === 'image' ? [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        originalName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload single file error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req: AuthRequest, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const userId = req.user?.id;
    const { type = 'general' } = req.body;
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map(file => 
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: `customo/${type}/${userId}`,
            public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
            transformation: type === 'image' ? [
              { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
            ] : undefined
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              publicId: result.public_id,
              originalName: file.originalname,
              size: file.size,
              type: file.mimetype
            });
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: { files: results }
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// Upload design files for custom builds
router.post('/design', upload.array('files', 5), async (req: AuthRequest, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No design files provided'
      });
    }

    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map(file => 
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: `customo/designs/${userId}`,
            public_id: `design_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            format: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              publicId: result.public_id,
              originalName: file.originalname,
              size: file.size,
              type: file.mimetype
            });
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Design files uploaded successfully',
      data: { files: results }
    });
  } catch (error) {
    console.error('Upload design files error:', error);
    res.status(500).json({
      success: false,
      message: 'Design file upload failed'
    });
  }
});

// Delete file
router.delete('/:publicId', async (req: AuthRequest, res) => {
  try {
    const { publicId } = req.params;
    const userId = req.user?.id;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return res.status(404).json({
        success: false,
        message: 'File not found or already deleted'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed'
    });
  }
});

// Get user's uploaded files
router.get('/files', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { type, page = 1, limit = 20 } = req.query;

    // This would typically be stored in a database
    // For now, we'll return a mock response
    res.json({
      success: true,
      data: {
        files: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files'
    });
  }
});

// Get file info
router.get('/info/:publicId', async (req: AuthRequest, res) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.api.resource(publicId);

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at
      }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

// Generate signed upload URL for direct client uploads
router.post('/signed-url', async (req: AuthRequest, res) => {
  try {
    const { type = 'general', filename, contentType } = req.body;
    const userId = req.user?.id;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `${type}/${userId}/${timestamp}_${filename}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        timestamp: timestamp,
        folder: `customo/${type}/${userId}`
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        publicId,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: `customo/${type}/${userId}`
      }
    });
  } catch (error) {
    console.error('Generate signed URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URL'
    });
  }
});

export default router;
