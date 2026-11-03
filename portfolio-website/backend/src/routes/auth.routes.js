import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route — must be logged in
router.get("/profile", protect, getProfile);

export default router;