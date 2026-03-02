import express from "express";
import {
  getResources,
  getResourceBySlug,
} from "../controllers/resource.controller.js";

const router = express.Router();

// Routes for resources
router.get("/", getResources);
router.get("/:slug", getResourceBySlug);

export default router;
