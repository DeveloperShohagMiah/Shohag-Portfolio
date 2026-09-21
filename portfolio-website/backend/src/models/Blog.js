import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required!"],
            unique: true,
            trim: true,
            minlength: [5, "Blog title must be at least 5 characters long."],
            maxlength: [200, "Blog title cannot exceed 200 characters."]
        },
        slug: { type: String, unique: true, lowercase: true },

        content: {
            type: String,
            required: [true, "Blog content is required!"],
            trim: true,
            minlength: [20, "Blog content must be at least 20 characters long."]
        },

        image: {
            type: String,
            trim: true
        },


        category: {
            type: String,
            required: [true, "Category is required!"],
            trim: true,
            lowercase: true,
            enum: { values: ["backend", "frontend", "devops", "career"], message: "Invalid category." }
        },

        tags: {
            type: [{ type: String, trim: true, lowercase: true }],
            validate: {
                validator: (v) => Array.isArray(v) && v.length > 0,
                message: "At least one tag is required."
            }
        },


        isActive: {
            type: Boolean,
            default: true
        },

        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes
blogSchema.index({ isActive: 1, createdAt: -1 });
blogSchema.index({ isFeatured: 1, isActive: 1 });
blogSchema.index({ category: 1, isActive: 1 });
blogSchema.index({ tags: 1, isActive: 1 });

// after the schema definition
blogSchema.pre("validate", function () {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
});

// Static method
blogSchema.statics.findActiveBlogs = function () {
    return this.find({ isActive: true }).sort({ createdAt: -1 });
};

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;