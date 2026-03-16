import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import cropRoutes from "./routes/crop.route.js";
import fertilizerRoutes from "./routes/fertilizer.route.js";
import diseaseRoutes from "./routes/disease.route.js";
import weatherRoutes from "./routes/weather.route.js";
import contactRoutes from "./routes/contact.route.js";
import postRoutes from "./routes/post.route.js";
import resourceRoutes from "./routes/resource.route.js";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

// Get the port from environment variables or use a default value
const PORT = process.env.PORT || 5000;

// Create an Express application
const app = express();

// Enable CORS for all routes and allow credentials (cookies) to be sent from the client
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-agri-prediction-system.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Smart Agri Prediction System Server is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/user", userRoutes);

// Crop routes
app.use("/api/crop", cropRoutes);

// Fertilizer routes
app.use("/api/fertilizer", fertilizerRoutes);

// Disease routes
app.use("/api/disease", diseaseRoutes);

// Weather routes
app.use("/api/weather", weatherRoutes);

// Contact routes
app.use("/api/contact", contactRoutes);

// Post routes
app.use("/api/post", postRoutes);

// Resource routes
app.use("/api/resources", resourceRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
