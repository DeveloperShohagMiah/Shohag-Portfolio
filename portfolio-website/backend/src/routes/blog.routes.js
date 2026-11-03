import { Router } from "express";
import {
    createBlog,
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    togglePublishStatus,
} from "../controllers/blog.controllers.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/published", getPublishedBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin routes — full listing (includes drafts), must come before "/:id" pattern-wise
// but since paths differ ("/", "/published", "/slug/:slug", "/:id") there's no collision.
router.get("/", getAllBlogs);
router.get("/:slug", getBlogById);

router.post("/", protect, authorize("admin", "moderator"), createBlog);
router.put("/:id", protect, authorize("admin", "moderator"), validateObjectId(), updateBlog);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteBlog);
router.patch("/:id/toggle-publish", protect, authorize("admin", "moderator"), validateObjectId(), togglePublishStatus);

export default router;