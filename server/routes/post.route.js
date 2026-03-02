import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";

const router = express.Router();

// Routes for posts
router.post("/create", protectedRoute, createPost);
router.get("/all", protectedRoute, getPosts);

export default router;
