import Project from "../models/Project.js";
import ApiError from "../utils/apierror.js";
import ApiResponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProject = asyncHandler(async (req, res) => {
    const { name, description, image, tags, category, liveLink } = req.body;
    const existing = await Project.findOne({ name });
    if (existing) {
        throw new ApiError(400, 'Project with this name already exists.');
    }

    const project = await Project.create({
        name,
        description,
        image,
        tags,
        category,
        liveLink,
    });

    res.status(201).json(new ApiResponse(201, project, "Project created successfully."));
});

export const getAllProjects = asyncHandler(async (req, res) => {
    const { category, tag, status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Project.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                projects,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit)),
                },
            },
            "Projects fetched successfully."
        )
    );
});

export const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, 'Project not found.');
    }

    res.status(200).json(new ApiResponse(200, project, "Project fetched successfully."));
});

export const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, image, tags, category, liveLink } = req.body;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, 'Project not found.');
    }

    // Check name uniqueness if name is being updated
    if (name && name !== project.name) {
        const existing = await Project.findOne({ name });
        if (existing) {
            throw new ApiError(400, 'Project with this name already exists.');
        }
        project.name = name;
    }

    if (description !== undefined) project.description = description;
    if (image !== undefined) project.image = image;
    if (tags !== undefined) project.tags = tags;
    if (category !== undefined) project.category = category;
    if (liveLink !== undefined) project.liveLink = liveLink;

    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project updated successfully."));
});

export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
        throw new ApiError(404, 'Project not found.');
    }

    res.status(200).json(new ApiResponse(200, project, "Project deleted successfully."));
});

export const updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'in-progress', 'completed', 'archived'];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(
            400,
            `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        );
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, 'Project not found.');
    }

    project.status = status;
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project status updated successfully."));
});