import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Custom Error class dengan status code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * Catch semua error dan format response secara konsisten
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  // Check if it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  // Check if it's a Mongoose validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  }
  // Check if it's a Mongoose CastError (invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }
  // Check if it's a Mongoose duplicate key error
  else if (err.name === "MongoServerError" && (err as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
  }
  // Check if it's a JWT error
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error untuk debugging (hanya di development)
  if (process.env.NODE_ENV === "development") {
    logger.error(`❌ Error: ${err.message}`, {
      stack: err.stack,
      statusCode,
    });
  } else {
    logger.error(`❌ Error: ${err.message}`);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * Not Found handler
 * Untuk route yang tidak ditemukan
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Async handler wrapper
 * Untuk catch error di async functions
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
