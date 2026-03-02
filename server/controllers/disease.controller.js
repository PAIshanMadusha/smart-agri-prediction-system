import axios from "axios";
import FormData from "form-data";
import DiseaseDetection from "../models/diseaseDetection.model.js";
import cloudinary from "../cloudinary/cloudinary.config.js";

// AI service URL (can be set via environment variable)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Predict disease based on leaf image
export const predictDisease = async (req, res) => {
  try {
    // Validate that an image file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No image file uploaded. Please upload a leaf image for disease prediction!",
      });
    }

    // Upload image to Cloudinary and get the URL
    const uploadResult = await new Promise((resolve, reject) => {
      // Create a stream to upload the image buffer to Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        { folder: "agri-disease" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });

    // Get the secure URL of the uploaded image
    const imageUrl = uploadResult.secure_url;

    // Prepare form data for AI service
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call AI service for disease prediction
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/disease/predict`,
      formData,
      { headers: formData.getHeaders(), timeout: 15000 },
    );

    // Extract prediction results
    const { prediction, confidence, top_predictions } = aiResponse.data;

    // Determine if the confidence is low (below 50%)
    const isLowConfidence = confidence < 50;

    // Save the prediction result to the database
    const record = await DiseaseDetection.create({
      user: req.userId,
      imageUrl,
      predictedDisease: prediction,
      confidenceScore: confidence,
      topPredictions: top_predictions || [],
      isLowConfidence,
    });

    return res.status(200).json({
      success: true,
      message: "Disease prediction generated successfully!",
      prediction,
      confidence,
      top_predictions,
      isLowConfidence,
      recordId: record._id,
    });
  } catch (error) {
    console.error("Disease prediction error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the disease prediction!",
    });
  }
};

// Get disease prediction history for the user
export const getDiseaseHistory = async (req, res) => {
  try {
    // Ensure user ID is available in the request (set by auth middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing in the request!",
      });
    }

    // Fetch disease prediction records for the user, sorted by most recent
    const records = await DiseaseDetection.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, records });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
