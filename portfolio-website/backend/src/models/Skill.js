import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    icon: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        unique: true,
        sparse: true,
        default: 0,
    },
}, { timestamps: true });

skillSchema.index({ isActive: 1, order: 1 });

skillSchema.statics.findActiveSkills = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
};

const Skills = mongoose.model("Skill", skillSchema);
export default Skills;