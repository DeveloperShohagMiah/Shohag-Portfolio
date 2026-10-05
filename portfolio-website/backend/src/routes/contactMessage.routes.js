import { Router } from "express";
import {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessageStatus,
    replyToMessage,
    deleteMessage,
} from "../controllers/contactMessage.controllers.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public — the portfolio's contact form submits here
router.post("/", createMessage);

// Admin only — inbox management
router.get("/", authMiddleware, authorize("admin", "moderator"), getAllMessages);
router.get("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), getMessageById);
router.patch("/:id/status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateMessageStatus);
router.patch("/:id/reply", authMiddleware, authorize("admin", "moderator"), validateObjectId(), replyToMessage);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteMessage);

export default router;