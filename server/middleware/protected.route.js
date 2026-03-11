import jwt from "jsonwebtoken";

export const protectedRoute = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  try {
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied - No token provided!",
      });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoding was successful
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Access denied - Invalid token!",
      });
    }
    // Attach user ID to request object for further use
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token!",
    });
  }
};
