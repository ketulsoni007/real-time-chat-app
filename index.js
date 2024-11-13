import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import path from "path";

const app = express();
const server = http.createServer(app);

dotenv.config();
connectDB();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/chat", chatRoute);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket connection setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins their own room using userId
  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, io };
