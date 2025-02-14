import express from "express";
import { fetchMessages, sendMessages } from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/messages", authenticate, sendMessages);
router.get("/messages", authenticate, fetchMessages);

export default router;