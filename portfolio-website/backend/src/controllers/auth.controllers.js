import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const token = "token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 60 * 60 * 1000,
    path: "/",
};

const generateAuthToken = (user) => {
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

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(400, "User already exists.");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json(new ApiResponse(201, { id: newUser._id, name: newUser.name, email: newUser.email }, "User registered successfully."));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide both email and password.");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const token = generateAuthToken(user);
    res.cookie(token, token, cookieOptions);

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie(token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
    });
    res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully."));
});