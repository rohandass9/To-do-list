
require('dotenv').config(); // Add this as the FIRST line

const express = require("express");
const path = require("path");
const connectDB = require("./config/db"); // Import your DB connection
const taskRoutes = require("./routes/taskRoutes"); // Import your routes
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes - Use your MongoDB-based routes
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    const mongoose = require("mongoose");
    res.json({
        status: "healthy",
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// Serve index.html for root route (optional)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, "public")}`);
});