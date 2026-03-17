import dotenv from "dotenv";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

import jwt from "jsonwebtoken";

export const generateJWTandSetCookie = (res, userId) => {
  // Generate JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true, // Accessible only by web server
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // CSRF protection for cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
