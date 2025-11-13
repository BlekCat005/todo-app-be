import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";
import { apiLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import { setupSwagger } from "./config/swagger";
import logger from "./utils/logger";

dotenv.config(); // membaca file .env

const app: Express = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Whitelist specific origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3001",
  "http://localhost:3000", // untuk development
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions)); // ✅ CORS dengan whitelist
app.use(express.json()); // supaya backend ngerti body JSON

// Request logging
app.use(requestLogger);

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes); // <-- Rute Autentikasi
app.use("/api", todoRoutes); // <-- Rute Todo

// 404 handler - Must be after all routes
app.use(notFoundHandler);

// Error handler - Must be last
app.use(errorHandler);

// Koneksi ke MongoDB dan run server
// ... (sisanya tidak berubah)
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    logger.info("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("❌ MongoDB connection error: " + error.message);
    process.exit(1);
  });
