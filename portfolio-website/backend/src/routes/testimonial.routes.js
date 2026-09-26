import { Router } from "express";
import {
    createTestimonial,
    getAllTestimonials,
    activeTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialStatus,
} from "../controllers/testimonial.controller.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllTestimonials);
router.get("/active", activeTestimonials);
router.get("/:id", validateObjectId(), getTestimonialById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, authorize("admin", "moderator"), createTestimonial);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateTestimonial);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteTestimonial);
router.patch("/:id/toggle-status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), toggleTestimonialStatus);

export default router;