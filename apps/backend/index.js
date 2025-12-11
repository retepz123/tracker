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
let userSockets = {};
let userCounts = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send-location', ({ userId, lat, lng }) => {
    users[userId] = { lat, lng };
    userSockets[socket.id] = userId;

      if (!userCounts[userId]) userCounts[userId] = 0;
    userCounts[userId] += 1;

    // Update the user's latest location
    users[userId] = { lat, lng };

    //broadcast the location to all users
    io.emit('update-location', users);
    console.log('Users updated:', users);
  });

  socket.on('disconnect', () => {
    const userId = userSockets[socket.id];
    if (userId) {
      delete userSockets[socket.id];
      userCounts[userId] -= 1;
    }

    //broadcast updated users
    io.emit('update-location', users);
    console.log('User disconnected. Users now:', users);
  });
});


server.listen(PORT, () => console.log(`Server running on ${PORT}`));

