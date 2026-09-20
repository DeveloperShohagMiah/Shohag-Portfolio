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

        tags: {
            type: [String],
            required: [true, "At least one tag is required."],
            validate: {
                validator: (value) =>
                    Array.isArray(value) && value.length > 0,
                message: "At least one tag is required."
            }
        },

        category: {
            type: String,
            required: [true, "Category is required!"],
            trim: true
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

// Static method
blogSchema.statics.findActiveBlogs = function () {
    return this.find({ isActive: true }).sort({ createdAt: -1 });
};

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;