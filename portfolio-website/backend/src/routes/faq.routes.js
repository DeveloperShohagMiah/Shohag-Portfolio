import { Router } from "express";
import {
    createFaq,
    getAllFaqs,
    activeFaqs,
    getFaqById,
    updateFaq,
    deleteFaq,
    toggleFaqStatus,
} from "../controllers/faq.controller.js";
import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllFaqs);
router.get("/active", activeFaqs);
router.get("/:id", validateObjectId(), getFaqById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, authorize("admin", "moderator"), createFaq);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateFaq);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteFaq);
router.patch("/:id/toggle-status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), toggleFaqStatus);

export default router;