import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
export const socket = io(import.meta.env.VITE_BACKEND_URL,{
  auth: {
    token: token,
  },
   transports: ['websocket'],
   withCredentials: true,
});

export const initSocket = () => {
  const token = localStorage.getItem('token');
  return io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token:  localStorage.getItem('token'), },
    transports: ['websocket'],
    withCredentials: true,
  });
};