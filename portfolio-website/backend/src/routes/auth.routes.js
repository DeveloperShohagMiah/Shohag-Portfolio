import { Router } from "express";
import { authMiddleware } from "../middleawares/authMiddleware.js";
import { getProfile, login, logout, register } from "../controllers/auth.controllers.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route — must be logged in
router.get("/profile", authMiddleware, getProfile);

export default router;