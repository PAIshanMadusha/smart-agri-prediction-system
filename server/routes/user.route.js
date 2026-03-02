import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

// User profile routes
router.get("/profile", protectedRoute, getProfile);

export default router;
