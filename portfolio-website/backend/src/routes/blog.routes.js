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
import { authMiddleware, authorize } from "../middleawares/authMiddleware.js";
import validateObjectId from "../middleawares/validateObjectId.js";

const router = Router();

// Public routes
router.get("/published", getPublishedBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin routes — full listing (includes drafts), must come before "/:id" pattern-wise
// but since paths differ ("/", "/published", "/slug/:slug", "/:id") there's no collision.
router.get("/", authMiddleware, authorize("admin", "moderator"), getAllBlogs);
router.get("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), getBlogById);

router.post("/", authMiddleware, authorize("admin", "moderator"), createBlog);
router.put("/:id", authMiddleware, authorize("admin", "moderator"), validateObjectId(), updateBlog);
router.delete("/:id", authMiddleware, authorize("admin"), validateObjectId(), deleteBlog);
router.patch("/:id/toggle-publish", authMiddleware, authorize("admin", "moderator"), validateObjectId(), togglePublishStatus);

export default router;