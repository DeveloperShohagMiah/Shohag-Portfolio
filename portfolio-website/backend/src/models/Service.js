import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        unique: true,
    },

}, { timestamps: true });


serviceSchema.index({ order: 1 });
serviceSchema.index({ name: 1 });

export default mongoose.model('Service', serviceSchema);