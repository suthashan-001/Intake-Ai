// Authentication Middleware

// This middleware checks if the user is logged in by verifying their JWT token
// If valid, it attaches the userId to the request object for use in routes

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types";

// Extend the Express Request type to include userId
// This lets us access req.userId in our route handlers
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// shape of JWT payload
interface JwtPayload {
  userId: string;
  email: string;
}

// Get the JWT secret from environment variables
// Throw error immediately if not set - fail fast
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response: ApiResponse<null> = {
        success: false,
        error: "No token provided. Please log in.",
      };
      return res.status(401).json(response);
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach the userId to the request object
    // this allows route handlers to access req.userId
    req.userId = decoded.userId;

    next();
  } catch (error) {
    // Token is invalid or expired
    const response: ApiResponse<null> = {
      success: false,
      error: "Invalid or expired token. Please log in again.",
    };
    return res.status(401).json(response);
  }
}

export default authMiddleware;
export { JWT_SECRET };
