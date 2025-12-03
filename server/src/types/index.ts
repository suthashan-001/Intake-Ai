// Shared TypeScript Types for IntakeAI Server

import { Request } from "express";

// Extended Request type that includes user info after authentication
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// API endpoints will return data in this shape
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error with status code for error handler
export interface AppError extends Error {
  statusCode?: number;
}
