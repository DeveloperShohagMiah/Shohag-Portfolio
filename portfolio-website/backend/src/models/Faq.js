import mongoose from "mongoose";

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is mandatory!"],
        trim: true
    },

    answer: {
        type: String,
        required: [true, "Answer is mandatory!"],
        trim: true
    },

    order: {
        type: Number,
    },

    isActive: {
        type: Boolean,
        default: true
    }
})

const Faq = mongoose.model("Faq", faqSchema)

export default Faq