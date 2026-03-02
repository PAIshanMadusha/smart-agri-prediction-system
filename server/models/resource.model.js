import mongoose from "mongoose";

// Resource Schema
const resourceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Article", "Deep Dive", "Guide", "Tutorial"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    readTime: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Indexes for efficient querying for filtering and sorting
resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ featured: 1 });
resourceSchema.index({ publishedAt: -1 });

export default mongoose.model("Resource", resourceSchema);
