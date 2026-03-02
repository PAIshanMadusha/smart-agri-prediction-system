import dotenv from "dotenv";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
  // MongoDB connection URI
  const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/smart-agri-prediction-system";

  // Attempt to connect to MongoDB
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
