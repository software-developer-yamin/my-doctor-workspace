import "./config/env.js";
import compression from "compression";
import MongoStore from "connect-mongo";
import { cyanBright } from "console-log-colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import hpp from "hpp";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import session from "express-session";
import status from "express-status-monitor";
import helmet from "helmet";
import { createServer } from "http";
import mongoose from "mongoose";
import morgan from "morgan";
import { join } from "node:path";
import "./database/init_mongodb.js";
import "./database/init_redis.js";
import routes from "./routes/routes.js";
import apiLimiter from "./middlewares/shared/rate_limiter.js";
import { logger } from "./utils/logger.js";
import { setupLogsDirectory } from "./utils/setupLogs.js";
import { errorResponse } from "./utils/errorResponse.js";

interface CustomError extends Error {
  status?: number;
  code?: string;
}

// import.meta.dirname = apps/server/dist/ at runtime after tsc compile
const SERVER_ROOT = join(import.meta.dirname, "..");
const ADMIN_DIST = join(import.meta.dirname, "../../admin/dist");

setupLogsDirectory();

const app: express.Application = express();
app.set('query parser', 'extended');
const httpServer = createServer(app);

app.use(status());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not permitted`));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));
app.use('/uploads', express.static(join(SERVER_ROOT, "public", "uploads")));
app.use(express.static(ADMIN_DIST));
app.use(cookieParser());
app.use(compression());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }) as any,
  })
);

app.use("/api", apiLimiter, routes);

// SPA fallback for the admin frontend
app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(join(ADMIN_DIST, "index.html"));
});

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || (status === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  return errorResponse(res, status, message, code, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = httpServer.listen(PORT, () =>
  logger.info(
    cyanBright(`Server running on port ${PORT} with pid ${process.pid}`)
  )
);

process.on("SIGINT", () => {
  logger.info("SIGINT Received");
  server.close(() => {
    mongoose.connection.close().then(() => {
      process.exit(0);
    });
    logger.info("Server Closed ....");
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM Received");
  server.close(() => {
    mongoose.connection.close().then(() => {
      process.exit(0);
    });
    logger.info("Server Closed ....");
  });
});

export default app;
