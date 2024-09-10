import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
let users = {};
let messages = [];

// Handle user connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle joining a chat
  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.emit('message', { user: 'admin', text: `${username}, welcome to the chat!` });
    socket.broadcast.emit('message', { user: 'admin', text: `${username} has joined the chat` });
  });

  // Handle chat message
  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    const message = { user, text: msg };
    messages.push(message);
    io.emit('chat message', message); // Broadcast to all clients
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('message', { user: 'admin', text: `${username} has left the chat` });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
