import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["farmer", "researcher", "learner", "visitor", "admin"],
      default: "farmer",
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      district: String,
      province: String,
      latitude: Number,
      longitude: Number,
    },

    farmSize: {
      type: Number,
      default: 0,
    },

    preferredCrops: {
      type: [String],
      default: [],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpiresAt: Date,

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
