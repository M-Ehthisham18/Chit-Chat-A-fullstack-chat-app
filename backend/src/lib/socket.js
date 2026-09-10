import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { parseCookie } from "cookie";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174","http://localhost:5173"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  // Derive identity from the HTTP-only JWT cookie in the handshake headers
  const cookieHeader = socket.handshake.headers.cookie;
  let token = null;

      if (cookieHeader) {
        const cookies = parseCookie(cookieHeader);
        token = cookies.jwt;
      }

  if (!token) {
    console.log("Socket connection rejected: No JWT cookie provided");
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      console.log("Socket connection rejected: Invalid token payload");
      socket.disconnect();
      return;
    }

    userSocketMap[userId] = socket.id;

    // Store userId on socket for easier access in other events
    socket.userId = userId;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } catch (error) {
    console.log("Socket connection rejected: JWT verification failed", error.message);
    socket.disconnect();
  }
});

export { io, app, server };
