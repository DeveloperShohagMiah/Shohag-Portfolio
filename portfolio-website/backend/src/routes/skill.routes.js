import { Router } from "express";
import {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
    toggleSkillStatus,
} from "../controllers/skills.controllers.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/", getAllSkills);
router.get("/:id", validateObjectId(), getSkillById);

// Protected routes — admin/moderator only
router.post("/", authMiddleware, authorize("admin", "moderator"), createSkill);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateSkill);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteSkill);
router.patch("/:id/toggle-status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), toggleSkillStatus);

export default router;