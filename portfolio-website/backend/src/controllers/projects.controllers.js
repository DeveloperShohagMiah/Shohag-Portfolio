import mongoose from "mongoose";
import Project from "../models/Project.js";
import ApiError from "../utils/apierror.js";
import ApiResponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID.");
    }
};

export const createProject = asyncHandler(async (req, res) => {
    const { name, description, image, tags, category, liveLink } = req.body;

    if (!name || !description || !image || !category) {
        throw new ApiError(400, "Name, description, image and category are required.");
    }

    try {
        const project = await Project.create({
            name: name.trim(),
            description,
            image,
            tags,
            category,
            liveLink,
        });

        res.status(201).json(new ApiResponse(201, project, "Project created successfully."));
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "Project with this name already exists.");
        }
        throw err;
    }
});

export const getAllProjects = asyncHandler(async (req, res) => {
    const { category, tag, status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10)); // hard cap to avoid abuse
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Project.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                projects,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum),
                },
            },
            projects.length ? "Projects fetched successfully." : "No projects found."
        )
    );
});

export const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    res.status(200).json(new ApiResponse(200, project, "Project fetched successfully."));
});

export const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { name, description, image, tags, category, liveLink } = req.body;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (image !== undefined) project.image = image;
    if (tags !== undefined) project.tags = tags;
    if (category !== undefined) project.category = category;
    if (liveLink !== undefined) project.liveLink = liveLink;

    try {
        await project.save();
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "Project with this name already exists.");
        }
        throw err;
    }

    res.status(200).json(new ApiResponse(200, project, "Project updated successfully."));
});

export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Project deleted successfully."));
});

export const updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { status } = req.body;

    const validStatuses = ["draft", "in-progress", "completed", "archived"];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(
            400,
            `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    project.status = status;
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project status updated successfully."));
});