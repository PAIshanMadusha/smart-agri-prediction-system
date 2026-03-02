import mongoose from "mongoose";

// ContactMessage model to store messages sent through the contact form
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      enum: [
        "general",
        "support",
        "crop",
        "disease",
        "fertilizer",
        "collab",
        "feedback",
        "bug",
      ],
      default: "general",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      minlength: 20,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ContactMessage", contactMessageSchema);
