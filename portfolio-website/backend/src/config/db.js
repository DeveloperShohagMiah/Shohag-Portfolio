import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Sync indexes with schema (dev only).
        // This drops indexes that exist in the DB but not in the schema,
        // and creates indexes declared in the schema that are missing.
        // Fixes stale indexes like `name_1` left over from old schemas.
        if (process.env.NODE_ENV !== "production") {
            await mongoose.connection.syncIndexes();
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;