import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // needed to read req.cookies in authMiddleware
import connectDB from "./src/config/db.js";;

import authRouter from "./src/routes/auth.routes.js";
import aboutRouter from "./src/routes/about.routes.js";
import serviceRouter from "./src/routes/service.routes.js";
import projectRouter from "./src/routes/project.routes.js";
import skillsRouter from "./src/routes/skill.routes.js";
import faqRouter from "./src/routes/faq.routes.js";
import testimonialRouter from "./src/routes/testimonial.routes.js";
import notFound from "./src/middleawares/notFound.js";
import errorHandler from "./src/middleawares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL, // e.g. "http://localhost:5173" — never leave this wide open in production
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to api health check.");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/about", aboutRouter);
app.use("/api/services", serviceRouter);
app.use("/api/projects", projectRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/testimonials", testimonialRouter);

// 404 handler — after all real routes
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();