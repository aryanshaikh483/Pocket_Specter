require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/db/mongo");
const chatRoutes     = require("./src/routes/chat");
const documentRoutes = require("./src/routes/documents");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", chatRoutes);
app.use("/api/documents", documentRoutes);

// Health check
app.get("/health", async (req, res) => {
  const mongoose = require("mongoose");
  const mongoStatus = mongoose.connection.readyState === 1
    ? "connected"
    : "disconnected";

  res.json({
    status: "healthy",
    service: "express-chat-engine",
    mongodb: mongoStatus,
    timestamp: new Date().toISOString(),
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server:  http://localhost:${PORT}`);
  console.log(`🏥 Health:  http://localhost:${PORT}/health`);
  console.log(`🧪 Frontend: http://localhost:3000\n`);
});