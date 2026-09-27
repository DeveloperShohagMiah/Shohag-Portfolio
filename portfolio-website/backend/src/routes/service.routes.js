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
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";

import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public routes — anyone can view services
router.get("/", getAllServices);
router.get("/active", activeServices);
router.get("/:id", validateObjectId(), getServiceById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, createService);
router.put("/:id", authMiddleware, validateObjectId(), updateService);
router.delete("/:id", authMiddleware, validateObjectId(), deleteService);
router.patch("/:id/toggle-status", authMiddleware, validateObjectId(), toggleServiceStatus);

export default router;