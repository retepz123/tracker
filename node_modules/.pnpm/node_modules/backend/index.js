import express from 'express';
import process from 'node:process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';

import authenticateRoute from './routes/authenticate-routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('🚀 Connected')
  } catch(error){
    console.error('❌ Unable to connect');
  }
}
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://tracker-97by.onrender.com'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.set('port', PORT);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

app.use('/api/auth', authenticateRoute);

// Wrap Express with HTTP server
const server = http.createServer(app);

const io = new Server(server, {  // pass the http.Server instance
  cors: {
    origin: ['https://tracker-97by.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send-location', ({ userId, lat, lng}) => {
    users[userId] = {lat, lng};

    //broadcast the location to other user
    io.emit('update-location', users);
  });

   socket.on('disconnect', () => {
    const userId = userSockets[socket.id];
    if (userId) {
      delete users[userId];
      delete userSockets[socket.id];
    }
    io.emit('update-locations', users);
  });
});

server.listen(3000, () => console.log('Server running on 3000'

));

