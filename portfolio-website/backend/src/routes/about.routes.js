import { Router } from "express";
import { authMiddleware } from "../middleawares/authMiddleware.js";
import { getAbout, updateAbout } from "../controllers/about.controllers.js"
const router = Router();

// Public — anyone visiting the portfolio can read the About section
router.get("/", authMiddleware, getAbout);

// Protected — only admin can update the singleton About document
router.put("/", authMiddleware, updateAbout);

export default router;