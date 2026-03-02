import axios from "axios";
import CropRecommendation from "../models/cropRecommendation.model.js";

// AI service URL (can be set via environment variable)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Predict crop based on soil and weather data
export const predictCrop = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Validate input parameters
    if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
      return res.status(400).json({
        success: false,
        message: "All soil and weather parameters are required!",
      });
    }

    // Call AI service for prediction
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/crop/predict`, {
      N,
      P,
      K,
      temperature,
      humidity,
      ph,
      rainfall,
    });

    const { recommendations } = aiResponse.data;

    // Save the recommendation to the database
    const record = await CropRecommendation.create({
      user: req.userId,
      soilData: {
        nitrogen: N,
        phosphorus: P,
        potassium: K,
        ph,
      },
      weatherData: {
        temperature,
        humidity,
        rainfall,
      },
      recommendedCrops: recommendations,
    });

    return res.status(200).json({
      success: true,
      message: "Crop recommendation generated successfully!",
      recommendations,
      recordId: record._id,
    });
  } catch (error) {
    console.error("Crop prediction error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get crop recommendation history for the user
export const getCropHistory = async (req, res) => {
  try {
    // Ensure user ID is available in the request (set by auth middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing in the request!",
      });
    }

    // Fetch crop recommendation records for the user, sorted by most recent
    const records = await CropRecommendation.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Crop history retrieved successfully!",
      records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
