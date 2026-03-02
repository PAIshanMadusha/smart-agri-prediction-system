import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import { getWeatherData } from "../controllers/weather.controller.js";

const router = express.Router();

// Get current weather data based on latitude and longitude
router.get("/", protectedRoute, getWeatherData);

export default router;
