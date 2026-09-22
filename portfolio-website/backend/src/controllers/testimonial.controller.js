import mongoose from "mongoose";
import Testimonial from "../models/Testimonial.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid testimonial ID.");
    }
};

export const createTestimonial = asyncHandler(async (req, res) => {
    const { name, role, company, message, avatar, rating, order } = req.body;

    if (!name || !message) {
        throw new ApiError(400, "Name and message are required.");
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    const testimonial = await Testimonial.create({
        name: name.trim(),
        role,
        company,
        message: message.trim(),
        avatar,
        rating,
        order,
    });

    res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created successfully."));
});

export const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, testimonials, testimonials.length ? "Testimonials fetched successfully." : "No testimonials found.")
    );
});

export const activeTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.findActiveTestimonials();

    res.status(200).json(
        new ApiResponse(200, testimonials, testimonials.length ? "Active testimonials fetched successfully." : "No active testimonials found.")
    );
});

export const getTestimonialById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found.");
    }

    res.status(200).json(new ApiResponse(200, testimonial, "Testimonial fetched successfully."));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { name, role, company, message, avatar, rating, order } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found.");
    }

    if (name !== undefined) testimonial.name = name.trim();
    if (role !== undefined) testimonial.role = role;
    if (company !== undefined) testimonial.company = company;
    if (message !== undefined) testimonial.message = message.trim();
    if (avatar !== undefined) testimonial.avatar = avatar;
    if (rating !== undefined) testimonial.rating = rating;
    if (order !== undefined) testimonial.order = order;

    await testimonial.save();

    res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated successfully."));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Testimonial deleted successfully."));
});

export const toggleTestimonialStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found.");
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json(
        new ApiResponse(200, testimonial, `Testimonial ${testimonial.isActive ? "activated" : "deactivated"} successfully.`)
    );
});