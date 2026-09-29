import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid blog ID.");
    }
};

export const createBlog = asyncHandler(async (req, res) => {
    const { title, slug, excerpt, content, coverImage, tags, category, isPublished, isFeatured, readTimeMinutes } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required.");
    }

    try {
        const blog = await Blog.create({
            title: title.trim(),
            slug, // pre-validate hook auto-generates this if omitted
            excerpt,
            content,
            coverImage,
            tags,
            category,
            isPublished,
            isFeatured,
            readTimeMinutes,
            author: req.user.id, // set from the authenticated user, never trust client-supplied author
        });

        res.status(201).json(new ApiResponse(201, blog, "Blog created successfully."));
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "A blog with this slug already exists.");
        }
        throw err;
    }
});

// Admin listing — includes drafts, supports search/filter/pagination
export const getAllBlogs = asyncHandler(async (req, res) => {
    const { category, tag, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
        Blog.find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Blog.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            blogs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        }, blogs.length ? "Blogs fetched successfully." : "No blogs found.")
    );
});

// Public listing — only published posts
export const getPublishedBlogs = asyncHandler(async (req, res) => {
    const { category, tag, search, page = 1, limit = 10 } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
        Blog.find(filter)
            .populate("author", "name")
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Blog.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            blogs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        }, blogs.length ? "Blogs fetched successfully." : "No blogs found.")
    );
});

export const getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const blog = await Blog.findById(id).populate("author", "name email");
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }

    res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully."));
});

// Public — fetch by slug, and increment view count
export const getBlogBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
        { slug, isPublished: true },
        { $inc: { views: 1 } },
        { new: true }
    ).populate("author", "name");

    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }

    res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully."));
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { title, slug, excerpt, content, coverImage, tags, category, isPublished, readTimeMinutes } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }

    if (title !== undefined) blog.title = title.trim();
    if (slug !== undefined) blog.slug = slug.trim().toLowerCase();
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (tags !== undefined) blog.tags = tags;
    if (category !== undefined) blog.category = category;
    if (isPublished !== undefined) blog.isPublished = isPublished;
    if (readTimeMinutes !== undefined) blog.readTimeMinutes = readTimeMinutes;

    try {
        await blog.save();
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "A blog with this slug already exists.");
        }
        throw err;
    }

    res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully."));
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully."));
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json(
        new ApiResponse(200, blog, `Blog ${blog.isPublished ? "published" : "unpublished"} successfully.`)
    );
});