import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Socket.IO connected to StockPulse Server:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket.IO disconnected:', reason);
    });
  }

  return socket;
};

export const registerUserOnSocket = (user: { name: string; role: string; station?: string }) => {
  const s = getSocket();
  if (s.connected) {
    s.emit('user:join', user);
  } else {
    s.once('connect', () => {
      s.emit('user:join', user);
    });
  }
};
