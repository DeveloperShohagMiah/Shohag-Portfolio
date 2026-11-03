import { Router } from "express";
import {
    createService,
    getAllServices,
    activeServices,
    getServiceById,
    updateService,
    deleteService,
    toggleServiceStatus
} from "../controllers/service.controllers.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes — anyone can view services
router.get("/", getAllServices);
router.get("/active", activeServices);
router.get("/:id", validateObjectId(), getServiceById);

// Protected routes — admin/moderator only
router.post("/", protect, authorize("admin"), createService);
router.put("/:id", protect, authorize("admin"), validateObjectId(), updateService);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteService);
router.patch("/:id/toggle-status", protect, authorize("admin"), validateObjectId(), toggleServiceStatus);

export default router;