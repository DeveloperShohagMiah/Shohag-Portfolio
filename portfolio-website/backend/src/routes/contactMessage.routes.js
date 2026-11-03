import { Router } from "express";
import {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessageStatus,
    replyToMessage,
    deleteMessage,
} from "../controllers/contactMessage.controllers.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public — the portfolio's contact form submits here
router.post("/", createMessage);

// Admin only — inbox management
router.get("/", protect, authorize("admin", "moderator"), getAllMessages);
router.get("/:id", protect, authorize("admin", "moderator"), validateObjectId(), getMessageById);
router.patch("/:id/status", protect, authorize("admin", "moderator"), validateObjectId(), updateMessageStatus);
router.patch("/:id/reply", protect, authorize("admin", "moderator"), validateObjectId(), replyToMessage);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteMessage);

export default router;