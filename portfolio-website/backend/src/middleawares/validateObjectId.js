import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";

// Validates req.params.id (or a custom param name) is a well-formed MongoDB ObjectId.
// Usage: router.get("/:id", validateObjectId(), getServiceById);
//        router.get("/:projectId", validateObjectId("projectId"), getProjectById);
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