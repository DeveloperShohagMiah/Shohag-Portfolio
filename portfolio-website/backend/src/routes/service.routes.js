import { Router } from "express";
import {
    createService,
    getAllServices,
    activeServices,
    getServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
} from "../controllers/service.controller.js";
import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes — anyone can view services
router.get("/", getAllServices);
router.get("/active", activeServices);
router.get("/:id", validateObjectId(), getServiceById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, authorize("admin", "moderator"), createService);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateService);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteService);
router.patch("/:id/toggle-status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), toggleServiceStatus);

export default router;