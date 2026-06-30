import { cyan } from "console-log-colors";
import { Redis } from "ioredis";
import { logger } from "../utils/logger.js";

const client = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    if (times > 10) return null;
    return Math.min(times * 100, 3000);
  },
});

client.on("connect", () => {
  logger.info("Redis client connected...");
});

client.on("ready", () => {
  logger.info(cyan("Redis client ready to use..."));
});

client.on("error", (err: Error) => {
  logger.error(`Redis client error: ${err.message}`);
});

client.on("close", () => {
  logger.info("Redis client disconnected");
});

export { client };
export default client;
