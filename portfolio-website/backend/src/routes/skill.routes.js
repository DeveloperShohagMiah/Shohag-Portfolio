import { Router } from "express";


import {
    createSkill,
    getAllSkills,
    getActiveSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
    toggleSkillStatus,
} from "../controllers/skills.controllers.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public — only active skills. Must be declared before "/:id"
router.get("/active", getActiveSkills);

// Admin — full list including hidden skills
router.get("/", getAllSkills);
router.get("/:id", validateObjectId(), getSkillById);

router.post("/", authMiddleware, authorize("admin", "moderator"), createSkill);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateSkill);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteSkill);
router.patch("/:id/toggle-status", authMiddleware, authorize("admin", "moderator"), validateObjectId(), toggleSkillStatus);

export default router;