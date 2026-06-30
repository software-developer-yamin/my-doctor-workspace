import { cyanBright } from "console-log-colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { runBootstrap } from "../bootstrap.js";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 12; // 1 minute of retries

if (!MONGO_URI) {
  logger.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

let bootstrapRan = false;

const connectDB = async (attempt = 1): Promise<void> => {
  try {
    logger.info(`Connecting to MongoDB (attempt ${attempt})...`);

    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      heartbeatFrequencyMS: 10000,
      family: 4, // force IPv4 — avoids SRV DNS timeout on some hosts
    });

    logger.info(cyanBright(`${process.env.DB_NAME} Connected: ${mongoose.connection.host}`));

    if (!bootstrapRan) {
      bootstrapRan = true;
      runBootstrap();
    }
  } catch (error: any) {
    logger.error(`MongoDB connection failed (attempt ${attempt}): ${error.message}`);

    if (attempt >= MAX_RETRIES) {
      logger.error("Max retries reached. Exiting.");
      process.exit(1);
    }

    logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return connectDB(attempt + 1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.error("MongoDB disconnected. Reconnecting...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

connectDB();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
