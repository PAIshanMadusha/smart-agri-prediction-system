import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import {
  predictFertilizer,
  getFertilizerHistory,
} from "../controllers/fertilizer.controller.js";

const router = express.Router();

// Fertilizer recommendation routes
router.post("/predict", protectedRoute, predictFertilizer);
router.get("/history", protectedRoute, getFertilizerHistory);

export default router;
