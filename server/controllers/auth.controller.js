import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateVerificationTokenExpiry } from "../utils/generateVerificationTokenExpiry.js";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";

// Register Controller
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate verification token and expiry
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = generateVerificationTokenExpiry();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: verificationTokenExpiry,
    });

    await newUser.save();

    // Generate JWT and set cookie
    generateJWTandSetCookie(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      newUser: {
        ...newUser._doc,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  res.send("Login routes");
};

export const logout = async (req, res) => {
  res.send("Logout routes");
};
