// Global Error Handler Middleware
// This catches all errors thrown in our routes and sends a proper JSON response

import { Request, Response, NextFunction } from "express";
import { AppError } from "../types";

// Error handling middleware - must have 4 parameters (err, req, res, next)
// Express knows it's an error handler because of the 4 params
function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;

  // Send a JSON response with the error details
  res.status(statusCode).json({
    success: false,
    error: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

export default errorHandler;
