import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid message ID.");
    }
};

// Public — the portfolio's contact form posts here, no auth required
export const createMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        throw new ApiError(400, "Name, email, subject and message are all required.");
    }

    const contactMessage = await ContactMessage.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
    });

    res.status(201).json(new ApiResponse(201, contactMessage, "Message sent successfully."));
});

// Admin — full inbox
export const getAllMessages = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, messages, messages.length ? "Messages fetched successfully." : "No messages found.")
    );
});

export const getMessageById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const message = await ContactMessage.findById(id);
    if (!message) throw new ApiError(404, "Message not found.");

    res.status(200).json(new ApiResponse(200, message, "Message fetched successfully."));
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { status } = req.body;
    const validStatuses = ["unread", "read", "replied"];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const message = await ContactMessage.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
    );
    if (!message) throw new ApiError(404, "Message not found.");

    res.status(200).json(new ApiResponse(200, message, "Message status updated successfully."));
});

// Stores the admin's reply text and marks the message as replied.
// Note: this does NOT send an actual email — it just records what was sent,
// since outbound email delivery needs a mail provider (e.g. Resend, SendGrid)
// wired up separately. Hook that in here if/when you add one.
export const replyToMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { reply } = req.body;
    if (!reply || !reply.trim()) {
        throw new ApiError(400, "Reply text is required.");
    }

    const message = await ContactMessage.findByIdAndUpdate(
        id,
        { $set: { reply: reply.trim(), status: "replied", repliedAt: new Date() } },
        { new: true }
    );
    if (!message) throw new ApiError(404, "Message not found.");

    res.status(200).json(new ApiResponse(200, message, "Reply saved successfully."));
});

export const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) throw new ApiError(404, "Message not found.");

    res.status(200).json(new ApiResponse(200, null, "Message deleted successfully."));
});