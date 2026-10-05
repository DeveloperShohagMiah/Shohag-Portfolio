import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controllers.js";
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";

const router = Router();

// Public — the portfolio's hero/footer/contact sections read this
router.get("/", getProfile);

// Protected — only admin can update
router.put("/", authMiddleware, authorize("admin"), updateProfile);

export default router;