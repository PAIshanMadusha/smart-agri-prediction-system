import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cropRoutes from "./routes/crop.route.js";
import fertilizerRoutes from "./routes/fertilizer.route.js";
import diseaseRoutes from "./routes/disease.route.js";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

// Get the port from environment variables or use a default value
const PORT = process.env.PORT || 5000;

// Create an Express application
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Smart Agri Prediction System Server is running");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Crop, Fertilizer, and Disease routes
app.use("/api/crop", cropRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/disease", diseaseRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
