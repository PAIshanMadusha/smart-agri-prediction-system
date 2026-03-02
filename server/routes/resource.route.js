import express from "express";
import { getResources } from "../controllers/resource.controller.js";

const router = express.Router();

// Routes for resources
router.get("/", getResources);

export default router;
