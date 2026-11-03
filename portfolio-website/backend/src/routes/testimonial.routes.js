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
import { protect, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllTestimonials);
router.get("/active", activeTestimonials);
router.get("/:id", validateObjectId(), getTestimonialById);

// Protected routes — admin/moderator only
router.post("/", protect, authorize("admin", "moderator"), createTestimonial);
router.put("/:id", protect, authorize("admin", "moderator"), validateObjectId(), updateTestimonial);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteTestimonial);
router.patch("/:id/toggle-status", protect, authorize("admin", "moderator"), validateObjectId(), toggleTestimonialStatus);

export default router;