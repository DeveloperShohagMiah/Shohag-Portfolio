import mongoose from "mongoose";
import Skills from "../models/Skills.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid skill ID.");
    }
};

export const createSkill = asyncHandler(async (req, res) => {
    const { name, shortDescription, icon, tags, order } = req.body;

    if (!name || !shortDescription || !icon) {
        throw new ApiError(400, "Name, shortDescription and icon are required.");
    }

    // Auto-assign order if the client didn't provide one:
    // put the new skill after the current highest order.
    let finalOrder = order;
    if (finalOrder === undefined) {
        const last = await Skills.findOne().sort({ order: -1 });
        finalOrder = last ? last.order + 1 : 1;
    }

    try {
        const skill = await Skills.create({
            name: name.trim(),
            shortDescription,
            icon,
            tags,
            order: finalOrder,
        });

        res.status(201).json(new ApiResponse(201, skill, "Skill created successfully."));
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "field";
            throw new ApiError(409, `A skill with this ${field} already exists.`);
        }
        throw err;
    }
});

export const getAllSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.findActiveSkills();
    res.status(200).json(
        new ApiResponse(200, skills, skills.length ? "Active skills fetched successfully." : "No active skills found.")
    );
});

export const getSkillById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const skill = await Skills.findById(id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    res.status(200).json(new ApiResponse(200, skill, "Skill fetched successfully."));
});

export const updateSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const { name, shortDescription, icon, tags, order } = req.body;

    const skill = await Skills.findById(id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }

    if (name !== undefined) skill.name = name.trim();
    if (shortDescription !== undefined) skill.shortDescription = shortDescription;
    if (icon !== undefined) skill.icon = icon;
    if (tags !== undefined) skill.tags = tags;
    if (order !== undefined) skill.order = order;

    try {
        await skill.save();
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "field";
            throw new ApiError(409, `A skill with this ${field} already exists.`);
        }
        throw err;
    }

    res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully."));
});

export const deleteSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const skill = await Skills.findByIdAndDelete(id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    res.status(200).json(new ApiResponse(200, null, "Skill deleted successfully."));
});

export const toggleSkillStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateObjectId(id);

    const skill = await Skills.findById(id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    skill.isActive = !skill.isActive;
    await skill.save();
    res.status(200).json(
        new ApiResponse(200, skill, `Skill ${skill.isActive ? "activated" : "deactivated"} successfully.`)
    );
});