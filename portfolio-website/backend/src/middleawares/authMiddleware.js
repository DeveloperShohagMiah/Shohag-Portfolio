import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import ApiError from "../utils/apierror.js";

// Verifies the JWT from the httpOnly cookie and attaches the user to req.user
export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new ApiError(401, "Not authenticated. Please log in.");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired session. Please log in again.");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(401, "User no longer exists.");
    }

    req.user = { id: user._id, role: user.role, email: user.email };
    next();
});

// Restricts access to specific roles. Usage: authorize("admin"), authorize("admin", "moderator")
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Not authenticated.");
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission to perform this action.");
        }
        next();
    };
};