import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    image: {
        type: String,
    },
    stacks: {
        type: [String],
        default: [],
    },
    githubLink: {
        type: String,
        validate: {
            validator: (v) => !v || /^https?:\/\/.+/.test(v),
            message: "GitHub link must be a valid URL"
        }
    },
    liveLink: {
        type: String,
        validate: {
            validator: (v) => !v || /^https?:\/\/.+/.test(v),
            message: "Live link must be a valid URL"
        }
    },
    category: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ["draft", "in-progress", "completed", "archived"],
            message: "{VALUE} is not a valid status"
        },
        default: "draft"
    },
    order: {
        type: Number,
        default: 1
        // ❌ REMOVED: unique: true, sparse: true
        // Reason: every project defaulted to order: 1,
        // causing E11000 duplicate key errors on the 2nd insert.
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

projectSchema.index({ isActive: 1, order: 1 });
projectSchema.index({ status: 1 });

projectSchema.statics.findActiveProjects = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
};

projectSchema.statics.findFeaturedProjects = function () {
    return this.find({ isActive: true, isFeatured: true }).sort({ order: 1 });
};

const Project = mongoose.model("Project", projectSchema);
export default Project;