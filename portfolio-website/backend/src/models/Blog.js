import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters long."],
            maxlength: [150, "Title cannot exceed 150 characters."],
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        excerpt: {
            type: String,
            trim: true,
            maxlength: [300, "Excerpt cannot exceed 300 characters."],
        },

        content: {
            type: String,
            required: [true, "Content is required"],
        },

        coverImage: {
            type: String,
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        category: {
            type: String,
            trim: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        publishedAt: {
            type: Date,
        },

        views: {
            type: Number,
            default: 0,
            min: 0,
        },

        readTimeMinutes: {
            type: Number,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

/* =========================================================
   INDEXES
========================================================= */

blogSchema.index({
    isPublished: 1,
    publishedAt: -1,
});

blogSchema.index({
    category: 1,
});

/* =========================================================
   PRE VALIDATE
   Auto-generate slug from title
========================================================= */

blogSchema.pre("validate", function () {
    if (this.title && (!this.slug || this.isModified("title"))) {
        this.slug = this.title
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
});

/* =========================================================
   PRE SAVE
   Keep publishedAt synchronized with isPublished
========================================================= */

blogSchema.pre("save", function () {
    if (this.isModified("isPublished")) {
        if (this.isPublished && !this.publishedAt) {
            this.publishedAt = new Date();
        }

        if (!this.isPublished) {
            this.publishedAt = undefined;
        }
    }
});

/* =========================================================
   STATIC METHODS
========================================================= */

blogSchema.statics.findPublished = function () {
    return this.find({
        isPublished: true,
    }).sort({
        publishedAt: -1,
    });
};

/* =========================================================
   MODEL
========================================================= */

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;