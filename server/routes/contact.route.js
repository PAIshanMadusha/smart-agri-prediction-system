import express from "express";
import { createContactMessage } from "../controllers/contact.controller.js";

const router = express.Router();

// Create a new contact message
router.post("/", createContactMessage);

export default router;
