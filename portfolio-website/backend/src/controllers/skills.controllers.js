import Skills from "../models/Skills.js";

export const createSkill = asyncHandler(async (req, res) => {
    const { name, description, icon } = req.body;

    if (!name || !description || !icon) {
        throw new ApiError(400, "Please provide all required fields.");
    }

    const skill = new Skills({ name, description, icon });
    await skill.save();

    res.status(201).json(new ApiResponse(201, skill, "Skill created successfully."));
});

export const getAllSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.findActiveSkills();
    res.status(200).json(new ApiResponse(200, skills, "Active skills fetched successfully."));
})

export const getSkillById = asyncHandler(async (req, res) => {
    const skill = await Skills.findById(req.params.id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    res.status(200).json(new ApiResponse(200, skill, "Skill fetched successfully."));
})

export const updateSkill = asyncHandler(async (req, res) => {
    const { name, description, icon } = req.body;
    const skill = await Skills.findByIdAndUpdate(req.params.id, { name, description, icon }, { new: true, runValidators: true });
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully."));
});

export const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skills.findByIdAndDelete(req.params.id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    res.status(200).json(new ApiResponse(200, null, "Skill deleted successfully."));
});

export const toggleSkillStatus = asyncHandler(async (req, res) => {
    const skill = await Skills.findById(req.params.id);
    if (!skill) {
        throw new ApiError(404, "Skill not found.");
    }
    skill.isActive = !skill.isActive;
    await skill.save();
    res.status(200).json(new ApiResponse(200, skill, `Skill ${skill.isActive ? 'activated' : 'deactivated'} successfully.`));
})