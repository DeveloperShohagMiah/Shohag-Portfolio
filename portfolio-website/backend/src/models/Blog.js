import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Blog title is required!"]

    },
    content: {
        type: String,
        requried: [true, "Blog content is required!"]
    },
    image: {
        type: String,

    },
    tags: {
        type: [String],
        required: [true, "Tags must be included"],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: " At least one tag is required"
        }
    },

    category: {
        type: String,
        requried: [true, "Category is required!"]
    },
    isActive: {
        type: Boolean,
        default: true,

    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


blogSchema.index({ title: 1, category: 1, tags: 1 })

blogSchema.statics.findActiveBlogs = function () {
    return this.find({ isActive: true })
}

const Blog = blogSchema.model("Blog", blogSchema)

export default Blog