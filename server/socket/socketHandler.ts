import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from '../config/db.ts';

let ioInstance: SocketIOServer | null = null;
const onlineStaff = new Map<string, { socketId: string; name: string; role: string; station: string }>();

export const initSocket = (io: SocketIOServer) => {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    // Register connected client
    socket.on('user:join', (data: { name: string; role: string; station?: string }) => {
      onlineStaff.set(socket.id, {
        socketId: socket.id,
        name: data?.name || 'Warehouse Staff',
        role: data?.role || 'staff',
        station: data?.station || 'Zebra TC57'
      });
      io.emit('staff:online', Array.from(onlineStaff.values()));
    });

    // Client can request fresh data
    socket.on('sync:request', () => {
      socket.emit('sync:products', db.products);
      socket.emit('sync:activities', db.activities);
    });

    socket.on('disconnect', () => {
      if (onlineStaff.has(socket.id)) {
        onlineStaff.delete(socket.id);
        io.emit('staff:online', Array.from(onlineStaff.values()));
      }
    });
  });
};

export const getIO = (): SocketIOServer | null => {
  return ioInstance;
};

export const broadcastStockUpdate = (product: any, activity: any) => {
  if (ioInstance) {
    ioInstance.emit('stock:updated', { product, activity });
    if (activity) {
      ioInstance.emit('activity:new', activity);
    }
  }
};

export const broadcastProductChange = (type: 'added' | 'updated' | 'deleted', data: any) => {
  if (ioInstance) {
    ioInstance.emit(`product:${type}`, data);
  }
};
