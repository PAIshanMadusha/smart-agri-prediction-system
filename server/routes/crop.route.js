import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import { predictCrop, getCropHistory } from "../controllers/crop.controller.js";

const router = express.Router();

// Crop prediction route
router.post("/predict", protectedRoute, predictCrop);
router.get("/history", protectedRoute, getCropHistory);

export default router;
