import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import {
  predictDisease,
  getDiseaseHistory,
} from "../controllers/disease.controller.js";
import multer from "multer";

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Route for disease prediction
router.post("/predict", protectedRoute, upload.single("file"), predictDisease);
router.get("/history", protectedRoute, getDiseaseHistory);

export default router;
