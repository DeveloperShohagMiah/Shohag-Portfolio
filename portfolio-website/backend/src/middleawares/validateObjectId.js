import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";


const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const value = req.params[paramName];
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(400, `Invalid ${paramName}.`);
        }
        next();
    };
};

export default validateObjectId;