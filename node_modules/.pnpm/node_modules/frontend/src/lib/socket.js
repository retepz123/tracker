import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
export const socket = io('https://tracker-backend-okdn.onrender.com',{
  auth: {
    token: token,
  },
   transports: ['websocket'],
   withCredentials: true,
});

export const initSocket = () => {
  const token = localStorage.getItem('token');
  return io('https://tracker-backend-okdn.onrender.com', {
      auth: { token:  localStorage.getItem('token'), },
    transports: ['websocket'],
    withCredentials: true,
  });
};