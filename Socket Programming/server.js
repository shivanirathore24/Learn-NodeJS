import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connect } from "./config.js";
import { chatModel } from "./chat.schema.js";

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

  socket.on("join", (data) => {
    socket.username = data;
    // send old messages to the clients.
    chatModel.find().sort({ timestamp: 1 }).limit(100)
      .then((messages) => {
        socket.emit("load_messages", messages);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("new_message", (messageData) => {
    const { username, message, timestamp } = messageData;  // Changed here

    const newChat = new chatModel({
        username: username,
        message: message,  // Changed here
        timestamp: new Date(timestamp),
    });

    newChat.save()
        .then((savedMessage) => {
            console.log("Message saved:", savedMessage);
            //broadcast this message to all the clients.
            socket.broadcast.emit("broadcast_message", messageData);
        })
        .catch((err) => {
            console.error("Error saving message:", err);
        });
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
  connect();
});
