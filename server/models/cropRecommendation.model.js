import mongoose from "mongoose";

// Crop Recommendation schema
const cropRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    soilData: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      ph: { type: Number, required: true },
    },

    weatherData: {
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      rainfall: { type: Number, required: true },
    },

    recommendedCrops: [
      {
        crop: { type: String, required: true },
        confidence: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("CropRecommendation", cropRecommendationSchema);
