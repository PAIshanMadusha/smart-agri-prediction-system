import mongoose from "mongoose";

// Crop Disease Detection schema
const diseaseDetectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    predictedDisease: {
      type: String,
    },

    confidenceScore: {
      type: Number,
    },

    topPredictions: [
      {
        disease: String,
        confidence: Number,
      },
    ],

    isLowConfidence: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("DiseaseDetection", diseaseDetectionSchema);
