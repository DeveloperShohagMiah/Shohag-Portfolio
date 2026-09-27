import Service from "../models/Service.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createService = asyncHandler(async (req, res) => {
    const { title, description, icon, stacks, order } = req.body;

    if (!title || !description || !icon) {
        throw new ApiError(400, "Title, description and icon are required.");
    }

    try {
        const service = await Service.create({
            title: title.trim(),
            description: description.trim(),
            icon: icon.trim(),
            stacks,
            order,
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
    const services = await Service.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, services, services.length ? "Services fetched successfully." : "No services found.")
    );
});

export const activeServices = asyncHandler(async (req, res) => {
    const services = await Service.findActiveServices();

    res.status(200).json(
        new ApiResponse(200, services, services.length ? "Active services fetched successfully." : "No active services found.")
    );
});

export const getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    res.status(200).json(new ApiResponse(200, service, "Service fetched successfully."));
});

export const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, icon, stacks, order, isActive } = req.body;

    const service = await Service.findById(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    if (title !== undefined) service.title = title.trim();
    if (description !== undefined) service.description = description.trim();
    if (icon !== undefined) service.icon = icon.trim();
    if (stacks !== undefined) service.stacks = stacks;
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive;

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

export const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
        throw new ApiError(404, "Service not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Service deleted successfully."));
});

export const toggleServiceStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

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