import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
    {
        headline: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
        },
        image: {
            type: String,
            trim: true,
        },
        experience: {
            type: Number,
            default: 0,
            min: [0, "Experience cannot be negative."],
        },
        totalProjects: {
            type: Number,
            default: 0,
            min: [0, "Total projects cannot be negative."],
        },
        location: {
            type: String,
            trim: true,
        },
        availableForHire: {
            type: Boolean,
            default: true,
        },
        coreStack: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

export default About;