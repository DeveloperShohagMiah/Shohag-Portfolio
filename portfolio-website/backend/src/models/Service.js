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
    isActive: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true });


serviceSchema.index({ name: 1, order: 1 });

serviceSchema.statics.findActiveServices = function () {
    return this.find({ isActive: true }).sort({ order: 1 });
}


const Service = mongoose.model('Service', serviceSchema);
export default Service;