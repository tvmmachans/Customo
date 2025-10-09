import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const initializeSocketIO = (io: SocketIOServer) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return next(new Error('Authentication error: JWT secret not configured'));
      }
      
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected to Socket.IO`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Join admin room if user is admin
    if (socket.userRole === 'ADMIN') {
      socket.join('admin');
    }

    // Join technician room if user is technician or admin
    if (['ADMIN', 'TECHNICIAN'].includes(socket.userRole || '')) {
      socket.join('technician');
    }

    // Handle device monitoring requests
    socket.on('join-device-monitoring', async (deviceId: string) => {
      try {
        // Verify user has access to this device
        const device = await prisma.device.findFirst({
          where: {
            id: deviceId,
            userId: socket.userId
          }
        });

        if (!device) {
          socket.emit('error', { message: 'Device not found or access denied' });
          return;
        }

        socket.join(`device:${deviceId}`);
        socket.emit('joined-device-monitoring', { deviceId });

        // Send current device status
        socket.emit('device-status', {
          deviceId,
          status: device.status,
          battery: device.battery,
          isOnline: device.isOnline,
          location: device.location,
          tasks: device.tasks,
          lastSeen: device.lastSeen
        });
      } catch (error) {
        console.error('Join device monitoring error:', error);
        socket.emit('error', { message: 'Failed to join device monitoring' });
      }
    });

    // Handle device control commands
    socket.on('device-control', async (data: { deviceId: string; action: string; parameters?: any }) => {
      try {
        const { deviceId, action, parameters } = data;

        // Verify user has access to this device
        const device = await prisma.device.findFirst({
          where: {
            id: deviceId,
            userId: socket.userId
          }
        });

        if (!device) {
          socket.emit('error', { message: 'Device not found or access denied' });
          return;
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

        // Update device in database
        const updatedDevice = await prisma.device.update({
          where: { id: deviceId },
          data: {
            status: newStatus,
            tasks: newTasks,
            lastSeen: new Date(),
            isOnline: newStatus !== 'OFFLINE' && newStatus !== 'ERROR'
          }
        });

        // Broadcast device status update to all users monitoring this device
        io.to(`device:${deviceId}`).emit('device-status-update', {
          deviceId,
          status: updatedDevice.status,
          battery: updatedDevice.battery,
          isOnline: updatedDevice.isOnline,
          location: updatedDevice.location,
          tasks: updatedDevice.tasks,
          lastSeen: updatedDevice.lastSeen,
          action,
          timestamp: new Date()
        });

        socket.emit('device-control-success', {
          deviceId,
          action,
          status: updatedDevice.status
        });
      } catch (error) {
        console.error('Device control error:', error);
        socket.emit('error', { message: 'Device control failed' });
      }
    });

    // Handle battery level updates
    socket.on('update-battery', async (data: { deviceId: string; battery: number }) => {
      try {
        const { deviceId, battery } = data;

        // Verify user has access to this device
        const device = await prisma.device.findFirst({
          where: {
            id: deviceId,
            userId: socket.userId
          }
        });

        if (!device) {
          socket.emit('error', { message: 'Device not found or access denied' });
          return;
        }

        // Update battery level
        const updatedDevice = await prisma.device.update({
          where: { id: deviceId },
          data: {
            battery: Math.max(0, Math.min(100, battery)),
            lastSeen: new Date()
          }
        });

        // Broadcast battery update
        io.to(`device:${deviceId}`).emit('battery-update', {
          deviceId,
          battery: updatedDevice.battery,
          timestamp: new Date()
        });

        // Alert if battery is low
        if (updatedDevice.battery <= 20) {
          io.to(`device:${deviceId}`).emit('low-battery-alert', {
            deviceId,
            battery: updatedDevice.battery,
            message: 'Device battery is low'
          });
        }
      } catch (error) {
        console.error('Update battery error:', error);
        socket.emit('error', { message: 'Battery update failed' });
      }
    });

    // Handle location updates
    socket.on('update-location', async (data: { deviceId: string; location: string }) => {
      try {
        const { deviceId, location } = data;

        // Verify user has access to this device
        const device = await prisma.device.findFirst({
          where: {
            id: deviceId,
            userId: socket.userId
          }
        });

        if (!device) {
          socket.emit('error', { message: 'Device not found or access denied' });
          return;
        }

        // Update location
        const updatedDevice = await prisma.device.update({
          where: { id: deviceId },
          data: {
            location,
            lastSeen: new Date()
          }
        });

        // Broadcast location update
        io.to(`device:${deviceId}`).emit('location-update', {
          deviceId,
          location: updatedDevice.location,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Update location error:', error);
        socket.emit('error', { message: 'Location update failed' });
      }
    });

    // Handle service ticket updates
    socket.on('join-service-monitoring', async (ticketId: string) => {
      try {
        // Verify user has access to this ticket
        const ticket = await prisma.serviceTicket.findFirst({
          where: {
            id: ticketId,
            userId: socket.userId
          }
        });

        if (!ticket) {
          socket.emit('error', { message: 'Service ticket not found or access denied' });
          return;
        }

        socket.join(`ticket:${ticketId}`);
        socket.emit('joined-service-monitoring', { ticketId });
      } catch (error) {
        console.error('Join service monitoring error:', error);
        socket.emit('error', { message: 'Failed to join service monitoring' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from Socket.IO`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Broadcast device status updates to all connected clients
  const broadcastDeviceStatus = async (deviceId: string, status: any) => {
    io.to(`device:${deviceId}`).emit('device-status-update', {
      deviceId,
      ...status,
      timestamp: new Date()
    });
  };

  // Broadcast service ticket updates
  const broadcastServiceTicketUpdate = async (ticketId: string, update: any) => {
    io.to(`ticket:${ticketId}`).emit('service-ticket-update', {
      ticketId,
      ...update,
      timestamp: new Date()
    });
  };

  // Broadcast to admin users
  const broadcastToAdmins = (event: string, data: any) => {
    io.to('admin').emit(event, data);
  };

  // Broadcast to technicians
  const broadcastToTechnicians = (event: string, data: any) => {
    io.to('technician').emit(event, data);
  };

  // Export functions for use in other parts of the application
  return {
    broadcastDeviceStatus,
    broadcastServiceTicketUpdate,
    broadcastToAdmins,
    broadcastToTechnicians
  };
};
