import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route — must be logged in
router.get("/profile", authMiddleware, getProfile);

export default router;