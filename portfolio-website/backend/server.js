import dotenv from "dotenv" // load env first
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import notFound from "./src/middleawares/notFound.js";
import errorHandler from "./src/middleawares/errorHandler.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(notFound);

// ...your other routes here...

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
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