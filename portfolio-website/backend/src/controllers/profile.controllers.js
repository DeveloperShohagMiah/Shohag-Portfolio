import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Profile from "../models/Profile.js";

export const getProfile = asyncHandler(async (req, res) => {
    let profile = await Profile.findOne();

    // Auto-create an empty singleton on first load so the admin form always has something to bind to.
    if (!profile) {
        profile = await Profile.create({
            name: "",
            email: "",
            role: "",
            phone: "",
            address: "",
            timezone: "",
            isAvailable: true,
            availabilityNotice: "",
            bio: "",
            avatar: "",
            socialLinks: {},
        });
    }

    res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully."));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        role,
        phone,
        address,
        timezone,
        isAvailable,
        availabilityNotice,
        bio,
        avatar,
        socialLinks,
    } = req.body;

    if (!name || !email || !role) {
        throw new ApiError(400, "Name, email and role are required.");
    }
    const profile = await Profile.findOne();

    if (!profile) {
        throw new ApiError(404, "Profile not found.");
    }

    profile.name = name.trim();
    profile.email = email.trim().toLowerCase();
    profile.role = role.trim();
    profile.phone = phone?.trim() || "";
    profile.address = address?.trim() || "";
    profile.timezone = timezone?.trim() || "";
    profile.isAvailable = isAvailable ?? true;
    profile.availabilityNotice = availabilityNotice?.trim() || "";
    profile.bio = bio?.trim() || "";
    profile.avatar = avatar?.trim() || "";
    profile.socialLinks = {
        github: socialLinks?.github?.trim() || "",
        linkedin: socialLinks?.linkedin?.trim() || "",
        twitter: socialLinks?.twitter?.trim() || "",
        website: socialLinks?.website?.trim() || "",
        instagram: socialLinks?.instagram?.trim() || "",
        dribbble: socialLinks?.dribbble?.trim() || "",
        youtube: socialLinks?.youtube?.trim() || "",
        discord: socialLinks?.discord?.trim() || "",
    };



    await profile.save();

    res.status(200).json(new ApiResponse(200, profile, "Profile updated successfully."));
});