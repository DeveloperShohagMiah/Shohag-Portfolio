import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    shortDescription: {
        type: String,
        required: true,
        maxlength: 100,
    },
    icon: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        required: true,
        unique: true,
    },
}, { timestamps: true });

skillSchema.index({ name: 1, order: 1 });


skillSchema.statics.findActiveSkills = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
}

const Skills = mongoose.model("Skill", skillSchema);
export default Skills