import mongoose from "mongoose";
import logger from "./logger";
import { env } from "./env";

const MONGODB_URI = env.DB_URL as string;

export async function connectToDb(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    logger.info(`✅ Successfully connected to MongoDB at ${MONGODB_URI}`);
  } catch (error) {
    logger.error("❌ Initial MongoDB connection failed:", error);
    process.exit(1); // Exit process if DB connection fails initially
  }

  mongoose.connection.on("connected", () => {
    logger.info("🔁 MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("❗ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("🛑 MongoDB connection closed on app termination");
    process.exit(0);
  });
}
