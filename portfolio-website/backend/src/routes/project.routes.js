import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    updateStatus,
} from "../controllers/projects.controllers.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllProjects);
router.get("/:id", validateObjectId(), getProjectById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, authorize("admin", "moderator"), createProject);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateProject);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteProject);
router.patch("/:id/status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateStatus);

export default router;