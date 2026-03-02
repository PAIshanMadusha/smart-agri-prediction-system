import axios from "axios";
import FertilizerRecommendation from "../models/fertilizerRecommendation.model.js";

// AI service URL (can be set via environment variable)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Predict fertilizer based on soil, weather, and crop data
export const predictFertilizer = async (req, res) => {
  try {
    const {
      temperature,
      humidity,
      moisture,
      nitrogen,
      potassium,
      phosphorous,
      soil_type,
      crop_type,
    } = req.body;

    // Validate input parameters
    if (
      !temperature ||
      !humidity ||
      !moisture ||
      !nitrogen ||
      !potassium ||
      !phosphorous ||
      !soil_type ||
      !crop_type
    ) {
      return res.status(400).json({
        success: false,
        message: "All soil, weather, and crop parameters are required!",
      });
    }

    // Call AI service for prediction
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/fertilizer/predict`,
      {
        temperature,
        humidity,
        moisture,
        nitrogen,
        potassium,
        phosphorous,
        soil_type,
        crop_type,
      },
    );

    const { recommendations } = aiResponse.data;

    // Save the recommendation to the database
    const record = await FertilizerRecommendation.create({
      user: req.userId,
      cropType: crop_type,
      soilType: soil_type,
      soilData: {
        nitrogen,
        phosphorus: phosphorous,
        potassium,
        moisture,
        temperature,
        humidity,
      },
      recommendedFertilizers: recommendations,
    });

    return res.status(200).json({
      success: true,
      message: "Fertilizer recommendation generated successfully!",
      recommendations,
      recordId: record._id,
    });
  } catch (error) {
    console.error("Fertilizer prediction error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get fertilizer recommendation history for the user
export const getFertilizerHistory = async (req, res) => {
  try {
    // Ensure user ID is available in the request (set by auth middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing in the request!",
      });
    }

    // Fetch fertilizer recommendation records for the user, sorted by most recent
    const records = await FertilizerRecommendation.find({
      user: req.userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Fertilizer history retrieved successfully!",
      records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
