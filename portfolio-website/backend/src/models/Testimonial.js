import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long."],
            maxlength: [100, "Name cannot exceed 100 characters."]
        },
        role: {
            type: String,
            trim: true,
            maxlength: [100, "Role cannot exceed 100 characters."]
        },
        company: {
            type: String,
            trim: true,
            maxlength: [100, "Company cannot exceed 100 characters."]
        },
        message: {
            type: String,
            required: [true, "Testimonial message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters long."],
            maxlength: [1000, "Message cannot exceed 1000 characters."]
        },
        avatar: {
            type: String, // image URL
        },
        rating: {
            type: Number,
            min: [1, "Rating must be at least 1."],
            max: [5, "Rating cannot exceed 5."],
            default: 5,
        },
        order: {
            type: Number,
            default: 0,
            min: [0, "Order cannot be negative."]
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

testimonialSchema.index({ isActive: 1, order: 1 });

testimonialSchema.statics.findActiveTestimonials = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
};

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;