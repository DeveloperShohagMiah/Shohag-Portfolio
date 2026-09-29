import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import About from "../models/About.js";
import ApiResponse from "../utils/apiresponse.js";

export const getAbout = asyncHandler(async (req, res) => {
    let about = await About.findOne();

    // Create singleton document if it doesn't exist
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

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                about,
                "About section fetched successfully."
            )
        );
});

export const updateAbout = asyncHandler(async (req, res) => {
    const {
        headline,
        bio,
        image,
        experience,
        totalProjects,
        location,
        availableForHire,
        coreStack,
    } = req.body;

    if (!headline?.trim()) {
        throw new ApiError(400, "Headline is required.");
    }

    if (!bio?.trim()) {
        throw new ApiError(400, "Bio is required.");
    }

    const about = await About.findOne();

    if (!about) {
        throw new ApiError(404, "About section not found.");
    }

    about.headline = headline.trim();
    about.bio = bio.trim();
    about.image = image?.trim() || "";
    about.experience = Number(experience);
    about.totalProjects = Number(totalProjects);
    about.location = location?.trim() || "";
    about.availableForHire = Boolean(availableForHire);
    about.coreStack = Array.isArray(coreStack) ? coreStack : [];

    await about.save();

    res.status(200).json(
        new ApiResponse(
            200,
            about,
            "About section updated successfully."
        )
    );
});