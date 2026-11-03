import { Router } from "express";
import {
    createFaq,
    getAllFaqs,
    activeFaqs,
    getFaqById,
    updateFaq,
    deleteFaq,
    toggleFaqStatus,
} from "../controllers/faq.controllers.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllFaqs);
router.get("/active", activeFaqs);
router.get("/:id", validateObjectId(), getFaqById);

// Protected routes — admin/moderator only
router.post("/", protect, authorize("admin", "moderator"), createFaq);
router.put("/:id", protect, authorize("admin", "moderator"), validateObjectId(), updateFaq);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteFaq);
router.patch("/:id/toggle-status", protect, authorize("admin", "moderator"), validateObjectId(), toggleFaqStatus);

export default router;