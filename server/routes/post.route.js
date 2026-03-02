import express from "express";
import { protectedRoute } from "../middleware/protected.route.js";
import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} from "../controllers/post.controller.js";

const router = express.Router();

// Routes for posts
router.post("/", protectedRoute, createPost);
router.get("/", protectedRoute, getPosts);
router.put("/:id/like", protectedRoute, toggleLike);
router.post("/:id/comment", protectedRoute, addComment);

export default router;
