import mongoose from 'mongoose'

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    tags: {
        type: [String],
        required: [true, 'Tags must be included'],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'At least one tag is required'
        }
    },
    category: {
        type: String,
        required: [true, 'Category should be added']
    },
    liveLink: {
        type: String,
        validate: {
            validator: (v) => !v || /^https?:\/\/.+/.test(v),
            message: 'Live link must be a valid URL'
        }
    },
    order: {
        type: Number,
        unique: true,
        sparse: true   // allows multiple docs without an `order`
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
})

// Optional: index for common queries
projectSchema.index({ isActive: 1, order: 1 })

projectSchema.statics.findActiveProjects = function () {
    return this.find({ isActive: true }).sort({ order: 1 })
}

projectSchema.statics.findFeaturedProjects = function () {
    return this.find({ isActive: true, isFeatured: true }).sort({ order: 1 })
}

const Project = mongoose.model('Project', projectSchema)

export default Project