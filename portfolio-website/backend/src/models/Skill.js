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
    tag: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        unique: true,
    },
}, { timestamps: true });

skillSchema.index({ order: 1 });
skillSchema.index({ name: 1 });

export default mongoose.model("Skill", skillSchema);