import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
export const socket = io('http://localhost:3000',{
  auth: {
    token: token,
  },
   transports: ['websocket'],
   withCredentials: true,
});

export const initSocket = () => {
  const token = localStorage.getItem('token');
  return io('http://localhost:3000', {
      auth: { token:  localStorage.getItem('token'), },
    transports: ['websocket'],
    withCredentials: true,
  });
};