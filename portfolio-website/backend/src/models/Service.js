import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true,
        trim: true,
        maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    icon: {
        type: String,
        required: [true, "Icon is required"],
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

serviceSchema.index({ isActive: 1, order: 1 });

serviceSchema.statics.findActiveServices = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
};

const Service = mongoose.model("Service", serviceSchema);
export default Service;