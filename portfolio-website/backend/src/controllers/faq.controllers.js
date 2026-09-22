import mongoose from "mongoose";
import Faq from "../models/Faq.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiresponse.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid FAQ ID.");
    }
};

export const createFaq = asyncHandler(async (req, res) => {
    const { question, answer, order } = req.body;

    if (!question || !answer) {
        throw new ApiError(400, "Question and answer are required.");
    }

    try {
        const faq = await Faq.create({
            question: question.trim(),
            answer: answer.trim(),
            order,
        });

        res.status(201).json(new ApiResponse(201, faq, "FAQ created successfully."));
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "This question already exists.");
        }
        throw err;
    }
});

export const getAllFaqs = asyncHandler(async (req, res) => {
    const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, faqs, faqs.length ? "FAQs fetched successfully." : "No FAQs found.")
    );
});

export const activeFaqs = asyncHandler(async (req, res) => {
    const faqs = await Faq.findActiveFaqs();

    res.status(200).json(
        new ApiResponse(200, faqs, faqs.length ? "Active FAQs fetched successfully." : "No active FAQs found.")
    );
});

export const getFaqById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findById(id);
    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    res.status(200).json(new ApiResponse(200, faq, "FAQ fetched successfully."));
});

export const updateFaq = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { question, answer, order } = req.body;

    const faq = await Faq.findById(id);
    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    if (question !== undefined) faq.question = question.trim();
    if (answer !== undefined) faq.answer = answer.trim();
    if (order !== undefined) faq.order = order;

    try {
        await faq.save();
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "This question already exists.");
        }
        throw err;
    }

    res.status(200).json(new ApiResponse(200, faq, "FAQ updated successfully."));
});

export const deleteFaq = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "FAQ deleted successfully."));
});

export const toggleFaqStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findById(id);
    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    faq.isActive = !faq.isActive;
    await faq.save();

    res.status(200).json(
        new ApiResponse(200, faq, `FAQ ${faq.isActive ? "activated" : "deactivated"} successfully.`)
    );
});