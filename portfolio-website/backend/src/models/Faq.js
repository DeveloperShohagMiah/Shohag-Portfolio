import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is mandatory!"],
            trim: true,
            minlength: [5, "Question must be at least 5 characters long."],
            maxlength: [300, "Question cannot exceed 300 characters."]
        },

        answer: {
            type: String,
            required: [true, "Answer is mandatory!"],
            trim: true,
            minlength: [5, "Answer must be at least 5 characters long."],
            maxlength: [3000, "Answer cannot exceed 3000 characters."]
        },

        order: {
            type: Number,
            default: 0,
            min: [0, "Order cannot be negative."]
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Useful for fetching active FAQs in the correct order
faqSchema.index({ isActive: 1, order: 1 });

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;