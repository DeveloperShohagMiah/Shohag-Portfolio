import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";

const COOKIE_NAME = "token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 60 * 60 * 1000,
    path: "/",
};

const generateAuthToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide all required fields.");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        res.status(201).json(
            new ApiResponse(201, {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }, "User registered successfully.")
        );
    } catch (err) {
        if (err.code === 11000) {
            throw new ApiError(409, "User with this email already exists.");
        }
        throw err;
    }
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide both email and password.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const authToken = generateAuthToken(user);
    res.cookie(COOKIE_NAME, authToken, cookieOptions);

    // token আর response body তে পাঠানো হচ্ছে না -- শুধু httpOnly cookie তেই থাকছে
    res.status(200).json(
        new ApiResponse(200, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, "Logged in successfully.")
    );
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully."));
});