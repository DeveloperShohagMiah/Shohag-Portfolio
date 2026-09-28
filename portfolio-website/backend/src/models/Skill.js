import mongoose from "mongoose";

export const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps & Cloud", "Tools"];

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        required: [true, "Short description is required"],
        trim: true,
        maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: SKILL_CATEGORIES,
            message: "{VALUE} is not a valid category",
        },
    },
    icon: {
        type: String,
        required: [true, "Icon is required"],
    },
    proficiency: {
        type: Number,
        min: [0, "Proficiency cannot be below 0"],
        max: [100, "Proficiency cannot exceed 100"],
        default: 90,
    },
    tags: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // No default here on purpose: unique + default would make every new skill collide.
    // The controller assigns the next order automatically.
    order: {
        type: Number,
        unique: true,
        sparse: true,
    },
}, { timestamps: true });

skillSchema.index({ isActive: 1, order: 1 });
skillSchema.index({ category: 1 });

skillSchema.statics.findActiveSkills = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
};

const Skills = mongoose.model("Skill", skillSchema);
export default Skills;