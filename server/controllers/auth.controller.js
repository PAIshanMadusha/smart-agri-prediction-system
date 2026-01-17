import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateVerificationTokenExpiry } from "../utils/generateVerificationTokenExpiry.js";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";
import { validateEmail } from "../utils/validateEmail.js";
import { ValidatePassword } from "../utils/validatePassword.js";
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../brevo/emails.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { generateResetPasswordTokenExpiry } from "../utils/generateResetPasswordTokenExpiry.js";

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
      lastLogin: Date.now(),
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

// Verify Email Controller
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    // Find user by verification token and check if token is not expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    // If no user found, token is invalid or expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token!",
      });
    }

    // If user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified!",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        ...user._doc,
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

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required!" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format!" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist!",
      });
    }

    // Generate reset password token and expiry
    const resetPasswordToken = generateResetPasswordToken();
    const resetPasswordTokenExpiry = generateResetPasswordTokenExpiry();

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordTokenExpiry;

    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required!" });
    }

    // Validate password strength
    if (!ValidatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number!",
      });
    }

    // Find user by reset password token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    // If no user found, token is invalid or expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token!",
      });
    }

    // Hash new password and update user record
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // Send password reset success email
    await sendPasswordResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required!" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format!" });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in!",
      });
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // Generate JWT and set cookie
    generateJWTandSetCookie(res, user._id);

    // Update last login time
    user.lastLogin = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Check Auth Controller
export const checkAuth = async (req, res) => {
  try {
    // Find user by ID attached to request object by protectedRoute middleware
    const user = await User.findById(req.userId);
    // If user not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        ...user._doc,
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
