import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import About from "../models/About.js";

export const getAbout = asyncHandler(async (req, res) => {
    // Singleton: there is only ever one About document, so no filter/id needed.
    let about = await About.findOne();

    // Auto-create an empty singleton on first load instead of 404-ing —
    // the admin panel needs *something* to populate the form with.
    if (!about) {
        about = await About.create({
            headline: "",
            bio: "",
            image: "",
            experience: 0,
            totalProjects: 0,
            location: "",
            availableForHire: true,
            coreStack: [],
        });
    }

    res.status(200).json(new ApiResponse(200, about, "About section fetched successfully."));
});

export const updateAbout = asyncHandler(async (req, res) => {
    const { headline, bio, image, experience, totalProjects, location, availableForHire, coreStack } = req.body;

    if (!headline || !bio) {
        throw new ApiError(400, "Headline and bio are required.");
    }

    const updateData = {
        headline,
        bio,
        image,
        experience,
        totalProjects,
        location,
        availableForHire,
        coreStack,
    };

    const about = await About.findByIdAndUpdate(
        {},
        { $set: updateData },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, about, "About section updated successfully."));
}); 