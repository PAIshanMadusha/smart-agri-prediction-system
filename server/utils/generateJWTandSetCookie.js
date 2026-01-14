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
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
