import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateVerificationTokenExpiry } from "../utils/generateVerificationTokenExpiry.js";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";
import { validateEmail } from "../utils/validateEmail.js";
import { ValidatePassword } from "../utils/validatePassword.js";
import { sendVerificationEmail } from "../brevo/emails.js";

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

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format!" });
    }

    // Validate password strength
    if (!ValidatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number!",
      });
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

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);

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
