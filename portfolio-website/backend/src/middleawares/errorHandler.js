
import ApiError from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
    // Default to 500 if nothing set
    let error = { ...err, message: err.message };

    // Mongoose: bad ObjectId
    if (err.name === "CastError") {
        error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
    }

    // Mongoose: duplicate key (e.g. duplicate email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        error = new ApiError(409, `Duplicate value for field: ${field}`);
    }

    // Mongoose: validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        error = new ApiError(400, "Validation failed", messages);
    }

    // JWT: invalid token
    if (err.name === "JsonWebTokenError") {
        error = new ApiError(401, "Invalid token. Please log in again.");
    }

    // JWT: expired token
    if (err.name === "TokenExpiredError") {
        error = new ApiError(401, "Token expired. Please log in again.");
    }

    // Multer: file size limit (if you use it)
    if (err.code === "LIMIT_FILE_SIZE") {
        error = new ApiError(413, "File too large");
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    const response = {
        success: false,
        statusCode,
        message,
        ...(error.errors?.length > 0 && { errors: error.errors }),
        // Only leak stack in development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    // Log 500s (real bugs) — don't log expected operational errors
    if (statusCode >= 500 && !err.isOperational) {
        console.error("💥 Unhandled error:", err);
    }

    res.status(statusCode).json(response);
};

export default errorHandler;