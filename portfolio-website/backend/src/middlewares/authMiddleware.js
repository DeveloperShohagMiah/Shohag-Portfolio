import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apierror.js";

const COOKIE_NAME = "token";

/**
 * Protects a route. Reads the JWT from the httpOnly cookie (needs `cookie-parser`
 * registered BEFORE your routes). A Bearer header is accepted as a fallback for
 * tools like Postman.
 *
 *   router.get("/profile", protect, getProfile);
 *   router.post("/projects", protect, authorize("admin"), createProject);
 */
export const protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;
    const token =
        req.cookies?.[COOKIE_NAME] ||
        (header?.startsWith("Bearer ") ? header.split(" ")[1] : null);

    if (!token) {
        throw new ApiError(401, "Not authenticated. Please log in.");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new ApiError(401, "Session expired or invalid. Please log in again.");
    }

    // getProfile reads req.user.id
    req.user = { id: decoded.id, role: decoded.role };
    next();
});

export const authorize = (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new ApiError(403, "You don't have permission to do this."));
        }
        next();
    };
