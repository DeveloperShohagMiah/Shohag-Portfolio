import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
    {
        headline: {
            type: String,
            required: [true, "Headline is required!"],
            trim: true,
            maxlength: [120, "Headline must be 120 characters or fewer!"],
        },
        description: {
            type: String,
            required: [true, "About description is required!"],
            trim: true,
            minlength: [20, "At least 20 characters are required!"],
            maxlength: [1500, "Description must be 1500 characters or fewer!"],
        },
        yearsOfExperience: {
            type: Number,
            min: [0, "Experience cannot be negative."],
            default: 0,
        },
        completedProjects: {
            type: Number,
            min: [0, "Completed projects cannot be negative."],
            default: 0,
        },
        stacks: {
            type: [{ type: String, trim: true, maxlength: 40 }],
            validate: {
                validator: (s) => Array.isArray(s) && s.length > 0,
                message: "At least one stack is required!",
            },
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Renamed to avoid confusion with the `isAvailable` field
aboutSchema.statics.findAvailable = function () {
    return this.find({ isAvailable: true });
};

const About = mongoose.model("About", aboutSchema);

export default About;