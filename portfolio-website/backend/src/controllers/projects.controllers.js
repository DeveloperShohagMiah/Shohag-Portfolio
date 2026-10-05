import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================================
// HELPER: escape regex special characters
// ==========================================
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ==========================================
// HELPER: get next available order
// ==========================================
const getNextOrder = async () => {
    const last = await Project.findOne().sort({ order: -1 }).lean();
    return (last?.order || 0) + 1;
};

// ==========================================
// GET ALL PROJECTS
// ==========================================
export const getAllProjects = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        featured,
        active,
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    // Search
    if (search.trim()) {
        filter.$or = [
            { title: { $regex: search.trim(), $options: "i" } },
            { description: { $regex: search.trim(), $options: "i" } },
            { stacks: { $regex: search.trim(), $options: "i" } },
        ];
    }

    // Featured filter
    if (featured !== undefined) {
        filter.isFeatured = featured === "true";
    }

    // Active filter
    if (active !== undefined) {
        filter.isActive = active === "true";
    }

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean(),

        Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: {
            projects,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            },
        },
    });
});

// ==========================================
// GET ACTIVE PROJECTS
// ==========================================
export const getActiveProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        message: "Active projects fetched successfully",
        data: projects,
    });
});

// ==========================================
// GET SINGLE PROJECT
// ==========================================
export const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id).lean();

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: project,
    });
});

// ==========================================
// CREATE PROJECT
// ==========================================
export const createProject = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        image,
        stacks,
        githubLink,
        liveLink,
        category,
        status,
        order,
        isFeatured,
        isActive,
    } = req.body;

    // ---------- Validation ----------
    if (!title?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project title is required",
        });
    }

    if (!description?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project description is required",
        });
    }

    if (!image?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project image is required",
        });
    }

    if (!Array.isArray(stacks) || stacks.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one technology stack is required",
        });
    }

    const cleanTitle = title.trim();

    // ---------- Duplicate title check (case-insensitive) ----------
    const existingProject = await Project.findOne({
        title: { $regex: `^${escapeRegex(cleanTitle)}$`, $options: "i" },
    });

    if (existingProject) {
        return res.status(409).json({
            success: false,
            message: "A project with this title already exists",
        });
    }

    // ---------- Auto-assign order if not provided ----------
    let finalOrder = Number(order);
    if (!Number.isInteger(finalOrder) || finalOrder < 1) {
        finalOrder = await getNextOrder();
    }

    // ---------- Create ----------
    try {
        const project = await Project.create({
            title: cleanTitle,
            description: description.trim(),
            image: image.trim(),

            stacks: stacks
                .map((stack) => String(stack).trim())
                .filter(Boolean),

            githubLink: githubLink?.trim() || "",
            liveLink: liveLink?.trim() || "",

            category: category?.trim() || "",

            status:
                typeof status === "string" && status.trim()
                    ? status.trim()
                    : "draft",

            order: finalOrder,

            isFeatured:
                typeof isFeatured === "boolean" ? isFeatured : false,

            isActive:
                typeof isActive === "boolean" ? isActive : true,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project,
        });
    } catch (err) {
        // 👇 FULL ERROR DUMP
        console.error("========= CREATE PROJECT ERROR =========");
        console.error("err.name:", err.name);
        console.error("err.code:", err.code);
        console.error("err.message:", err.message);
        console.error("err.keyPattern:", err.keyPattern);
        console.error("err.keyValue:", err.keyValue);
        console.error("err.errors:", err.errors);
        console.error("full err:", err);
        console.error("========================================");

        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `Duplicate on ${field}: ${JSON.stringify(err.keyValue)}`,
                debug: {
                    field,
                    value: err.keyValue,
                    indexName: err.keyPattern,
                },
            });
        }

        // Send the raw error for debugging
        return res.status(500).json({
            success: false,
            message: err.message || "Server error",
            debug: {
                name: err.name,
                code: err.code,
                errors: err.errors,
            },
        });
    }
});

// ==========================================
// UPDATE PROJECT
// ==========================================
export const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    const {
        title,
        description,
        image,
        stacks,
        githubLink,
        liveLink,
        category,
        status,
        order,
        isFeatured,
        isActive,
    } = req.body;

    // ---------- Title ----------
    if (title !== undefined) {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
            return res.status(400).json({
                success: false,
                message: "Project title cannot be empty",
            });
        }

        // Only check duplicate if title actually changed
        if (cleanTitle.toLowerCase() !== project.title.toLowerCase()) {
            const duplicateProject = await Project.findOne({
                title: { $regex: `^${escapeRegex(cleanTitle)}$`, $options: "i" },
                _id: { $ne: id },
            });

            if (duplicateProject) {
                return res.status(409).json({
                    success: false,
                    message: "A project with this title already exists",
                });
            }
        }

        project.title = cleanTitle;
    }

    // ---------- Description ----------
    if (description !== undefined) {
        if (!description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project description cannot be empty",
            });
        }
        project.description = description.trim();
    }

    // ---------- Image ----------
    if (image !== undefined) {
        if (!image.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project image cannot be empty",
            });
        }
        project.image = image.trim();
    }

    // ---------- Stacks ----------
    if (stacks !== undefined) {
        if (!Array.isArray(stacks) || stacks.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one technology stack is required",
            });
        }
        project.stacks = stacks
            .map((stack) => String(stack).trim())
            .filter(Boolean);
    }

    // ---------- Links ----------
    if (githubLink !== undefined) {
        project.githubLink = githubLink?.trim() || "";
    }

    if (liveLink !== undefined) {
        project.liveLink = liveLink?.trim() || "";
    }

    // ---------- Category ----------
    if (category !== undefined) {
        project.category = category?.trim() || "";
    }

    // ---------- Status ----------
    if (status !== undefined) {
        const allowed = ["draft", "in-progress", "completed", "archived"];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${allowed.join(", ")}`,
            });
        }
        project.status = status;
    }

    // ---------- Order ----------
    if (order !== undefined) {
        const parsedOrder = Number(order);
        if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
            return res.status(400).json({
                success: false,
                message: "Order must be a positive integer",
            });
        }
        project.order = parsedOrder;
    }

    // ---------- Booleans ----------
    if (isFeatured !== undefined) {
        project.isFeatured = Boolean(isFeatured);
    }

    if (isActive !== undefined) {
        project.isActive = Boolean(isActive);
    }

    await project.save();

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project,
    });
});

// ==========================================
// DELETE PROJECT
// ==========================================
export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        data: null,
    });
});