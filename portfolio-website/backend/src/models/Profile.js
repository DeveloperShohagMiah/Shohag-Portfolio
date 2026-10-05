import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email address"],
        },
        role: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        timezone: {
            type: String,
            trim: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        availabilityNotice: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
        },
        socialLinks: {
            github: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            twitter: { type: String, trim: true },
            website: { type: String, trim: true },
            instagram: { type: String, trim: true },
            dribbble: { type: String, trim: true },
            youtube: { type: String, trim: true },
            discord: { type: String, trim: true },
        },
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;