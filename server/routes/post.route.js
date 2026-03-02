import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { protectedRoute } from "../middleware/protected.route.js";

const router = express.Router();

// Routes for posts
router.post("/create", protectedRoute, createPost);

export default router;
