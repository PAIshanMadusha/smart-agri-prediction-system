import express from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protected.route.js";

const router = express.Router();

// Middleware to protect routes
router.get("/check-auth", protectedRoute, checkAuth);

// Auth Routes
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/login", login);
router.post("/logout", logout);

export default router;
