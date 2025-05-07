import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Create an Express application
const app = express();
app.use(cors()); // Enable CORS for all routes

// 1. Create an HTTP server wrapping the Express app
const server = http.createServer(app);

// 2️. Initialize a Socket.io server, allowing CORS from any origin
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 3️. Listen for client connections
io.on("connection", (socket) => {
  console.log("⚡️ New client connected:", socket.id);

  // — You can register custom socket events here —
  socket.on("new_message", (message) => {
    //broadcast this message to all the clients.
    socket.broadcast.emit("broadcast_message", message);
  });

  // Handle client disconnect
  socket.on("disconnect", (reason) => {
    console.log(`❌ Client ${socket.id} disconnected:`, reason);
  });
});

// Start listening on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
