import { User } from "../models/user.model.js";

// Get user profile details
export const getProfile = async (req, res) => {
  try {
    // Find the user by ID without the password field
    const user = await User.findById(req.userId).select("-password");

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
