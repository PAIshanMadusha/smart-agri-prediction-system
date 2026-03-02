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

// Update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, farmSize, preferredCrops } = req.body;

    // Find the user by ID
    const user = await User.findById(req.userId);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Update only the fields that are provided in the request body
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (farmSize !== undefined) user.farmSize = farmSize;
    if (preferredCrops) user.preferredCrops = preferredCrops;

    // Save the updated user profile
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
