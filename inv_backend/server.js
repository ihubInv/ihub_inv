const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const requestRoutes = require("./routes/requests")
const assetRoutes = require("./routes/assets")
const categoryRoutes = require("./routes/categories")
const dashboardRoutes = require("./routes/dashboard")

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const corsOptions = {
  origin: "*", // Allow all origins (or specify frontend URL)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow frontend domain
  credentials: true, // Allow cookies if needed
  allowedHeaders: ["Content-Type", "Authorization"], // Ensure required headers are allowed
  exposedHeaders: ["Authorization"] // 
};
app.use(cors(corsOptions));
app.use(express.json())

// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/assets", assetRoutes)
app.use("/api/categories", categoryRoutes)
// app.use("/api/dashboard", dashboardRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

