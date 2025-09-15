import { io } from 'socket.io-client';

const connectUser = (accessToken) => {
  const socket = io('http://localhost:8000', {
    auth: {
      token: accessToken,
    },
  });

  socket.on('connect', () => console.log('Connected to server'));

  socket.on('disconnect', () => console.log('Disconnected'));

  return socket;
};

export default connectUser;
