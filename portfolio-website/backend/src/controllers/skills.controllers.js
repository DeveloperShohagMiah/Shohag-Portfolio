import Skills from "../models/Skill.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const duplicateMessage = (err) => {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return `A skill with this ${field} already exists.`;
};

export const createSkill = asyncHandler(async (req, res) => {
    const { name, shortDescription, category, icon, proficiency, tags, order } = req.body;

    if (!name || !shortDescription || !category || !icon) {
        throw new ApiError(400, "Name, shortDescription, category and icon are required.");
    }

    // Auto-assign the next order when the client doesn't send one
    let finalOrder = order;
    if (finalOrder === undefined) {
        const last = await Skills.findOne({ order: { $exists: true } }).sort({ order: -1 });
        finalOrder = last ? last.order + 1 : 1;
    }

    try {
        const skill = await Skills.create({
            name: name.trim(),
            shortDescription: shortDescription.trim(),
            category,
            icon,
            proficiency,
            tags,
            order: finalOrder,
        });

        res.status(201).json(new ApiResponse(201, skill, "Skill created successfully."));
    } catch (err) {
        if (err.code === 11000) throw new ApiError(409, duplicateMessage(err));
        throw err;
    }
});

// Admin: every skill, including hidden ones (otherwise a hidden skill could never be re-shown)
export const getAllSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, skills, skills.length ? "Skills fetched successfully." : "No skills found.")
    );
});

// Public: only skills marked active
export const getActiveSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.findActiveSkills();

    res.status(200).json(
        new ApiResponse(200, skills, skills.length ? "Active skills fetched successfully." : "No active skills found.")
    );
});

export const getSkillById = asyncHandler(async (req, res) => {
    const skill = await Skills.findById(req.params.id);
    if (!skill) throw new ApiError(404, "Skill not found.");

    res.status(200).json(new ApiResponse(200, skill, "Skill fetched successfully."));
});

export const updateSkill = asyncHandler(async (req, res) => {
    const { name, shortDescription, category, icon, proficiency, tags, order, isActive } = req.body;

    const skill = await Skills.findById(req.params.id);
    if (!skill) throw new ApiError(404, "Skill not found.");

    if (name !== undefined) skill.name = name.trim();
    if (shortDescription !== undefined) skill.shortDescription = shortDescription.trim();
    if (category !== undefined) skill.category = category;
    if (icon !== undefined) skill.icon = icon;
    if (proficiency !== undefined) skill.proficiency = proficiency;
    if (tags !== undefined) skill.tags = tags;
    if (order !== undefined) skill.order = order;
    if (isActive !== undefined) skill.isActive = isActive;

    try {
        await skill.save();
    } catch (err) {
        if (err.code === 11000) throw new ApiError(409, duplicateMessage(err));
        throw err;
    }

    res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully."));
});

export const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skills.findByIdAndDelete(req.params.id);
    if (!skill) throw new ApiError(404, "Skill not found.");

    res.status(200).json(new ApiResponse(200, null, "Skill deleted successfully."));
});

export const toggleSkillStatus = asyncHandler(async (req, res) => {
    const skill = await Skills.findById(req.params.id);
    if (!skill) throw new ApiError(404, "Skill not found.");

    skill.isActive = !skill.isActive;
    await skill.save();

    res.status(200).json(
        new ApiResponse(200, skill, `Skill ${skill.isActive ? "activated" : "deactivated"} successfully.`)
    );
});