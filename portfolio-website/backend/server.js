import dotenv from "dotenv" // load env first
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import notFound from "./src/middleawares/notFound.js";
import errorHandler from "./src/middleawares/errorHandler.js";
import aboutRouter from "./src/routes/about.routes.js";
import serviceRouter from "./src/routes/service.routes.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ...your other routes here...
app.use("/api/about", aboutRouter)
app.use("/api/services", serviceRouter);


app.get("/", (req, res) => {
  res.send("Welcome to api health check.")
})


app.use(notFound);
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