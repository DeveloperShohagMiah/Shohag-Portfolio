import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateAuthToken = (user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token;
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });

};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateAuthToken(user);
    res.status(200).json({ token });
}

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
}

