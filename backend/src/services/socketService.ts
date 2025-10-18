import { Server as SocketIOServer } from 'socket.io';

export function initializeSocketIO(io: SocketIOServer): void {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Add more socket event handlers as needed
  });
}