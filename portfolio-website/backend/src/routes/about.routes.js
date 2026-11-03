import { Router } from "express";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { getAbout, updateAbout } from "../controllers/about.controllers.js"
const router = Router();

// Public — anyone visiting the portfolio can read the About section
router.get("/", getAbout);

// Protected — only admin can update the singleton About document
router.put("/", protect, authorize("admin"), updateAbout);

export default router;