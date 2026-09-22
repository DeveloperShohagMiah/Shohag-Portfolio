import Service from "../models/Service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createService = asyncHandler(async (req, res) => {
    const { title, description, icon } = req.body;

    if (!title || !description || !icon) {
        throw new ApiError(400, "Title, description and icon are required.");
    }

    if (typeof title !== "string" || typeof description !== "string" || typeof icon !== "string") {
        throw new ApiError(400, "Title, description and icon must be valid strings.");
    }

    try {
        const service = await Service.create({
            title: title.trim(),
            description: description.trim(),
            icon: icon.trim()
        });

        res.status(201).json(new ApiResponse(201, service, "Service created successfully."));
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "A service with this title already exists.");
        }
        throw err;
    }
});


export const getAllServices = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const services = await Service.find()
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await Service.countDocuments();

    res.status(200).json(
        new ApiResponse(200, {
            services,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        }, services.length ? "Services fetched successfully." : "No services found.")
    );
});


export const activeServices = asyncHandler(async (req, res) => {
    const activeServices = await Service.findActiveServices();

    res.status(200).json(
        new ApiResponse(200, activeServices,
            activeServices.length ? "Active services fetched successfully." : "No active services found."
        )
    );
});


export const getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid service ID.");
    }

    const service = await Service.findById(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    res.status(200).json(new ApiResponse(200, service, "Service fetched successfully."));
});


export const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid service ID.");
    }

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Service deleted successfully."));
});


export const toggleServiceStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid service ID.");
    }

    const service = await Service.findById(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json(
        new ApiResponse(200, service, `Service ${service.isActive ? "activated" : "deactivated"} successfully.`)
    );
});

export const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid service ID.");
    }

    const { title, description, icon, order, isActive } = req.body;

    const service = await Service.findById(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            throw new ApiError(400, "Title must be a non-empty string.");
        }
        service.title = title.trim();
    }

    if (description !== undefined) {
        if (typeof description !== "string" || !description.trim()) {
            throw new ApiError(400, "Description must be a non-empty string.");
        }
        service.description = description.trim();
    }

    if (icon !== undefined) {
        if (typeof icon !== "string" || !icon.trim()) {
            throw new ApiError(400, "Icon must be a non-empty string.");
        }
        service.icon = icon.trim();
    }

    if (order !== undefined) {
        if (typeof order !== "number" || isNaN(order)) {
            throw new ApiError(400, "Order must be a valid number.");
        }
        service.order = order;
    }

    if (isActive !== undefined) {
        if (typeof isActive !== "boolean") {
            throw new ApiError(400, "isActive must be a boolean.");
        }
        service.isActive = isActive;
    }

    try {
        await service.save();
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "A service with this title already exists.");
        }
        throw err;
    }

    res.status(200).json(new ApiResponse(200, service, "Service updated successfully."));
});




