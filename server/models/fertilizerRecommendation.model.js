import mongoose from "mongoose";

// Fertilizer Recommendation schema
const fertilizerRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropType: {
      type: String,
      required: true,
    },

    soilType: {
      type: String,
      required: true,
    },

    soilData: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      moisture: { type: Number, required: true },
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
    },

    recommendedFertilizers: [
      {
        fertilizer: { type: String, required: true },
        confidence: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model(
  "FertilizerRecommendation",
  fertilizerRecommendationSchema,
);
