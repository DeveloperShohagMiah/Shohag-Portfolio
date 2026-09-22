import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import About from "../models/About.js";

export const getAbout = asyncHandler(async (req, res) => {
    // Singleton: there is only ever one About document, so no filter/id needed.
    const about = await About.findOne();

    if (!about) {
        throw new ApiError(404, "About section has not been set up yet.");
    }

    res.status(200).json(new ApiResponse(200, about, "About section fetched successfully."));
});

export const updateAbout = asyncHandler(async (req, res) => {
    const { headline, description, yearsOfExperience, completedProjects, stacks, isAvailable } = req.body;

    if (!headline || !description) {
        throw new ApiError(400, "Headline and description are required.");
    }

    const updateData = {
        headline,
        description,
        yearsOfExperience,
        completedProjects,
        stacks,
        isAvailable,
    };

    const about = await About.findOneAndUpdate(
        {},
        { $set: updateData },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, about, "About section updated successfully."));
});