import { Router } from "express";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

// Public — anyone visiting the portfolio can read the About section
router.get("/", getAbout);

// Protected — only admin can update the singleton About document
router.put("/", authMiddleware, authorize("admin"), updateAbout);

export default router;